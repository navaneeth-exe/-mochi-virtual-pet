/**
 * petStateMachine.ts
 * Pure deterministic state machine and game math for MOCHI.
 * Follows the strict rule of zero external mutations and pure state transitions.
 */

import { PetState, Emotion } from '../types/pet';
import {
  STAT_BOUNDS,
  ACTION_EFFECTS,
  DECAY_RATES,
  EMOTION_THRESHOLDS
} from './petConfig';

/**
 * Clamp stat safely between 0 and 100.
 */
export const clampStat = (value: number): number => {
  return Math.max(STAT_BOUNDS.MIN, Math.min(STAT_BOUNDS.MAX, Math.round(value * 10) / 10));
};

/**
 * Determine baseline emotion strictly based on current vitals.
 * Only applies when no transient emotion lock is active.
 */
export const determineBaseEmotion = (stats: {
  happiness: number;
  hunger: number;
  energy: number;
  isSleeping: boolean;
}): Emotion => {
  if (stats.isSleeping) {
    return 'idle';
  }

  // 1. Sad Conditions: Very low happiness OR extreme hunger OR total exhaustion
  if (
    stats.happiness <= EMOTION_THRESHOLDS.SAD_MAX_HAPPINESS ||
    stats.hunger >= EMOTION_THRESHOLDS.SAD_MIN_HUNGER ||
    stats.energy <= EMOTION_THRESHOLDS.SAD_MAX_ENERGY
  ) {
    return 'sad';
  }

  // 2. Happy Conditions: High joy AND low/moderate hunger
  if (
    stats.happiness >= EMOTION_THRESHOLDS.HAPPY_MIN_HAPPINESS &&
    stats.hunger <= EMOTION_THRESHOLDS.HAPPY_MAX_HUNGER
  ) {
    return 'happy';
  }

  // 3. Default content baseline
  return 'idle';
};

/**
 * Calculate natural time-based decay or recovery given elapsed seconds.
 * Pure and deterministic; safe for foreground interval and background catch-up.
 */
export const calculateDecay = (current: PetState, elapsedSeconds: number): PetState => {
  if (elapsedSeconds <= 0) return current;

  // Cap catch-up time to avoid punishing the user for days of absence
  const effectiveSeconds = Math.min(elapsedSeconds, DECAY_RATES.MAX_OFFLINE_CATCHUP_SECONDS);
  const elapsedHours = effectiveSeconds / 3600;

  let newHunger = current.hunger;
  let newHappiness = current.happiness;
  let newEnergy = current.energy;

  if (current.isSleeping) {
    // Sleeping: Energy recovers rapidly, hunger grows slowly
    newEnergy = clampStat(current.energy + elapsedHours * DECAY_RATES.SLEEP_ENERGY_RECOVERY_PER_HOUR);
    newHunger = clampStat(current.hunger + elapsedHours * DECAY_RATES.SLEEP_HUNGER_PER_HOUR);
  } else {
    // Awake: Hunger increases, energy and happiness gradually decay
    newHunger = clampStat(current.hunger + elapsedHours * DECAY_RATES.AWAKE_HUNGER_PER_HOUR);
    newEnergy = clampStat(current.energy - elapsedHours * DECAY_RATES.AWAKE_ENERGY_PER_HOUR);
    newHappiness = clampStat(current.happiness - elapsedHours * DECAY_RATES.AWAKE_HAPPINESS_DECAY_PER_HOUR);
  }

  // Check if emotion lock has expired
  const now = Date.now();
  let nextEmotion = current.currentEmotion;
  if (now >= current.emotionLockedUntil) {
    nextEmotion = determineBaseEmotion({
      happiness: newHappiness,
      hunger: newHunger,
      energy: newEnergy,
      isSleeping: current.isSleeping
    });
  }

  return {
    ...current,
    hunger: newHunger,
    happiness: newHappiness,
    energy: newEnergy,
    currentEmotion: nextEmotion,
    lastInteractedTimestamp: current.isSleeping ? current.lastInteractedTimestamp : current.lastInteractedTimestamp
  };
};

export interface ActionResult {
  nextState: PetState;
  status: 'success' | 'full' | 'no_berries' | 'tired' | 'angry' | 'sleeping' | 'woken';
  message: string;
  soundType?: 'bite' | 'victory' | 'purr' | 'sleep' | 'chirp' | 'run';
}

