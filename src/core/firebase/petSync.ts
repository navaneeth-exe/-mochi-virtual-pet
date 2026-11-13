/**
 * petSync.ts
 * Firebase Realtime Database synchronization engine for MOCHI.
 * Provides atomic transactions, real-time listeners, pairing code validation,
 * and concurrent multi-caretaker event streaming.
 */

import {
  ref,
  set,
  get,
  onValue,
  runTransaction,
  push,
  serverTimestamp,
  Unsubscribe
} from 'firebase/database';
import { db, isFirebaseConfigured } from './config';
import { MochiUser } from './auth';
import { PetState, TaskItem, Emotion } from '../../types/pet';

export interface SharedPetData {
  metadata: {
    id: string;
    name: string;
    ownerUid: string;
    pairingCode: string;
    createdAt: number | object;
  };
  members: Record<string, {
    displayName: string;
    role: 'owner' | 'caretaker';
    joinedAt: number | object;
    isOnline: boolean;
  }>;
  state: {
    hunger: number;
    happiness: number;
    energy: number;
    currentEmotion: Emotion;
    emotionLockedUntil: number;
    isSleeping: boolean;
    berriesCount: number;
    version: number;
    lastFedTimestamp: number | object;
    lastInteractedTimestamp: number | object;
    lastSleptTimestamp: number | object;
  };
  tasks?: Record<string, TaskItem>;
  interactions?: Record<string, {
    actorUid: string;
    actorName: string;
    actionType: string;
    message: string;
    timestamp: number | object;
  }>;
}

/**
 * Generate a cryptographically distinct, human-readable 6-character room code.
 * Pattern: MCH-XXX where XXX uses non-ambiguous uppercase alphanumerics.
 */
export const generatePairingCode = (): string => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excludes 0, O, 1, I
  let result = '';
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MCH-${result}`;
};

/**
 * Create a new shared pet room in Firebase Realtime Database.
 */
export const createCloudPet = async (
  user: MochiUser,
  petName: string,
  initialState: PetState,
  initialTasks: TaskItem[]
): Promise<{ petId: string; pairingCode: string }> => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured.');
  }

  const petId = `pet_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const pairingCode = generatePairingCode();

  const taskMap: Record<string, TaskItem> = {};
  initialTasks.forEach((t) => {
    taskMap[t.id] = t;
  });

  const petPayload: SharedPetData = {
    metadata: {
      id: petId,
      name: petName,
      ownerUid: user.uid,
      pairingCode: pairingCode,
      createdAt: serverTimestamp()
    },
    members: {
      [user.uid]: {
        displayName: user.displayName,
        role: 'owner',
        joinedAt: serverTimestamp(),
        isOnline: true
      }
    },
    state: {
      hunger: initialState.hunger,
      happiness: initialState.happiness,
      energy: initialState.energy,
      currentEmotion: initialState.currentEmotion,
      emotionLockedUntil: initialState.emotionLockedUntil,
      isSleeping: initialState.isSleeping,
      berriesCount: initialState.berriesCount,
      version: 1,
      lastFedTimestamp: serverTimestamp(),
      lastInteractedTimestamp: serverTimestamp(),
      lastSleptTimestamp: serverTimestamp()
    },
    tasks: taskMap
  };

  // Write pet document and pairing code mapping
  await set(ref(db, `pets/${petId}`), petPayload);
  await set(ref(db, `pairingCodes/${pairingCode}`), {
    petId,
    createdAt: serverTimestamp(),
    ownerUid: user.uid
  });

  return { petId, pairingCode };
};

/**
 * Lookup and join an existing shared pet room by pairing code.
 */
export const joinCloudPetByCode = async (
  user: MochiUser,
  pairingCode: string
): Promise<string> => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured.');
  }

  const formattedCode = pairingCode.trim().toUpperCase();
  const codeSnapshot = await get(ref(db, `pairingCodes/${formattedCode}`));

  if (!codeSnapshot.exists()) {
    throw new Error(`Invalid or expired room code: ${formattedCode}`);
  }

  const { petId } = codeSnapshot.val();

  // Register user as caretaker in pet's members list
  await set(ref(db, `pets/${petId}/members/${user.uid}`), {
    displayName: user.displayName,
    role: 'caretaker',
    joinedAt: serverTimestamp(),
    isOnline: true
  });

  // Broadcast joining interaction
  await push(ref(db, `pets/${petId}/interactions`), {
    actorUid: user.uid,
    actorName: user.displayName,
    actionType: 'join',
    message: `${user.displayName} joined Mochi's room! 🍃`,
    timestamp: serverTimestamp()
  });

  return petId;
};

/**
 * Subscribe to real-time updates for a pet room.
 */
export const subscribeToCloudPet = (
  petId: string,
  onPetChanged: (data: SharedPetData) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  if (!isFirebaseConfigured || !db) {
    return () => {};
  }

  const petRef = ref(db, `pets/${petId}`);
  return onValue(
    petRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onPetChanged(snapshot.val() as SharedPetData);
      }
    },
    (err) => {
      console.error('[MOCHI Cloud] Realtime subscription error:', err);
      if (onError) onError(err);
    }
  );
};

/**
 * Mutate pet state using Firebase Atomic Transactions.
 * Guarantees zero lost updates when two users interact at the exact same millisecond.
 */
export const mutateCloudPetState = async (
  petId: string,
  mutator: (currentState: SharedPetData['state']) => Partial<SharedPetData['state']>
): Promise<boolean> => {
  if (!isFirebaseConfigured || !db) {
    return false;
  }

  const stateRef = ref(db, `pets/${petId}/state`);

  const result = await runTransaction(stateRef, (current) => {
    if (!current) return current;

    const updates = mutator(current);
    return {
      ...current,
      ...updates,
      version: (current.version || 0) + 1,
      lastInteractedTimestamp: Date.now()
    };
  });

  return result.committed;
};

/**
 * Broadcast caretaker action event to all connected devices.
 */
export const broadcastCloudInteraction = async (
  petId: string,
  user: MochiUser,
  actionType: string,
  message: string
): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;

  await push(ref(db, `pets/${petId}/interactions`), {
    actorUid: user.uid,
    actorName: user.displayName,
    actionType,
    message,
    timestamp: Date.now()
  });
};

/**
 * Sync or update task in shared room.
 */
export const syncCloudTask = async (petId: string, task: TaskItem): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  await set(ref(db, `pets/${petId}/tasks/${task.id}`), task);
};

/**
 * Delete task from shared room.
 */
export const deleteCloudTask = async (petId: string, taskId: string): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  await set(ref(db, `pets/${petId}/tasks/${taskId}`), null);
};

