# System Requirements Specification — MOCHI: Your Pocket Companion

> **Document Status:** Fully Implemented & QA-Verified (Phase 6 Complete)  
> **Last Updated:** 2026-11-13  
> **Reference Basis:** Virtual Pet AI Challenge Instructions, Submission Reference PDF, and Phase 6 QA Audit Matrix

---

## 1. Executive Summary & Design Vision
MOCHI is an AI-assisted virtual pocket companion Progressive Web App (PWA) with multi-device real-time synchronization. It balances a nostalgic 1990s Tamagotchi-inspired monochrome hardware aesthetic with gentle, non-punitive companion care loops inspired by Finch and Neko Atsume, and collaborative co-parenting accountability inspired by Habitica.

The virtual pet remains the **uncompromised central focus** of the entire experience. Productivity features (tasks and reminders) are thoughtfully integrated as companion-nurturing activities (completing tasks rewards digital snacks and energy for Mochi) rather than overwhelming the interface with a sterile corporate dashboard.

---

## 2. Mandatory Assignment Baseline vs. Scoped Enhancements

### 2.1 Mandatory Assignment Requirements (P0 — Must-Have Baseline)
These core deliverables originate from the authoritative Virtual Pet AI Challenge specifications and are non-negotiable:
1. **Task 1: Tell a Story (Companion Narrative & Gestures):**
   - **Narrative Origin:** Mochi is a living companion who emerged from inside a semiconductor microchip.
   - **Interaction 1 (Run):** Hover cursor over Mochi and press Spacebar $\to$ Mochi executes a sprint across the canvas.
   - **Interaction 2 (Super Happy):** Double-tap / double-click Mochi $\to$ Mochi triggers an intense "Super Happy" bounce animation, closed smiling eyes, and celebratory chime.
   - **Interaction 3 (Feed):** Moving or dragging Mochi to the top edge of the window $\to$ initiates a feeding sequence with hunger recovery.
   - **Additional Actions:** Jumping, singing songs, and expressive companion reactions.
2. **Task 2: Make a Prototype (Character & Four Monochrome Emotions):**
   - **Prompt 1 (Character Extraction):** Isolated Mochi dumpling body, two-leaf botanical sprout, tiny hands/feet, bold black outline on plain white canvas.
   - **Prompt 2 (Strict Monochrome Style):** Pure black (`#111111`), pure white (`#FFFFFF`), and subtle grayscale shading (`#E0E0DC`). No colors, no gradients, identical proportions across all frames.
   - **Prompt 3 (Four Distinct Emotions):**
     1. **Sad:** Drooping eyes, small frowning mouth, single visible teardrop.
     2. **Happy:** Closed smiling eyes, open cheerful mouth, raised blush cheeks.
     3. **Surprised:** Wide-open circular eyes, round open mouth, reaction marks (`!?`).
     4. **Angry:** Downward-slanted aggressive eyebrows, intense eyes, small tight mouth, anger vein (`💢`).
3. **Task 3: Architecture & Multi-Phone Real-Time Synchronization:**
   - **Game Engine & Rendering:** HTML5 / Canvas container.
   - **Deployment Pipeline:** Nginx / Apache web server configuration with HTTPS and Service Worker caching headers.
   - **Multi-Phone Shared Pet:** Multiple devices connect simultaneously via a 6-character room pairing code (`MCH-XXX`) with sub-150ms state reflection.
   - **Technical Difficulties & Solutions:** Documented resolutions for concurrent race conditions, latency, offline/online reconciliation, and optimistic updates.
4. **Submission Prompt Preservation:**
   - Professionally formatted Word document (`submission/MOCHI_AI_Prompts_and_Outputs.docx`) and Markdown source (`submission/MOCHI_AI_Prompts_and_Outputs.md`) capturing all prompts, refinements, rationales, dates, tool names, generated assets, architecture diagrams, and application screenshots.

---

### 2.2 Optional Product Enhancements (P1 / P2 Scoped)
- **Companion Productivity Loop (P1):** Minimalist task tray where completing real-world tasks rewards digital berries/chips to feed Mochi.
- **Handheld Console Chassis (P1):** Virtual retro console frame with physical D-pad and buttons on desktop viewports.
- **Web Audio 8-Bit Synthesizer (P1):** Procedural sound generator for chimes, bleeps, and feeding sounds with mute toggle.
- **Offline PWA Installation (P1):** Web App Manifest and Service Worker caching for offline companion interaction.
- **Caretaker Activity Feed (P2):** Real-time toast notifications indicating which caretaker fed or played with Mochi.
- **Energy & Sleep Cycle (P2):** Bedtime/nap toggle to recharge Mochi's energy gauge.

---

## 3. Comprehensive Feature Specification Matrix

Every feature is cataloged with its interaction model, pet reaction, data requirements, classification, and test strategy:

### 3.1 Virtual Pet Core Features

