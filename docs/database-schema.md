# Database Schema & Data Architecture — MOCHI: Your Pocket Companion

> **Document Status:** Finalized Phase 2 Schema  
> **Target Cloud Store:** Firebase Realtime Database  
> **Protocol:** Bidirectional WebSocket / JSON Tree  
> **Synchronization Strategy:** Timestamp-anchored deterministic decay with atomic versioned transactions

---

## 1. Complete Database JSON Hierarchy

```json
{
  "pets": {
    "<petId>": {
      "metadata": {
        "name": "Mochi",
        "createdAt": 1731481200000,
        "ownerUid": "user_anon_a1b2c3",
        "pairingCode": "MCH-842"
      },
      "members": {
        "user_anon_a1b2c3": {
          "displayName": "Alex (Phone A)",
          "joinedAt": 1731481200000,
          "role": "owner",
          "isOnline": true,
          "lastSeen": 1731481260000
        },
        "user_anon_d4e5f6": {
          "displayName": "Sam (Phone B)",
          "joinedAt": 1731481240000,
          "role": "caretaker",
          "isOnline": true,
          "lastSeen": 1731481260000
        }
      },
      "state": {
        "currentEmotion": "happy",
        "emotionLockedUntil": 0,
        "baseHunger": 85,
        "baseHappiness": 90,
        "baseEnergy": 95,
        "isSleeping": false,
        "lastFedTimestamp": 1731481200000,
        "lastInteractedTimestamp": 1731481220000,
        "lastSleptTimestamp": 1731480000000,
        "version": 42
      },
      "inventory": {
        "berriesCount": 5
      },
      "tasks": {
        "task_001": {
          "title": "Drink a glass of water",
          "isCompleted": false,
          "createdAt": 1731481200000,
          "completedAt": null,
          "completedBy": null,
          "rewardBerries": 1
        },
        "task_002": {
          "title": "Take a 5-minute stretch break",
          "isCompleted": true,
          "createdAt": 1731481200000,
          "completedAt": 1731481250000,
          "completedBy": "user_anon_a1b2c3",
          "rewardBerries": 1
        }
      },
      "interactions": {
        "-O9xyz123abc": {
          "actorUid": "user_anon_d4e5f6",
          "actorName": "Sam",
          "type": "feed",
          "details": "Fed Mochi a digital berry",
          "timestamp": 1731481230000
        }
      }
    }
  },
  "pairingCodes": {
    "MCH-842": {
      "petId": "<petId>",
      "createdAt": 1731481200000,
      "expiresAt": 1734073200000
    }
  }
}
```

---

## 2. Field Specifications & Domain Entities

### 2.1 `/pets/<petId>/state` (Synchronized Companion State)

| Field Name | Type | Range / Format | Description |
| :--- | :--- | :--- | :--- |
| `currentEmotion` | `string` | `"idle"`, `"happy"`, `"sad"`, `"surprised"`, `"angry"` | Active emotional expression rendered on canvas. |
| `emotionLockedUntil`| `number` | Epoch ms timestamp | Lock timer for transient high-energy emotions (e.g. 5s for double-tap). |
| `baseHunger` | `number` | $[0, 100]$ | Fullness level established at `lastFedTimestamp`. |
| `baseHappiness` | `number` | $[0, 100]$ | Joy level established at `lastInteractedTimestamp`. |
| `baseEnergy` | `number` | $[0, 100]$ | Energy level established at `lastSleptTimestamp`. |
| `isSleeping` | `boolean` | `true` or `false` | When true, Mochi is resting and Energy recharges. |
| `lastFedTimestamp` | `number` | Epoch ms timestamp | Server timestamp of the most recent feeding action. |
| `lastInteractedTimestamp` | `number` | Epoch ms timestamp | Server timestamp of the most recent play or gesture interaction. |
| `lastSleptTimestamp` | `number` | Epoch ms timestamp | Server timestamp of the last sleep mode toggle. |
| `version` | `number` | Monotonic integer $\ge 0$ | Version counter incremented on every transaction to resolve race conditions. |

---

### 2.2 `/pets/<petId>/tasks/<taskId>` (Companion Productivity Tasks)

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | Task title entered by user (e.g. "Complete Math homework"). Max 100 chars. |
| `isCompleted` | `boolean` | Completion state. When flipped, rewards berries to feed Mochi. |
| `createdAt` | `number` | Epoch ms creation timestamp. |
| `completedAt` | `number \| null` | Epoch ms completion timestamp. |
| `completedBy` | `string \| null` | Anonymous `uid` of caretaker who marked task complete. |
| `rewardBerries` | `number` | Food reward granted upon completion (defaults to 1). |

