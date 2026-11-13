import { TaskItem } from '../types/pet';

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Drink a glass of water',
    isCompleted: true,
    createdAt: Date.now() - 3600000,
    completedAt: Date.now() - 1800000,
    rewardBerries: 1
  },
  {
    id: 'task-2',
    title: 'Take a 5-minute stretch break',
    isCompleted: false,
    createdAt: Date.now() - 7200000,
    rewardBerries: 1
  },
  {
    id: 'task-3',
    title: 'Write down 3 things to be grateful for',
    isCompleted: false,
    createdAt: Date.now() - 10800000,
    rewardBerries: 2
  }
];

export const COMPANION_QUOTES = [
  "You're doing great! Keep it up!",
  "A little rest goes a long way.",
  "Mochi is happy you're here today!",
  "Take a deep breath and smile.",
  "Tiny steps lead to big places!",
  "Remember to hydrate and take breaks.",
  "Mochi loves learning new things with you!",
  "Be kind to yourself today."
];

