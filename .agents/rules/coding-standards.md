---
description: TypeScript conventions, component architecture, code hygiene, error handling, and testing standards for MOCHI.
trigger: always_on
globs: "**/*.{ts,tsx,js,jsx}"
---

# Coding Standards — MOCHI: Your Pocket Companion

## 1. TypeScript Standards & Type Safety
- **Strict Typing:** Always enable `"strict": true` in `tsconfig.json`.
- **Zero `any` Policy:** Explicitly define interfaces and types for all entities, component props, and API payloads. Use `unknown` with runtime type guards if third-party data shapes are variable.
- **Immutable State Updates:** Never mutate state directly. Use functional state updates or deep-cloned structures.
- **Domain Modeling:** Separate domain types (e.g., `PetState`, `Emotion`, `CareAction`, `SyncPayload`) in dedicated type definition files (`src/types/`).

## 2. Directory & Component Organization
Structure the source codebase cleanly:
```
src/
├── assets/          # Static sprite sheets, audio synth waveforms, icons
├── components/      # UI components
│   ├── common/      # Reusable primitives (Button, Modal, Gauge, Toast)
│   ├── console/     # Handheld device frame, D-pad, action buttons
│   ├── pet/         # Pet canvas renderer, sprite animator, gesture detector
│   └── shared-room/ # Room background, food items, multi-device visitor avatars
├── core/            # Business logic
│   ├── state-machine/ # Pet emotional state machine and decay timers
│   ├── sync/        # Firebase Realtime sync engine and offline queue
│   └── audio/       # Web Audio API 8-bit sound generator
├── hooks/           # Custom React hooks (usePetSync, useGestures, useAudio)
├── types/           # TypeScript interfaces and contracts
└── utils/           # Math, date formatting, storage, debounce helpers
```

## 3. Naming Conventions
- **Components & Interfaces:** PascalCase (e.g., `PetCanvas.tsx`, `CareDashboard.tsx`, `PetState`).
- **Hooks:** camelCase with `use` prefix (e.g., `usePetSync.ts`, `useAudioChimes.ts`).
- **Utilities & Helpers:** camelCase (e.g., `calculateHungerDecay.ts`, `resolveConflict.ts`).
- **Constants & Enums:** UPPER_SNAKE_CASE (e.g., `MAX_HUNGER_LEVEL`, `EMOTIONS.SAD`).
- **Files & Folders:** kebab-case for folders and non-component files (e.g., `state-machine.ts`).

## 4. Error Handling & Resilience
- **Network Boundaries:** Always wrap Firebase network calls, offline storage reads, and Service Worker registrations in `try...catch` blocks with user-friendly fallback notifications.
- **Optimistic UI with Rollback:** Apply local pet state updates immediately for zero-lag feedback; rollback cleanly if server synchronization reports a terminal error.
- **Graceful Degradation:** If Web Audio or Service Workers are unavailable in the browser environment, degrade silently without crashing the app.

## 5. Reusable Components & Clean Code
- **Single Responsibility Principle:** Keep components focused. A rendering canvas should not manage Firebase authentication.
- **Pure Functions for Game Math:** Stat decay formulas, collision checks, and emotion determination functions must be pure, deterministic, and unit-tested.
- **No Dead Code:** Remove unused imports, console debugging logs, and commented-out legacy code before completing phases.

## 6. Testing & Quality Assurance
- **Unit Tests:** Test the emotional state machine, decay timers, and conflict-resolution algorithms with automated test runners (e.g., Vitest).
- **Integration Tests:** Verify synchronization round-trips between mock local storage and Firebase observers.
- **Linting & Formatting:** Adhere to ESLint and Prettier configurations.

