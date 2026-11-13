/**
 * auth.ts
 * Firebase Anonymous Authentication & User Identity service for MOCHI.
 * Provides frictionless onboarding without registration, preserves user sessions,
 * and maintains consistent user identities.
 */

import {
  signInAnonymously as firebaseSignInAnonymously,
  onAuthStateChanged,
  User as FirebaseUser,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config';

export interface MochiUser {
  uid: string;
  isAnonymous: boolean;
  displayName: string;
}

const LOCAL_USER_KEY = 'mochi_local_user_v1';

/**
 * Get or create local user session fallback when Firebase is not configured.
 */
export const getLocalUserSession = (): MochiUser => {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const sessionRaw = sessionStorage.getItem('mochi_session_user');
      if (sessionRaw) return JSON.parse(sessionRaw);
    }
  } catch (e) {}

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const localRaw = localStorage.getItem(LOCAL_USER_KEY);
      if (localRaw) {
        const parsed = JSON.parse(localRaw);
        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.setItem('mochi_session_user', JSON.stringify(parsed));
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse local user session:', e);
  }

  const generated: MochiUser = {
    uid: 'anon_' + Math.random().toString(36).substring(2, 10),
    isAnonymous: true,
    displayName: 'Caretaker ' + Math.floor(100 + Math.random() * 900)
  };
  try {
    if (typeof window !== 'undefined') {
      if (window.sessionStorage) sessionStorage.setItem('mochi_session_user', JSON.stringify(generated));
      if (window.localStorage && !localStorage.getItem(LOCAL_USER_KEY)) {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(generated));
      }
    }
  } catch {}
  return generated;
};

/**
 * Authenticate user anonymously via Firebase or fallback session.
 */
export const authenticateUser = async (): Promise<MochiUser> => {
  if (isFirebaseConfigured && auth) {
    try {
      const cred = await firebaseSignInAnonymously(auth);
      return {
        uid: cred.user.uid,
        isAnonymous: cred.user.isAnonymous,
        displayName: cred.user.displayName || 'Caretaker ' + cred.user.uid.substring(0, 4).toUpperCase()
      };
    } catch (err) {
      console.warn('[MOCHI Auth] Firebase anonymous auth failed, falling back to local session:', err);
      return getLocalUserSession();
    }
  }

  return getLocalUserSession();
};

/**
 * Listen for auth state changes.
 */
export const subscribeToAuth = (
  callback: (user: MochiUser | null) => void
): (() => void) => {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        callback({
          uid: fbUser.uid,
          isAnonymous: fbUser.isAnonymous,
          displayName: fbUser.displayName || 'Caretaker ' + fbUser.uid.substring(0, 4).toUpperCase()
        });
      } else {
        callback(getLocalUserSession());
      }
    });
  }

  // Local fallback
  callback(getLocalUserSession());
  return () => {};
};

/**
 * Sign out user.
 */
export const signOutUser = async (): Promise<void> => {
  if (isFirebaseConfigured && auth) {
    await firebaseSignOut(auth);
  }
  localStorage.removeItem(LOCAL_USER_KEY);
};