> [!IMPORTANT]
> **STAT INTERPRETATION STANDARD (Authoritative Specification):**
> - **Happiness (0–100):** Higher is better (0% = Grieving/Sad, 100% = Ecstatic Joy).
> - **Hunger (0–100):** Higher means **MORE HUNGRY** (0% = Completely Full/Satiated, 100% = Starving). Feeding decreases hunger; time increases hunger.
> - **Energy (0–100):** Higher is better (0% = Exhausted, 100% = Fully Energized). Playing consumes energy; sleeping regenerates energy.

| Feature ID | Feature Name | Description & Interaction | Pet Reaction | Data Stored | Priority | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FP-01** | **Interactive Mochi Canvas** | Pixel-rendered canvas. User taps or clicks Mochi anywhere on screen. | Mochi wiggles ears/sprout, turns toward pointer, and produces soft 8-bit chirp. | `currentEmotion: 'idle' | 'happy' | 'sad' | 'surprised' | 'angry'` | Mandatory (P0) | Manual pointer test; canvas render integrity check. |
| **FP-02** | **Spacebar Run (Task 1)** | Hover pointer over Mochi and strike `Spacebar` (strictly guarded against input fields). | Mochi switches to 2-frame sprint cycle with dust particles trailing behind. | `lastInteractedTimestamp`, `happiness: +10`, `energy: -8`, `hunger: +5` | Mandatory (P0) | Unit test keyboard event dispatch; visual assertion of sprint frames and input guard. |
| **FP-03** | **Double-Tap Super Happy (Task 1)** | Double-tap on touchscreen or double-click with mouse within 250ms. | Mochi jumps into air with squash-and-stretch, displays Happy face (`^ ‿ ^`), raised cheeks, and celebratory chime. | `currentEmotion: 'happy'`, `emotionLockedUntil: now + 4000`, `happiness: +15` | Mandatory (P0) | Automated pointer event simulation ($\le 250\text{ms}$ interval); assert emotion lock. |
| **FP-04** | **Window-Top Feeding (Task 1)** | Drag Mochi or food item to the top $50\text{px}$ of the window, or tap Feed button. | Mochi chomps food in 3-frame sequence, displays heart particle, and decreases Hunger by $-25\%$ (more full). Rejects if full ($\le 10\%$). | `hunger: -25`, `happiness: +8`, `berriesCount: -1`, `lastFedTimestamp` | Mandatory (P0) | Drag-and-drop bounding box collision test ($Y \le 50\text{px}$); assert hunger decrease and fullness check. |
| **FP-05** | **Petting & Affection** | Gently click or drag pointer across Mochi's head. Rapid poking ($>5$ clicks in $2\text{s}$) triggers annoyance. | Mochi purrs with Web Audio synth hum, displays floating hearts, and increases Happiness by $+7\%$. If over-poked, turns Angry (`💢`). | `happiness: +7`, `lastInteractedTimestamp` | Optional (P1) | Pointer velocity and click frequency test; verify affection vs anger transition. |
| **FP-06** | **Sleep & Energy Cycle** | Tap the Sleep / Wake button in the action dock. | Lights dim; Mochi emits floating `Zzz` pixels; Energy recharges at $+25\%$/hr. Incompatible actions blocked while sleeping. | `isSleeping: boolean`, `lastSleptTimestamp`, `energy: +25/h` | Optional (P1) | Toggle sleep mode; verify Energy recharge rate over simulated time and action guard. |
| **FP-07** | **Emotion State Engine** | Dynamic evaluation of Mochi's emotional state (Sad, Happy, Surprised, Angry, Idle) based on vitals and triggers. | Changes facial sprite and reactive particle effects according to current mood. | `currentEmotion`, `emotionLockedUntil` | Mandatory (P0) | Vitest unit tests verifying state transitions for high hunger ($\ge 75\% \to$ Sad), low energy ($\to$ Sad), etc. |
| **FP-08** | **Vital Statistics (Hunger, Joy, Energy)** | 3 segmented LCD gauges displayed in the status tray. | When hunger $> 75\%$ or energy $< 15\%$, Mochi droops; when happiness $> 75\%$, Mochi bounces cheerfully. | `hunger`, `happiness`, `energy`, timestamps | Mandatory (P0) | Unit test mathematical decay formulas under varying elapsed times. |

---

### 3.2 Companion Productivity Features

| Feature ID | Feature Name | Description & Interaction | Pet Reaction | Data Stored | Priority | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PR-01** | **Add / Manage Tasks** | Tap "+" in companion drawer to create a quick daily task with title and due time. | Mochi nods attentively and displays a checklist thought bubble. | `tasks/$taskId`: `{ title, isCompleted, createdAt, dueDate }` | Optional (P1) | CRUD unit tests; form validation check; local storage persistence test. |
| **PR-02** | **Task Completion Reward** | Tap checkbox to complete a task. | Mochi celebrates with confetti pixels, does a backflip, and spawns a digital food berry (reward). | `isCompleted: true`, `completedAt: now`, `berriesCount: +1` | Optional (P1) | Checkbox toggle test; verify berry currency increments and reward particle fires. |
| **PR-03** | **Daily Reminders & Nudges** | Set gentle reminder time for recurring habits (e.g. "Drink water", "Take a break"). | Mochi taps the glass of the screen and displays a friendly dialogue banner. | `reminders/$reminderId`: `{ text, time, enabled }` | Optional (P1) | Browser Notification API mock test; in-app reminder banner trigger test. |
| **PR-04** | **Care & Focus Streaks** | Track consecutive days of taking care of Mochi and completing at least one task. | Mochi wears a small monochrome ribbon badge on the sprout. | `streakCount: number`, `lastStreakDate: string` | Optional (P2) | Date arithmetic tests across 24h, 48h, and reset conditions. |
| **PR-05** | **Encouraging Messages** | Tap Mochi or open task drawer to view contextual words of encouragement. | Speech bubble appears with warm, non-judgmental quotes (Finch-inspired). | Static array of 30+ cozy quotes in `dialogues.ts` | Optional (P1) | Snapshot test of dialogue bubble component; verify random pool rotation. |

