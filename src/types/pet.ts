export type Emotion = 'idle' | 'happy' | 'sad' | 'surprised' | 'angry';

export interface PetState {
  name: string;
  currentEmotion: Emotion;
  emotionLockedUntil: number;
  hunger: number;     // 0 - 100
  happiness: number;  // 0 - 100
  energy: number;     // 0 - 100
  isSleeping: boolean;
  berriesCount: number;
  pairingCode: string;
  lastFedTimestamp: number;
  lastInteractedTimestamp: number;
  lastSleptTimestamp: number;
}

export interface TaskItem {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: number;
  completedAt?: number;
  rewardBerries: number;
}

export type ScreenType = 'welcome' | 'pet' | 'tasks' | 'shared' | 'settings';

export interface CareActionFeedback {
  text: string;
  timestamp: number;
}