---

### 2.3 `/pets/<petId>/interactions/<interactionId>` (Audit & Toast Event Stream)
Append-only log of recent caretaker activities. Listened to by all connected devices to trigger live visual feedback and toast notifications (e.g. *"Alex fed Mochi!"*). Automatically pruned to the last 20 entries to minimize bandwidth.

---

## 3. Mathematical Decay & Vitals Modeling

To prevent continuous cloud database writes, vitals are calculated **dynamically on-demand** using deterministic elapsed time formulas:

### 3.1 Hunger Decay Function
Hunger decays linearly from $100\%$ to $0\%$ over 4 hours ($14,400,000\text{ ms}$):
$$\text{decayDuration} = 14,400,000\text{ ms}$$
$$\text{elapsedFedMs} = \max(0, \text{currentTime} - \text{lastFedTimestamp})$$
$$\text{effectiveHunger} = \max\left(0, \min\left(100, \text{baseHunger} - \left\lfloor \frac{\text{elapsedFedMs} \times 100}{\text{decayDuration}} \right\rfloor\right)\right)$$

### 3.2 Happiness Decay Function
Happiness decays if unplayed for over 2 hours ($7,200,000\text{ ms}$), and decays twice as fast if $\text{effectiveHunger} < 20\%$:
$$\text{decayRate} = \begin{cases} 1.0 & \text{if } \text{effectiveHunger} \ge 20\% \\ 2.0 & \text{if } \text{effectiveHunger} < 20\% \end{cases}$$
$$\text{effectiveHappiness} = \max\left(0, \min\left(100, \text{baseHappiness} - \left\lfloor \frac{\text{elapsedInteractedMs} \times 100 \times \text{decayRate}}{7,200,000} \right\rfloor\right)\right)$$

### 3.3 Energy & Sleep Recharge Function
When Mochi is awake (`isSleeping: false`), Energy decays linearly over 6 hours ($21,600,000\text{ ms}$).  
When Mochi is asleep (`isSleeping: true`), Energy recharges from $0\%$ to $100\%$ over 2 hours ($7,200,000\text{ ms}$):
$$\text{effectiveEnergy} = \begin{cases} 
\min\left(100, \text{baseEnergy} + \left\lfloor \frac{(\text{now} - \text{lastSleptTimestamp}) \times 100}{7,200,000} \right\rfloor\right) & \text{if sleeping} \\
\max\left(0, \text{baseEnergy} - \left\lfloor \frac{(\text{now} - \text{lastSleptTimestamp}) \times 100}{21,600,000} \right\rfloor\right) & \text{if awake}
\end{cases}$$

---

## 4. Concurrency, Security & Offline Resilience

### 4.1 Concurrent Updates via Atomic Transactions
When a caretaker on Phone A feeds Mochi:
```typescript
import { ref, runTransaction } from 'firebase/database';

export async function feedMochi(db: any, petId: string, actorUid: string, actorName: string) {
  const stateRef = ref(db, `pets/${petId}/state`);
  
  await runTransaction(stateRef, (currentState) => {
    if (!currentState) return currentState;
    
    const now = Date.now();
    const currentHunger = calculateEffectiveHunger(currentState.baseHunger, currentState.lastFedTimestamp, now);
    
    return {
      ...currentState,
      baseHunger: Math.min(100, currentHunger + 25),
      lastFedTimestamp: now,
      currentEmotion: 'happy',
      emotionLockedUntil: now + 5000,
      version: (currentState.version || 0) + 1
    };
  });
}
```

### 4.2 Security Rules (`database.rules.json`)
```json
{
  "rules": {
    "pets": {
      "$petId": {
        ".read": "auth != null && data.child('members/' + auth.uid).exists()",
        ".write": "auth != null && (data.child('members/' + auth.uid).exists() || !data.exists())",
        "state": {
          ".validate": "newData.hasChildren(['currentEmotion', 'baseHunger', 'baseHappiness', 'version'])",
          "baseHunger": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 100" },
          "baseHappiness": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 100" },
          "currentEmotion": { ".validate": "newData.val() == 'happy' || newData.val() == 'sad' || newData.val() == 'surprised' || newData.val() == 'angry' || newData.val() == 'idle'" }
        }
      }
    },
    "pairingCodes": {
      "$code": {
        ".read": "auth != null",
        ".write": "auth != null && (!data.exists() || data.child('petId').val() === newData.child('petId').val())"
      }
    }
  }
}
```

