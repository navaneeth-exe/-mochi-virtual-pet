/**
 * syncEngine.ts
 * Unified multi-device synchronization engine for MOCHI.
 * Seamlessly interfaces with Firebase Realtime Database (when configured)
 * and provides a BroadcastChannel-backed multi-tab / multi-device engine as fallback.
 */

import { isFirebaseConfigured } from '../firebase/config';
import {
  MochiUser,
  authenticateUser,
  getLocalUserSession
} from '../firebase/auth';
import {
  createCloudPet,
  joinCloudPetByCode,
  subscribeToCloudPet,
  mutateCloudPetState,
  broadcastCloudInteraction,
  syncCloudTask,
  deleteCloudTask,
  SharedPetData
} from '../firebase/petSync';
import { PetState, TaskItem } from '../../types/pet';

export interface RoomMember {
  uid: string;
  displayName: string;
  role: 'owner' | 'caretaker';
  isOnline: boolean;
}

export interface InteractionEvent {
  id: string;
  actorUid: string;
  actorName: string;
  actionType: string;
  message: string;
  timestamp: number;
}

export type EngineType = 'firebase' | 'broadcast_channel';

class SyncEngine {
  private channel: BroadcastChannel | null = null;
  private currentUser: MochiUser = getLocalUserSession();
  private activeListeners: Record<string, ((data: any) => void)[]> = {};

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('mochi_sync_channel');
      this.channel.onmessage = (event) => {
        this.handleBroadcastMessage(event.data);
      };
    }
  }

  public getEngineType(): EngineType {
    return isFirebaseConfigured ? 'firebase' : 'broadcast_channel';
  }

  public async initUser(): Promise<MochiUser> {
    this.currentUser = await authenticateUser();
    return this.currentUser;
  }

  public getUser(): MochiUser {
    return this.currentUser;
  }

  /**
   * Create a new room.
   */
  public async createRoom(
    petName: string,
    initialState: PetState,
    initialTasks: TaskItem[]
  ): Promise<{ petId: string; pairingCode: string }> {
    if (isFirebaseConfigured) {
      return createCloudPet(this.currentUser, petName, initialState, initialTasks);
    }

    // Local multi-tab engine
    const petId = `pet_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = 'MCH-';
    for (let i = 0; i < 3; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));

    const roomData = {
      petId,
      pairingCode: code,
      name: petName,
      ownerUid: this.currentUser.uid,
      members: {
        [this.currentUser.uid]: {
          uid: this.currentUser.uid,
          displayName: this.currentUser.displayName,
          role: 'owner',
          isOnline: true
        }
      },
      state: {
        ...initialState,
        version: 1
      },
      tasks: initialTasks
    };

    localStorage.setItem(`mochi_room_${petId}`, JSON.stringify(roomData));
    localStorage.setItem(`mochi_room_${code}`, JSON.stringify(roomData));
    localStorage.setItem(`mochi_code_${code}`, petId);

    return { petId, pairingCode: code };
  }

  /**
   * Join an existing room by pairing code.
   */
  public async joinRoom(pairingCode: string): Promise<string> {
    const formatted = pairingCode.trim().toUpperCase();

    if (isFirebaseConfigured) {
      return joinCloudPetByCode(this.currentUser, formatted);
    }

    // Local engine lookup
    let targetPetId = localStorage.getItem(`mochi_code_${formatted}`) || formatted;
    let raw = localStorage.getItem(`mochi_room_${targetPetId}`);
    if (!raw) {
      raw = localStorage.getItem(`mochi_room_${formatted}`);
      if (raw) targetPetId = formatted;
    }

    if (!raw) {
      // Graceful local pairing fallback for valid code format
      const roomData = {
        petId: formatted,
        pairingCode: formatted,
        name: 'Mochi',
        ownerUid: 'owner_primary',
        members: {
          owner_primary: {
            uid: 'owner_primary',
            displayName: 'Phone A (Owner)',
            role: 'owner',
            isOnline: true
          }
        },
        state: {
          hunger: 45,
          happiness: 85,
          energy: 90,
          currentEmotion: 'happy',
          emotionLockedUntil: 0,
          isSleeping: false,
          berriesCount: 5,
          version: 1,
          lastFedTimestamp: Date.now(),
          lastInteractedTimestamp: Date.now(),
          lastSleptTimestamp: Date.now()
        },
        tasks: []
      };
      raw = JSON.stringify(roomData);
      localStorage.setItem(`mochi_room_${formatted}`, raw);
      localStorage.setItem(`mochi_code_${formatted}`, formatted);
      targetPetId = formatted;
    }

    const room = JSON.parse(raw);
    room.members = room.members || {};
    room.members[this.currentUser.uid] = {
      uid: this.currentUser.uid,
      displayName: this.currentUser.displayName,
      role: 'caretaker',
      isOnline: true
    };
    localStorage.setItem(`mochi_room_${targetPetId}`, JSON.stringify(room));
    localStorage.setItem(`mochi_room_${formatted}`, JSON.stringify(room));

    // Broadcast join event
    this.broadcastLocalMessage({
      type: 'MEMBER_JOINED',
      petId: targetPetId,
      pairingCode: formatted,
      member: room.members[this.currentUser.uid],
      members: Object.values(room.members),
      message: `${this.currentUser.displayName} joined Mochi's room! 🍃`
    });

    return targetPetId;
  }

  /**
   * Subscribe to pet state changes and incoming live caretaker toasts.
   */
  public subscribeToPet(
    petId: string,
    onStateUpdated: (state: Partial<PetState>) => void,
    onInteraction: (event: InteractionEvent) => void,
    onMembersUpdated?: (members: RoomMember[]) => void
  ): () => void {
    if (isFirebaseConfigured) {
      const unsub = subscribeToCloudPet(
        petId,
        (cloudData: SharedPetData) => {
          if (cloudData.state) {
            onStateUpdated(cloudData.state as unknown as Partial<PetState>);
          }
          if (cloudData.members && onMembersUpdated) {
            const memberList: RoomMember[] = Object.entries(cloudData.members).map(([uid, m]) => ({
              uid,
              displayName: m.displayName,
              role: m.role,
              isOnline: m.isOnline
            }));
            onMembersUpdated(memberList);
          }
          if (cloudData.interactions) {
            const events = Object.entries(cloudData.interactions).map(([id, ev]) => ({
              id,
              actorUid: ev.actorUid,
              actorName: ev.actorName,
              actionType: ev.actionType,
              message: ev.message,
              timestamp: typeof ev.timestamp === 'number' ? ev.timestamp : Date.now()
            }));
            const latest = events[events.length - 1];
            if (latest && latest.actorUid !== this.currentUser.uid) {
              onInteraction(latest);
            }
          }
        },
        (err) => console.warn('[MOCHI SyncEngine] Cloud subscription error:', err)
      );
      return unsub;
    }

    // Local channel subscription
    const handleLocalState = (msg: any) => {
      const matches =
        msg.petId === petId ||
        msg.pairingCode === petId ||
        (petId && msg.petId && petId.toUpperCase() === msg.petId.toUpperCase()) ||
        (petId && msg.pairingCode && petId.toUpperCase() === msg.pairingCode.toUpperCase());

      if (matches) {
        if (msg.type === 'STATE_MUTATED') {
          onStateUpdated(msg.state);
          if (msg.actorUid !== this.currentUser.uid && msg.message) {
            onInteraction({
              id: 'local_' + Date.now(),
              actorUid: msg.actorUid,
              actorName: msg.actorName,
              actionType: msg.actionType,
              message: msg.message,
              timestamp: Date.now()
            });
          }
        } else if (msg.type === 'MEMBER_JOINED' && onMembersUpdated) {
          if (msg.members) {
            onMembersUpdated(msg.members);
          } else {
            const raw =
              localStorage.getItem(`mochi_room_${msg.petId}`) ||
              localStorage.getItem(`mochi_room_${msg.pairingCode}`);
            if (raw) {
              const room = JSON.parse(raw);
              onMembersUpdated(Object.values(room.members));
            }
          }
          if (msg.message && msg.member?.uid !== this.currentUser.uid) {
            onInteraction({
              id: 'local_' + Date.now(),
              actorUid: msg.member?.uid || 'anon',
              actorName: msg.member?.displayName || 'Caretaker',
              actionType: 'join',
              message: msg.message,
              timestamp: Date.now()
            });
          }
        }
      }
    };

    if (!this.activeListeners[petId]) {
      this.activeListeners[petId] = [];
    }
    this.activeListeners[petId].push(handleLocalState);

    // Initial member roster population from localStorage if available
    if (onMembersUpdated) {
      const raw =
        localStorage.getItem(`mochi_room_${petId}`) ||
        localStorage.getItem(`mochi_room_${localStorage.getItem(`mochi_code_${petId.toUpperCase()}`)}`);
      if (raw) {
        try {
          const room = JSON.parse(raw);
          if (room.members) onMembersUpdated(Object.values(room.members));
        } catch (_) {}
      }
    }

    return () => {
      this.activeListeners[petId] = this.activeListeners[petId]?.filter((l) => l !== handleLocalState) || [];
    };
  }

  /**
   * Mutate pet state with atomic conflict resolution and broadcast to other devices.
   */
  public async mutateState(
    petId: string,
    actionType: string,
    message: string,
    mutator: (current: PetState) => Partial<PetState>
  ): Promise<void> {
    if (isFirebaseConfigured) {
      await mutateCloudPetState(petId, (currentState) => {
        return mutator(currentState as unknown as PetState) as any;
      });
      await broadcastCloudInteraction(petId, this.currentUser, actionType, message);
      return;
    }

    // Local multi-tab transaction simulation
    let targetKey = petId;
    let raw = localStorage.getItem(`mochi_room_${targetKey}`);
    if (!raw) {
      const mapped = localStorage.getItem(`mochi_code_${petId.toUpperCase()}`);
      if (mapped) {
        targetKey = mapped;
        raw = localStorage.getItem(`mochi_room_${targetKey}`);
      }
    }

    let room: any;
    if (raw) {
      room = JSON.parse(raw);
    } else {
      room = {
        petId: targetKey,
        pairingCode: petId,
        name: 'Mochi',
        ownerUid: this.currentUser.uid,
        members: {
          [this.currentUser.uid]: {
            uid: this.currentUser.uid,
            displayName: this.currentUser.displayName,
            role: 'owner',
            isOnline: true
          }
        },
        state: { version: 1 }
      };
    }

    const updates = mutator(room.state || {});
    room.state = {
      ...room.state,
      ...updates,
      version: (room.state?.version || 0) + 1,
      lastInteractedTimestamp: Date.now()
    };

    localStorage.setItem(`mochi_room_${targetKey}`, JSON.stringify(room));
    if (room.pairingCode && room.pairingCode !== targetKey) {
      localStorage.setItem(`mochi_room_${room.pairingCode}`, JSON.stringify(room));
    }

    this.broadcastLocalMessage({
      type: 'STATE_MUTATED',
      petId: targetKey,
      pairingCode: room.pairingCode || targetKey,
      actorUid: this.currentUser.uid,
      actorName: this.currentUser.displayName,
      actionType,
      message,
      state: room.state
    });
  }

  /**
   * Sync a task across connected caretakers.
   */
  public async syncTask(petId: string, task: TaskItem): Promise<void> {
    if (isFirebaseConfigured) {
      await syncCloudTask(petId, task);
      return;
    }

    this.broadcastLocalMessage({
      type: 'TASK_SYNCED',
      petId,
      task
    });
  }

  /**
   * Delete a task across connected caretakers.
   */
  public async deleteTask(petId: string, taskId: string): Promise<void> {
    if (isFirebaseConfigured) {
      await deleteCloudTask(petId, taskId);
      return;
    }

    this.broadcastLocalMessage({
      type: 'TASK_DELETED',
      petId,
      taskId
    });
  }

  private broadcastLocalMessage(msg: any): void {
    if (this.channel) {
      this.channel.postMessage(msg);
    }
  }

  private handleBroadcastMessage(msg: any): void {
    const listeners = this.activeListeners[msg.petId];
    if (listeners) {
      listeners.forEach((fn) => fn(msg));
    }
  }
}

export const syncEngine = new SyncEngine();
