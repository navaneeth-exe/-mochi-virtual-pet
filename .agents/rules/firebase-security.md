---
description: Firebase Authentication, security rules, concurrent synchronization, and shared pet authorization for MOCHI.
trigger: always_on
globs: "**/*{firebase,rules,auth,sync}*"
---

# Firebase Security & Multi-Device Sync Rules — MOCHI

## 1. Authentication Strategy
To ensure friction-free onboarding while maintaining strong security:
- **Anonymous Authentication:** Users instantly receive a persistent anonymous Firebase UID upon opening the app. This enables immediate pet creation or joining without entering credentials.
- **Linkable Pairing Identifiers:** Each shared pet room generates a short, cryptographically secure 6-character alphanumeric pairing code (e.g., `MCH-842`).
- **Account Promotion (Optional):** Users can link their anonymous session to Email/Password or OAuth if they want cross-device persistent recovery.

## 2. Database Structure & Access Authorization
The database architecture uses Firebase Realtime Database or Cloud Firestore. The structure segregates shared pet data from private user profiles:

```json
{
  "pets": {
    "$petId": {
      "ownerId": "string",
      "members": {
        "$userId": {
          "role": "owner | caretaker",
          "joinedAt": "timestamp",
          "displayName": "string"
        }
      },
      "pairingCode": "string",
      "state": {
        "emotion": "happy | sad | surprised | angry | idle",
        "hunger": 85,
        "happiness": 90,
        "energy": 95,
        "lastFedAt": "timestamp",
        "lastInteractedAt": "timestamp",
        "version": 142
      },
      "interactions": {
        "$interactionId": {
          "userId": "string",
          "type": "feed | run | pet_double_tap | sing",
          "timestamp": "timestamp"
        }
      }
    }
  },
  "pairingCodes": {
    "$code": {
      "petId": "string",
      "createdAt": "timestamp"
    }
  }
}
```

## 3. Firebase Security Rules (`database.rules.json`)
Security rules must enforce:
1. **Authenticated Access Only:** No unauthenticated read or write access anywhere in the database.
2. **Membership Authorization:** A user can only read or write to `/pets/$petId` if `data.child('members/' + auth.uid).exists()` or if creating a new pet where `auth.uid === newData.child('ownerId').val()`.
3. **Data Schema Validation:**
   - `hunger` and `happiness` must be integers between $0$ and $100$.
   - `emotion` must match the allowed string enum (`"happy"`, `"sad"`, `"surprised"`, `"angry"`, `"idle"`).
   - `lastInteractedAt` must be a valid server timestamp (`now`).

### Example Realtime Database Security Rules:
```json
{
  "rules": {
    "pets": {
      "$petId": {
        ".read": "auth != null && data.child('members/' + auth.uid).exists()",
        ".write": "auth != null && (data.child('members/' + auth.uid).exists() || !data.exists() && newData.child('ownerId').val() === auth.uid)",
        "state": {
          ".validate": "newData.hasChildren(['emotion', 'hunger', 'happiness', 'version'])",
          "hunger": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 100" },
          "happiness": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 100" },
          "emotion": { ".validate": "newData.val() == 'happy' || newData.val() == 'sad' || newData.val() == 'surprised' || newData.val() == 'angry' || newData.val() == 'idle'" }
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

## 4. Concurrent Multi-Device Updates & Conflict Resolution
When two phones interact with Mochi at the exact same moment (e.g., Phone A feeds Mochi while Phone B triggers a double-tap run):
- **Atomic Transactions:** State changes must use Firebase atomic transactions (`runTransaction`) or Firestore document transactions.
- **Optimistic UI with Vector Clocks / Monotonic Versioning:**
  - Every update increments a monotonic `version` integer.
  - Client applies state optimistically. If the server transaction aborts due to a version mismatch, the client retrieves the latest state, re-applies the delta, and commits.
- **Caretaker Attribution:** Live broadcast events (e.g., "Phone 2 fed Mochi strawberries!") are broadcast in the `/interactions/` stream so all connected devices show a toast notification.

