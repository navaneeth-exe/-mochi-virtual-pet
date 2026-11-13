/**
 * usePet.ts
 * Centralized React hook managing MOCHI's virtual pet state machine,
 * time-based decay, local persistence, multi-device cloud synchronization,
 * audio triggers, and speech.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { PetState, Emotion, TaskItem } from '../types/pet';
import { sound } from '../core/audio';
import {
  loadPetState,
  savePetState,
  DEFAULT_PET_STATE
} from '../core/storage';
import {
  calculateDecay,
  feedPet,
  playWithPet,
  petCompanion,
  toggleSleep,
  spacebarSprint,
  doubleTapCelebration,
  ActionResult
} from '../core/petStateMachine';
import { DECAY_RATES } from '../core/petConfig';
import { getContextualSpeech } from '../core/dialogues';
import { syncEngine, RoomMember, EngineType } from '../core/sync/syncEngine';
import { MochiUser } from '../core/firebase/auth';

export const usePet = (tasks: TaskItem[], showToast: (msg: string) => void) => {
  // 1. Initialize pet state from Local Storage (with elapsed catch-up)
  const [pet, setPet] = useState<PetState>(() => {
    const { state, elapsedSeconds } = loadPetState();
    if (elapsedSeconds > 10) {
      console.log(`[MOCHI State] Resumed after ${elapsedSeconds}s elapsed.`);
    }
    return state;
  });

  const [speechText, setSpeechText] = useState<string>(
    "Hi there! Tap me or press Space to run!"
  );

  const [currentUser, setCurrentUser] = useState<MochiUser>(() => syncEngine.getUser());
  const [roomMembers, setRoomMembers] = useState<RoomMember[]>([
    {
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      role: 'owner',
      isOnline: true
    }
  ]);
  const [engineType, setEngineType] = useState<EngineType>(syncEngine.getEngineType());

  // Track rapid petting clicks to detect annoyance
  const petClickHistoryRef = useRef<number[]>([]);
  const lastTickTimeRef = useRef<number>(Date.now());

  // Initialize auth user on mount
  useEffect(() => {
    syncEngine.initUser().then((user) => {
      setCurrentUser(user);
      setEngineType(syncEngine.getEngineType());
    });
  }, []);

  // Save pet state locally whenever it updates
  useEffect(() => {
    savePetState(pet);
  }, [pet]);

  // Handle action results with audio, toast, and cloud/multi-tab broadcast
  const processActionResult = useCallback((res: ActionResult, actionType: string = 'care') => {
    setPet(res.nextState);
    if (res.message) {
      showToast(res.message);
      setSpeechText(res.message);
    }
    if (res.soundType) {
      switch (res.soundType) {
        case 'bite': sound.playBite(); break;
        case 'victory': sound.playVictory(); break;
        case 'purr': sound.playPurr(); break;
        case 'sleep': sound.playSleep(); break;
        case 'run': sound.playRun(); break;
        case 'chirp': sound.playChirp(); break;
      }
    }

    // Broadcast mutation to connected caretakers
    syncEngine.mutateState(
      pet.pairingCode,
      actionType,
      res.message,
      () => res.nextState
    ).catch((e) => console.warn('[MOCHI Sync] Mutation sync notice:', e));
  }, [pet.pairingCode, showToast]);

  // Subscribe to real-time updates from other caretakers
  useEffect(() => {
    const unsubscribe = syncEngine.subscribeToPet(
      pet.pairingCode,
      (remoteUpdates) => {
        setPet((prev) => ({
          ...prev,
          ...remoteUpdates
        }));
      },
      (interactionEvent) => {
        // Incoming action performed by another device!
        showToast(interactionEvent.message);
        setSpeechText(interactionEvent.message);
        if (interactionEvent.actionType === 'feed') {
          sound.playBite();
        } else if (interactionEvent.actionType === 'play') {
          sound.playVictory();
        } else if (interactionEvent.actionType === 'pet') {
          sound.playPurr();
        } else {
          sound.playChirp();
        }
      },
      (updatedMembers) => {
        setRoomMembers(updatedMembers);
      }
    );

    return () => unsubscribe();
  }, [pet.pairingCode, showToast]);

  // Periodic Natural Stat Decay & Contextual Ambient Dialogue
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.max(1, Math.floor((now - lastTickTimeRef.current) / 1000));
      lastTickTimeRef.current = now;

      setPet((prev) => calculateDecay(prev, elapsedSeconds));

      // Occasional ambient speech rotation if awake
      if (Math.random() < 0.20 && !pet.isSleeping) {
        const nextQuote = getContextualSpeech(pet, tasks);
        setSpeechText(nextQuote);
      }
    }, DECAY_RATES.TICK_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [pet, tasks]);

  // Catch-up decay when tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        const elapsedSeconds = Math.max(1, Math.floor((now - lastTickTimeRef.current) / 1000));
        lastTickTimeRef.current = now;
        if (elapsedSeconds > 5) {
          setPet((prev) => calculateDecay(prev, elapsedSeconds));
          setSpeechText("Welcome back! I missed you! 🍃");
        }
      } else {
        lastTickTimeRef.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Action Dispatchers
  const handleFeed = useCallback(() => {
    const result = feedPet(pet);
    processActionResult(result, 'feed');
  }, [pet, processActionResult]);

  const handlePlay = useCallback(() => {
    const result = playWithPet(pet);
    processActionResult(result, 'play');
  }, [pet, processActionResult]);

  const handlePet = useCallback(() => {
    const now = Date.now();
    petClickHistoryRef.current = [...petClickHistoryRef.current.filter((t) => now - t < 2000), now];
    const clickCount = petClickHistoryRef.current.length;

    const result = petCompanion(pet, clickCount);
    processActionResult(result, 'pet');
  }, [pet, processActionResult]);

  const handleToggleSleep = useCallback(() => {
    const result = toggleSleep(pet);
    processActionResult(result, 'sleep');
  }, [pet, processActionResult]);

  const handleSpacebarRun = useCallback(() => {
    const result = spacebarSprint(pet);
    processActionResult(result, 'run');
  }, [pet, processActionResult]);

  const handleDoubleTap = useCallback(() => {
    const result = doubleTapCelebration(pet);
    processActionResult(result, 'celebrate');
  }, [pet, processActionResult]);

  const handleResetPet = useCallback(() => {
    setPet(DEFAULT_PET_STATE);
    setSpeechText("Vitals restored! Mochi is feeling great!");
    showToast("Mochi reset to fresh baseline!");
    sound.playVictory();
  }, [showToast]);

  const handleSetEmotionDirectly = useCallback((emotion: Emotion) => {
    setPet((prev) => ({
      ...prev,
      currentEmotion: emotion,
      emotionLockedUntil: Date.now() + 4000
    }));
    sound.playChirp();
    showToast(`Emotion preview: ${emotion.toUpperCase()}`);
  }, [showToast]);

  const awardBerries = useCallback((amount: number = 1) => {
    setPet((prev) => {
      const next = {
        ...prev,
        berriesCount: prev.berriesCount + amount,
        currentEmotion: 'happy' as Emotion,
        emotionLockedUntil: Date.now() + 3000
      };
      syncEngine.mutateState(
        prev.pairingCode,
        'task_reward',
        `Earned +${amount} digital berries! 🍓`,
        () => next
      ).catch(() => {});
      return next;
    });
  }, []);

  /**
   * Create a new room with newly generated pairing code.
   */
  const handleCreateRoom = useCallback(async (name: string): Promise<string> => {
    try {
      const res = await syncEngine.createRoom(name, pet, tasks);
      setPet((prev) => ({
        ...prev,
        pairingCode: res.pairingCode,
        name
      }));
      showToast(`Created shared room #${res.pairingCode}!`);
      return res.pairingCode;
    } catch (err: any) {
      showToast(`Failed to create room: ${err.message}`);
      throw err;
    }
  }, [pet, tasks, showToast]);

  /**
   * Connect and join another caretaker's room.
   */
  const handleJoinRoom = useCallback(async (code: string): Promise<void> => {
    try {
      const petId = await syncEngine.joinRoom(code);
      setPet((prev) => ({
        ...prev,
        pairingCode: code.toUpperCase()
      }));
      showToast(`Connected to room #${code.toUpperCase()}! 🍃`);
      console.log(`Joined room ${code} (petId: ${petId})`);
    } catch (err: any) {
      showToast(`Failed to join: ${err.message}`);
      throw err;
    }
  }, [showToast]);

  return {
    pet,
    setPet,
    speechText,
    currentUser,
    roomMembers,
    engineType,
    handleFeed,
    handlePlay,
    handlePet,
    handleToggleSleep,
    handleSpacebarRun,
    handleDoubleTap,
    handleResetPet,
    handleSetEmotionDirectly,
    awardBerries,
    handleCreateRoom,
    handleJoinRoom
  };
};
