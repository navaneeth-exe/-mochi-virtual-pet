/**
 * dialogues.ts
 * Contextual, warm, non-guilt-inducing dialogue library for MOCHI.
 * Generates natural thought bubbles and speech depending on current vitals and task milestones.
 */

import { PetState, TaskItem } from '../types/pet';

export const CONTEXTUAL_DIALOGUES = {
  // When Mochi is hungry (hunger > 70)
  HUNGRY: [
    "My tummy is doing a tiny rumble... got any digital berries? 🍓",
    "A small snack would be lovely right now! 😋",
    "Dreaming of sweet ripe berries... 🍓✨",
    "Paging my favorite human caretaker: snack time? 😊"
  ],

  // When Mochi is satisfied and full (hunger <= 25)
  FULL: [
    "My tummy is happy and warm! Thank you! 🌸",
    "All full of berries! Ready for anything! ✨",
    "Feeling nourished and content. 😊"
  ],

  // When Mochi is exhausted (energy < 20)
  TIRED: [
    "Yaaawn... my energy is dipping, maybe a quick power nap? 💤",
    "Heavy eyelids... chip standby mode sounds so cozy right now. 🌙",
    "A short sleep would recharge my silicon heart! 🛌"
  ],

  // When Mochi is sad or lonely (happiness < 25)
  SAD: [
    "Could use a gentle head pat today... ❤️",
    "Feeling a little quiet. Let's do something nice together? 🌧️",
    "A small double-tap always brightens my day! 🌸"
  ],

  // When Mochi is super happy (happiness > 80)
  JOYOUS: [
    "I'm so glad we're companions! Best day ever! 🌟",
    "My leaves are wiggling with excitement! 🍃",
    "You make my semiconductor heart tick happily! 💖",
    "Bouncing with joy today! Let's conquer our goals!"
  ],

  // When all tasks are completed
  ALL_TASKS_DONE: [
    "All tasks crushed today! You're an absolute star! 🏆✨",
    "Everything on the to-do list is done! Time to relax together! 🍃",
    "100% completed! I'm so proud of your dedication! 🌟"
  ],

  // When user completes an individual task
  TASK_COMPLETED: [
    "Awesome job! One step closer to your goals! 🍓",
    "Progress unlocked! Here's a digital berry for our hard work! ✨",
    "High five! That was satisfying to cross off! 🐾"
  ],

  // When there are pending tasks (gentle, zero-guilt encouragement)
  PENDING_TASKS: [
    "Take your time! Even one small step makes a big difference. 🍃",
    "No rush at all. Whenever you're ready, let's tackle one task together! ☕",
    "Remember to take deep breaths between tasks. You've got this! 🌿"
  ],

  // Ambient idle chatter (normal balanced state)
  AMBIENT: [
    "I emerged from inside a semiconductor chip to be your buddy! 💻🍃",
    "Did you know? Double-tapping me makes me do a happy flip! 🌟",
    "Press Spacebar while hovering over me and watch me zoom! ⚡",
    "The world is big, but this pocket console is cozy. 🎮",
    "Taking care of yourself is the best gift to both of us. 💖",
    "Listening to the soft 8-bit hum of our room... 🎵",
    "Just resting my stubby feet for a moment! 🐾"
  ]
} as const;

/**
 * Deterministically pick an appropriate contextual message based on current pet and task conditions.
 */
export const getContextualSpeech = (pet: PetState, tasks: TaskItem[]): string => {
  if (pet.isSleeping) {
    return "Zzz... dreaming of digital fields... 🌙";
  }

  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const totalTasks = tasks.length;

  // 1. All tasks completed celebration
  if (totalTasks > 0 && completedTasks === totalTasks) {
    const list = CONTEXTUAL_DIALOGUES.ALL_TASKS_DONE;
    return list[Math.floor(Math.random() * list.length)];
  }

  // 2. High hunger emergency
  if (pet.hunger >= 75) {
    const list = CONTEXTUAL_DIALOGUES.HUNGRY;
    return list[Math.floor(Math.random() * list.length)];
  }

  // 3. Low energy exhaustion
  if (pet.energy <= 20) {
    const list = CONTEXTUAL_DIALOGUES.TIRED;
    return list[Math.floor(Math.random() * list.length)];
  }

  // 4. Low happiness sadness
  if (pet.happiness <= 25) {
    const list = CONTEXTUAL_DIALOGUES.SAD;
    return list[Math.floor(Math.random() * list.length)];
  }

  // 5. High happiness celebration
  if (pet.happiness >= 80) {
    const list = CONTEXTUAL_DIALOGUES.JOYOUS;
    return list[Math.floor(Math.random() * list.length)];
  }

  // 6. Satiated condition
  if (pet.hunger <= 25) {
    const list = CONTEXTUAL_DIALOGUES.FULL;
    return list[Math.floor(Math.random() * list.length)];
  }

  // 7. Tasks pending gentle nudge
  if (totalTasks > completedTasks && Math.random() < 0.35) {
    const list = CONTEXTUAL_DIALOGUES.PENDING_TASKS;
    return list[Math.floor(Math.random() * list.length)];
  }

  // 8. Balanced ambient banter
  const list = CONTEXTUAL_DIALOGUES.AMBIENT;
  return list[Math.floor(Math.random() * list.length)];
};