/**
 * Feed Mochi a digital berry.
 */
export const feedPet = (current: PetState): ActionResult => {
  if (current.isSleeping) {
    return {
      nextState: current,
      status: 'sleeping',
      message: "Mochi is sound asleep! Wake Mochi gently before feeding."
    };
  }

  if (current.berriesCount < ACTION_EFFECTS.FEED.BERRY_COST) {
    return {
      nextState: current,
      status: 'no_berries',
      message: "No berries in inventory! Check off daily tasks to earn more 🍓."
    };
  }

  // If hunger <= 10, Mochi is completely full
  if (current.hunger <= ACTION_EFFECTS.FEED.MIN_HUNGER_THRESHOLD) {
    return {
      nextState: {
        ...current,
        currentEmotion: 'happy',
        emotionLockedUntil: Date.now() + 3000
      },
      status: 'full',
      message: "Mochi is completely stuffed! No more room right now! 😊",
      soundType: 'chirp'
    };
  }

  const nextHunger = clampStat(current.hunger + ACTION_EFFECTS.FEED.HUNGER_DELTA);
  const nextHappiness = clampStat(current.happiness + ACTION_EFFECTS.FEED.HAPPINESS_DELTA);
  const now = Date.now();

  return {
    nextState: {
      ...current,
      hunger: nextHunger,
      happiness: nextHappiness,
      berriesCount: current.berriesCount - ACTION_EFFECTS.FEED.BERRY_COST,
      currentEmotion: 'happy',
      emotionLockedUntil: now + EMOTION_THRESHOLDS.EMOTION_LOCK_DEFAULT_MS,
      lastFedTimestamp: now,
      lastInteractedTimestamp: now
    },
    status: 'success',
    message: "Nom nom nom! Delicious digital berry! 🍓 (Hunger -25%)",
    soundType: 'bite'
  };
};

/**
 * Play with Mochi.
 */
export const playWithPet = (current: PetState): ActionResult => {
  if (current.isSleeping) {
    return {
      nextState: current,
      status: 'sleeping',
      message: "Shhh... Mochi is dreaming! Wake Mochi up to play."
    };
  }

  if (current.energy < ACTION_EFFECTS.PLAY.MIN_ENERGY_THRESHOLD) {
    const now = Date.now();
    return {
      nextState: {
        ...current,
        currentEmotion: 'sad',
        emotionLockedUntil: now + 3000
      },
      status: 'tired',
      message: "Mochi is too exhausted to play right now. Let Mochi sleep a bit! 💤",
      soundType: 'chirp'
    };
  }

  const nextHappiness = clampStat(current.happiness + ACTION_EFFECTS.PLAY.HAPPINESS_DELTA);
  const nextEnergy = clampStat(current.energy + ACTION_EFFECTS.PLAY.ENERGY_DELTA);
  const nextHunger = clampStat(current.hunger + ACTION_EFFECTS.PLAY.HUNGER_DELTA);
  const now = Date.now();

  return {
    nextState: {
      ...current,
      happiness: nextHappiness,
      energy: nextEnergy,
      hunger: nextHunger,
      currentEmotion: 'happy',
      emotionLockedUntil: now + 3800,
      lastInteractedTimestamp: now
    },
    status: 'success',
    message: "Wheeee! Playing catch with Mochi! Joy +18%, Energy -14% ✨",
    soundType: 'victory'
  };
};

/**
 * Pet Mochi (gentle affection or rapid poking detector).
 */
export const petCompanion = (current: PetState, rapidPokes: number = 0): ActionResult => {
  if (current.isSleeping) {
    return {
      nextState: current,
      status: 'sleeping',
      message: "Mochi is peacefully sleeping. Tap Wake to say hello! 🌙"
    };
  }

  const now = Date.now();

  // Rapid poking detector: if user clicks too frantically, Mochi gets annoyed
  if (rapidPokes >= ACTION_EFFECTS.PET.RAPID_POKE_LIMIT) {
    return {
      nextState: {
        ...current,
        currentEmotion: 'angry',
        emotionLockedUntil: now + 4000,
        happiness: clampStat(current.happiness - 5)
      },
      status: 'angry',
      message: "Hey! Too much poking! Please be gentle with Mochi! 💢",
      soundType: 'chirp'
    };
  }

  const nextHappiness = clampStat(current.happiness + ACTION_EFFECTS.PET.HAPPINESS_DELTA);

  return {
    nextState: {
      ...current,
      happiness: nextHappiness,
      currentEmotion: 'happy',
      emotionLockedUntil: now + 3200,
      lastInteractedTimestamp: now
    },
    status: 'success',
    message: "*Purrrr*... Mochi loves gentle head pats! ❤️",
    soundType: 'purr'
  };
};