### 4.3 Disconnection & Reconnection Model
- **Local Fallback:** In the absence of an internet connection, local actions are applied immediately to the local state and queued in `IndexedDB`.
- **Reconciliation:** Upon reconnection, the client flushes queued actions through `runTransaction()`, merging local deltas without clobbering server data.

---

## 5. Phase 4 Local Storage Persistence Model (Client-Side Tier)

Prior to Phase 5 Firebase integration, MOCHI implements a deterministic browser-local persistence architecture via the `localStorage` API with strict schema validation and fallback error resilience:

### 5.1 Storage Keys & Contracts
| Storage Key | Data Structure Type | Purpose & Lifecycle | Fallback on Parse Error |
| :--- | :--- | :--- | :--- |
| `mochi_pet_state_v1` | `PetState` JSON Object | Tracks Hunger (0–100), Happiness (0–100), Energy (0–100), Emotion, Sleep flag, Berry count, and timestamps. | Restores `DEFAULT_PET_STATE` (Hunger 35%, Happiness 85%, Energy 90%). |
| `mochi_tasks_v1` | `TaskItem[]` JSON Array | Stores daily to-do goals, completion states, creation dates, and berry values. | Restores `INITIAL_TASKS` seed data. |
| `mochi_settings_v1` | `AppSettings` JSON Object | Sound toggle (`isMuted`), desktop console bezel (`chassisMode`), notifications enabled. | Restores `DEFAULT_SETTINGS` (Sound enabled, Chassis on). |
| `mochi_streak_v1` | Number String (`"3"`) | Tracks consecutive daily care streak for non-punitive motivation. | Defaults to `3`. |

### 5.2 Elapsed-Time Recovery Algorithm
On application boot or tab visibility restoration:
$$\Delta t = \min\left(\lfloor(t_{\text{now}} - t_{\text{lastInteracted}}) / 1000\rfloor, 86400\right)$$
If $\Delta t > 0$, the client deterministically executes `calculateDecay(loadedState, \Delta t)` before rendering the first frame, guaranteeing consistent biological progression across browser restarts without draining resources during inactive background tabs.

---

## 6. Phase 5 Implemented Security Rules (`database.rules.json`)

The live production security rules file [`database.rules.json`](file:///c:/Users/NAVANEETH/Documents/Academic%20Projects/Game_Dev/MOCHI-VIRTUAL-PET/database.rules.json) enforces authenticated access, membership authorization, and field-level validation:

```json
{
  "rules": {
    "pets": {
      "$petId": {
        ".read": "auth != null && data.child('members/' + auth.uid).exists()",
        ".write": "auth != null && (data.child('members/' + auth.uid).exists() || !data.exists())",
        "metadata": {
          ".validate": "newData.hasChildren(['id', 'ownerUid', 'pairingCode'])",
          "id": { ".validate": "newData.isString()" },
          "ownerUid": { ".validate": "newData.isString()" },
          "pairingCode": { ".validate": "newData.isString() && newData.val().length >= 4" }
        },
        "members": {
          "$memberUid": {
            ".validate": "newData.hasChildren(['displayName', 'role'])",
            "role": { ".validate": "newData.val() == 'owner' || newData.val() == 'caretaker'" },
            "displayName": { ".validate": "newData.isString() && newData.val().length <= 32" }
          }
        },
        "state": {
          ".validate": "newData.hasChildren(['hunger', 'happiness', 'energy', 'currentEmotion', 'version'])",
          "hunger": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 100" },
          "happiness": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 100" },
          "energy": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 100" },
          "currentEmotion": { ".validate": "newData.val() == 'happy' || newData.val() == 'sad' || newData.val() == 'surprised' || newData.val() == 'angry' || newData.val() == 'idle'" },
          "version": { ".validate": "newData.isNumber() && (!data.exists() || newData.val() > data.val())" }
        },
        "interactions": {
          "$interactionId": {
            ".validate": "newData.hasChildren(['actorUid', 'actorName', 'actionType', 'timestamp'])",
            "actorUid": { ".validate": "newData.isString()" },
            "actionType": { ".validate": "newData.isString()" }
          }
        }
      }
    },
    "pairingCodes": {
      "$code": {
        ".read": "auth != null",
        ".write": "auth != null && (!data.exists() || data.child('petId').val() === newData.child('petId').val())",
        ".validate": "newData.hasChildren(['petId', 'ownerUid'])"
      }
    }
  }
}
```