---

### 3.3 Multi-Phone Shared Pet Features

| Feature ID | Feature Name | Description & Interaction | Pet Reaction | Data Stored | Priority | Verification Method |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SP-01** | **Anonymous Authentication** | Automatic friction-free login on app launch via Firebase Anonymous Auth. | None (background operation); user is assigned an anonymous UID. | `auth.currentUser.uid` | Mandatory (P0) | Mock Firebase Auth initialization; verify valid UID generated on first load. |
| **SP-02** | **Room Creation & 6-Char Code** | Tap "Share Pet" $\to$ generates short code (e.g. `MCH-842`) and copyable link. | Mochi waves to the door inviting a friend. | `pairingCodes/$code`: `{ petId, createdAt }`, `pets/$petId/pairingCode` | Mandatory (P0) | Code generation entropy test; verify unique code links to pet record. |
| **SP-03** | **Join Shared Pet Room** | Caretaker on Phone B enters `MCH-842` on join screen. | Mochi displays Surprised face (`O ᗜ O !?`), then Happy face as co-caretaker arrives. | `pets/$petId/members/$uid`: `{ role: 'caretaker', joinedAt }` | Mandatory (P0) | Two-client join test; assert Phone B UID appears in pet member list. |
| **SP-04** | **Real-Time State Sync** | When Phone A feeds or pets Mochi, changes push to Firebase Realtime Database. | Phone B's Mochi immediately chews food, updates hunger gauge, and reflects the happy mood. | `/pets/$petId/state`, `version: N+1` | Mandatory (P0) | Multi-tab WebSocket sync test; assert latency $< 150\text{ms}$ between mutation and reflection. |
| **SP-05** | **Caretaker Activity Stream** | Real-time toast notifications broadcast actions to all connected devices. | Banner pops up: *"Phone 2 fed Mochi strawberries!"*. | `/pets/$petId/interactions/$id`: `{ actor, type, timestamp }` | Mandatory (P0) | Interaction push test; verify listener receives event and fires toast component. |
| **SP-06** | **Concurrent Conflict Resolution** | Simultaneous feeding or playing from two devices at the same second. | Actions merge smoothly via atomic transactions; no lost stats or animation glitches. | Versioned state commits (`runTransaction`) | Mandatory (P0) | Automated concurrent write test with simulated latency; verify version increment. |

---

## 4. Non-Functional Requirements & Performance Budgets

- **Bundle Size Budget:** Total production JavaScript bundle $< 200\text{KB}$ gzipped; total CSS $< 30\text{KB}$.
- **Performance Budget:** First Contentful Paint (FCP) $< 0.8\text{s}$; Time to Interactive (TTI) $< 1.2\text{s}$ on standard mobile 4G.
- **Rendering Performance:** 60 FPS UI transitions; 8–12 FPS retro sprite animations running on HTML5 Canvas without dropped frames.
- **Network Resilience:** Offline-first caching via Service Worker. Local IndexedDB action queue reconciles automatically upon reconnect.
- **Accessibility:** Touch hit targets $\ge 48\text{px} \times 48\text{px}$; WCAG AAA color contrast between `#111111` ink and `#FFFFFF` / `#EDECE6` background; `prefers-reduced-motion` compliance.

---

## 5. Acceptance Verification Gate

1. [x] **Story Gestures:** Hover + Spacebar run, Double-tap Super Happy, Window-top feed confirmed functional.
2. [x] **Emotion Sprites:** Sad, Happy, Surprised, Angry, and Idle sprites rendered in pure monochrome pixel art with identical proportions.
3. [x] **Multi-Device Co-Parenting:** Two concurrent browser sessions connected via room code show instant real-time synchronization.
4. [x] **Companion Tasks:** Adding and completing a task rewards digital food and triggers Mochi's celebratory reaction.
5. [x] **Prompt Preservation:** All prompts, outputs, architecture diagrams, and test results recorded in `MOCHI_AI_Prompts_and_Outputs.docx` and `.md`.

> Full verification details, defect resolutions, and test traces are recorded in [`docs/phase-6-qa-report.md`](file:///c:/Users/NAVANEETH/Documents/Academic%20Projects/Game_Dev/MOCHI-VIRTUAL-PET/docs/phase-6-qa-report.md).
