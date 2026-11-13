/**
 * storage.ts
 * Robust Local Storage manager for MOCHI.
 * Handles serialization, schema validation, elapsed-time catch-up, and error recovery.
 */

import { PetState, TaskItem } from '../types/pet';
import { STORAGE_KEYS } from './petConfig';
import { calculateDecay } from './petStateMachine';
import { INITIAL_TASKS } from './mockData';

export interface AppSettings {
  isMuted: boolean;
  hapticsEnabled: boolean;
  chassisMode: boolean;
  notificationsEnabled: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  isMuted: false,
  hapticsEnabled: true,
  chassisMode: false,
  notificationsEnabled: false
};

export const DEFAULT_PET_STATE: PetState = {
  name: 'Mochi',
  currentEmotion: 'happy',
  emotionLockedUntil: 0,
  hunger: 35,          // 35% hunger (healthy/satiated baseline)
  happiness: 85,       // 85% joy
  energy: 90,          // 90% energy
  isSleeping: false,
  berriesCount: 5,     // 5 starter digital berries
  pairingCode: 'MCH-842',
  lastFedTimestamp: Date.now(),
  lastInteractedTimestamp: Date.now(),
  lastSleptTimestamp: Date.now()
};

/**
 * Load Pet State from Local Storage and calculate elapsed time decay.
 */
export const loadPetState = (): { state: PetState; elapsedSeconds: number } => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PET_STATE);
    if (!raw) {
      return { state: DEFAULT_PET_STATE, elapsedSeconds: 0 };
    }

    const parsed = JSON.parse(raw) as Partial<PetState>;
    
    // Validate schema keys
    if (
      typeof parsed.hunger !== 'number' ||
      typeof parsed.happiness !== 'number' ||
      typeof parsed.energy !== 'number'
    ) {
      console.warn('[MOCHI Storage] Corrupted pet state detected. Restoring clean defaults.');
      return { state: DEFAULT_PET_STATE, elapsedSeconds: 0 };
    }

    const lastSavedTime = parsed.lastInteractedTimestamp || Date.now();
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - lastSavedTime) / 1000));

    // Combine with default shape to guarantee all fields exist
    const baseState: PetState = {
      ...DEFAULT_PET_STATE,
      ...parsed,
      name: parsed.name || 'Mochi',
      pairingCode: parsed.pairingCode || 'MCH-842'
    };

    // Apply elapsed time decay
    const refreshedState = calculateDecay(baseState, elapsedSeconds);

    return { state: refreshedState, elapsedSeconds };
  } catch (err) {
    console.error('[MOCHI Storage] Failed to load pet state from localStorage:', err);
    return { state: DEFAULT_PET_STATE, elapsedSeconds: 0 };
  }
};

/**
 * Save Pet State to Local Storage.
 */
export const savePetState = (state: PetState): void => {
  try {
    const stateToSave: PetState = {
      ...state,
      lastInteractedTimestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.PET_STATE, JSON.stringify(stateToSave));
  } catch (err) {
    console.error('[MOCHI Storage] Failed to persist pet state:', err);
  }
};

/**
 * Load Tasks from Local Storage.
 */
export const loadTasks = (): TaskItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_TASKS;
  } catch (err) {
    console.error('[MOCHI Storage] Failed to load tasks from localStorage:', err);
    return INITIAL_TASKS;
  }
};

/**
 * Save Tasks to Local Storage.
 */
export const saveTasks = (tasks: TaskItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error('[MOCHI Storage] Failed to persist tasks:', err);
  }
};

/**
 * Load Settings from Local Storage.
 */
export const loadSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

/**
 * Save Settings to Local Storage.
 */
export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('[MOCHI Storage] Failed to persist settings:', err);
  }
};