/**
 * Toggle Sleep mode (Sleep <-> Wake).
 */
export const toggleSleep = (current: PetState): ActionResult => {
  const now = Date.now();

  if (current.isSleeping) {
    // Waking up
    const nextEmotion = determineBaseEmotion({
      happiness: current.happiness,
      hunger: current.hunger,
      energy: current.energy,
      isSleeping: false
    });

    return {
      nextState: {
        ...current,
        isSleeping: false,
        currentEmotion: nextEmotion,
        emotionLockedUntil: 0,
        lastInteractedTimestamp: now
      },
      status: 'woken',
      message: "Good morning! Mochi woke up refreshed and ready! ☀️",
      soundType: 'chirp'
    };
  } else {
    // Entering sleep
    return {
      nextState: {
        ...current,
        isSleeping: true,
        currentEmotion: 'idle',
        emotionLockedUntil: 0,
        lastSleptTimestamp: now
      },
      status: 'sleeping',
      message: "Goodnight! Mochi entered low-power chip standby mode. 🌙💤",
      soundType: 'sleep'
    };
  }
};

/**
 * Task 1 Gesture 1: Spacebar Sprint
 */
export const spacebarSprint = (current: PetState): ActionResult => {
  if (current.isSleeping) {
    return {
      nextState: current,
      status: 'sleeping',
      message: "Cannot run while sleeping!"
    };
  }

  if (current.energy < ACTION_EFFECTS.SPACEBAR_RUN.MIN_ENERGY_THRESHOLD) {
    const now = Date.now();
    return {
      nextState: {
        ...current,
        currentEmotion: 'sad',
        emotionLockedUntil: now + 2500
      },
      status: 'tired',
      message: "Too tired to sprint! Rest a bit first.",
      soundType: 'chirp'
    };
  }

  const now = Date.now();
  const nextHappiness = clampStat(current.happiness + ACTION_EFFECTS.SPACEBAR_RUN.HAPPINESS_DELTA);
  const nextEnergy = clampStat(current.energy + ACTION_EFFECTS.SPACEBAR_RUN.ENERGY_DELTA);
  const nextHunger = clampStat(current.hunger + ACTION_EFFECTS.SPACEBAR_RUN.HUNGER_DELTA);

  return {
    nextState: {
      ...current,
      happiness: nextHappiness,
      energy: nextEnergy,
      hunger: nextHunger,
      currentEmotion: 'happy',
      emotionLockedUntil: now + 3000,
      lastInteractedTimestamp: now
    },
    status: 'success',
    message: "Sprint mode activated! Mochi zipped across the room! ⚡",
    soundType: 'run'
  };
};

/**
 * Task 1 Gesture 2: Double-Tap Super Happy
 */
export const doubleTapCelebration = (current: PetState): ActionResult => {
  if (current.isSleeping) {
    return {
      nextState: current,
      status: 'sleeping',
      message: "Mochi is sleeping softly..."
    };
  }

  const now = Date.now();
  const nextHappiness = clampStat(current.happiness + ACTION_EFFECTS.DOUBLE_TAP.HAPPINESS_DELTA);
  const nextEnergy = clampStat(current.energy + ACTION_EFFECTS.DOUBLE_TAP.ENERGY_DELTA);

  return {
    nextState: {
      ...current,
      happiness: nextHappiness,
      energy: nextEnergy,
      currentEmotion: 'happy',
      emotionLockedUntil: now + ACTION_EFFECTS.DOUBLE_TAP.EMOTION_LOCK_MS,
      lastInteractedTimestamp: now
    },
    status: 'success',
    message: "Double-Tap Super Happy! Mochi leaps for joy! 🌟🎉",
    soundType: 'victory'
  };
};
