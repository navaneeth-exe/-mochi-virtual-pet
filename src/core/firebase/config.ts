/**
 * config.ts
 * Centralized Firebase configuration and initialization for MOCHI.
 * Safely loads environment variables, prevents duplicate app initialization,
 * and gracefully falls back when configuration is missing.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const rawConfig: Partial<FirebaseConfig> = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const isFirebaseConfigured = Boolean(
  rawConfig.apiKey &&
  rawConfig.apiKey !== 'AIzaSyExampleKey_ReplaceWithYourActualKey' &&
  rawConfig.databaseURL &&
  rawConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Database | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(rawConfig as FirebaseConfig) : getApp();
    auth = getAuth(app);
    db = getDatabase(app);
    console.log('[MOCHI Firebase] Successfully connected to live Firebase instance.');
  } catch (err) {
    console.warn('[MOCHI Firebase] Failed to initialize Firebase SDK:', err);
  }
} else {
  console.log('[MOCHI Firebase] Live credentials not provided in .env. Operating in Multi-Device Channel Mode.');
}

export { app, auth, db };

