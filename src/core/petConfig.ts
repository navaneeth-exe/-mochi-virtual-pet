/**
 * petConfig.ts
 * Centralized configuration constants, thresholds, and rates for MOCHI.
 *
 * STAT INTERPRETATION (Strictly Documented):
 * - HAPPINESS (0 - 100): Higher is better. 0 = Depressed/Grieving, 100 = Joyous/Ecstatic.
 * - HUNGER (0 - 100): Higher means MORE HUNGRY. 0 = Completely Full/Satiated, 100 = Starving.
 * - ENERGY (0 - 100): Higher is better. 0 = Completely Exhausted, 100 = Fully Energized.
 */

export const STAT_BOUNDS = {
  MIN: 0,
  MAX: 100
} as const;

export const ACTION_EFFECTS = {
  // Feeding reduces hunger (moves closer to 0) and grants small happiness boost
  FEED: {
    HUNGER_DELTA: -25,       // Hunger drops by 25 (more full)
    HAPPINESS_DELTA: 8,      // Small happiness boost
    BERRY_COST: 1,           // Consumes 1 inventory berry
    MIN_HUNGER_THRESHOLD: 10 // If hunger <= 10, Mochi is too full to eat
  },
  // Playing increases joy, costs energy, and burns calories (increases hunger)
  PLAY: {
    HAPPINESS_DELTA: 18,
    ENERGY_DELTA: -14,
    HUNGER_DELTA: 8,         // Activity makes Mochi hungrier
    MIN_ENERGY_THRESHOLD: 15 // Cannot play if energy is too low
  },
  // Petting provides gentle affection
  PET: {
    HAPPINESS_DELTA: 7,
    RAPID_POKE_LIMIT: 5,     // Tapping > 5 times in 2 seconds triggers annoyance
    RAPID_POKE_WINDOW_MS: 2000
  },
  // Task 1 Gesture 1: Spacebar Sprint
  SPACEBAR_RUN: {
    HAPPINESS_DELTA: 10,
    ENERGY_DELTA: -8,
    HUNGER_DELTA: 5,
    MIN_ENERGY_THRESHOLD: 12
  },
  // Task 1 Gesture 2: Double-Tap Super Happy
  DOUBLE_TAP: {
    HAPPINESS_DELTA: 15,
    ENERGY_DELTA: -5,
    EMOTION_LOCK_MS: 4000
  },
  // Task 1 Gesture 3: Drag to Top Feed
  FEED_AT_TOP: {
    HUNGER_DELTA: -25,
    HAPPINESS_DELTA: 10,
    BERRY_COST: 1,
    MIN_HUNGER_THRESHOLD: 10
  }
} as const;

// Natural time-based decay and recovery rates (in points per hour)
export const DECAY_RATES = {
  // Waking decay rates
  AWAKE_HUNGER_PER_HOUR: 8.0,        // +8% hunger per hour awake (~0.00222% / sec)
  AWAKE_ENERGY_PER_HOUR: 5.0,        // -5% energy per hour awake (~0.00139% / sec)
  AWAKE_HAPPINESS_DECAY_PER_HOUR: 4.0,// -4% happiness per hour if neglected (~0.00111% / sec)

  // Sleeping rates
  SLEEP_ENERGY_RECOVERY_PER_HOUR: 25.0, // +25% energy per hour while sleeping (~0.00694% / sec)
  SLEEP_HUNGER_PER_HOUR: 2.5,           // Slower hunger gain while resting (~0.00069% / sec)

  // Safety caps for background catch-up
  MAX_OFFLINE_CATCHUP_SECONDS: 86400,   // Max 24 hours of decay applied on resume
  TICK_INTERVAL_MS: 4000                // Active foreground state evaluation interval
} as const;

// Emotion selection thresholds
export const EMOTION_THRESHOLDS = {
  HAPPY_MIN_HAPPINESS: 70,
  HAPPY_MAX_HUNGER: 45,

  SAD_MAX_HAPPINESS: 25,
  SAD_MIN_HUNGER: 75,
  SAD_MAX_ENERGY: 12,

  EMOTION_LOCK_DEFAULT_MS: 3800 // Duration for transient emotion overrides
} as const;

// Local storage key constants
export const STORAGE_KEYS = {
  PET_STATE: 'mochi_pet_state_v1',
  TASKS: 'mochi_tasks_v1',
  SETTINGS: 'mochi_settings_v1',
  STREAK: 'mochi_streak_v1'
} as const;

