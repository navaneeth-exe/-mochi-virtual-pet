# Testing & Quality Assurance Strategy — MOCHI: Your Pocket Companion

> **Document Status:** Finalized Phase 2 Quality Plan  
> **Core Mandate:** Verified Functionality Over Verbal Claims  
> **Verification Matrix:** 5 Comprehensive Verification Suites

---

## 1. Testing Philosophy & Standards

In accordance with [`AGENTS.md`](file:///c:/Users/NAVANEETH/Documents/Academic%20Projects/Game_Dev/MOCHI-VIRTUAL-PET/AGENTS.md), features are never marked as complete based on assumptions. Every feature must undergo rigorous automated or manual verification with real evidence recorded in the engineering log.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MOCHI VERIFICATION MATRIX                       │
├─────────────────────┬──────────────────┬───────────────────────────────┤
│ Verification Suite  │ Target Scope     │ Primary Tooling               │
├─────────────────────┼──────────────────┼───────────────────────────────┤
│ 1. Math & State     │ Decay & Vitals   │ Vitest unit test runner       │
├─────────────────────┼──────────────────┼───────────────────────────────┤
│ 2. Story Gestures   │ Task 1 & 2 Core  │ DOM pointer & keyboard events │
├─────────────────────┼──────────────────┼───────────────────────────────┤
│ 3. Productivity     │ Tasks & Rewards  │ Component unit tests          │
├─────────────────────┼──────────────────┼───────────────────────────────┤
│ 4. Multi-Phone Sync │ WebSocket & Race │ Dual-browser headless tests   │
├─────────────────────┼──────────────────┼───────────────────────────────┤
│ 5. PWA & Security   │ Offline & Rules  │ Service Worker / Lighthouse   │
└─────────────────────┴──────────────────┴───────────────────────────────┘
```

---

## 2. Detailed Test Suites

### 2.1 Suite 1: Mathematical State & Decay Engine Tests

- **Accelerated Sadness Test:** Validate happiness decays at $2\times$ rate when hunger $< 20\%$.
- **Energy Recharge Test:** Validate that toggling sleep mode recharges Energy from 0 to 100% over 2 hours.
- **Pairing Code Entropy Test:** Verify generated 6-character room codes contain no ambiguous characters (`0`, `O`, `1`, `I`) and conform to pattern `MCH-[A-Z0-9]{3}`.

### 2.2 Suite 2: Mandatory Story Gestures & Visual Character Tests

- **Task 1 Gesture 1 (Spacebar Run):**
  - Verify Mochi transitions to 2-frame sprint cycle and moves horizontally across the viewport.
- **Task 1 Gesture 2 (Double-Tap Super Happy):**
  - Simulate two touch events within $250\text{ms}$.
  - Verify `currentEmotion` switches to `happy` and `emotionLockedUntil` is set for $5000\text{ms}$.
  - Verify vertical spring jump animation triggers and Web Audio victory chime executes.
- **Task 1 Gesture 3 (Window-Top Feeding):**
  - Simulate pointer dragging Mochi or food item to $Y \le 50\text{px}$ from top edge.
  - Verify hunger increments by $+25\%$, chewing animation triggers, and heart particle spawns.
- **Task 2 Monochrome Sprite Integrity:**
  - Verify that Sad, Happy, Surprised, and Angry sprites render with integer pixel scaling (`image-rendering: pixelated`).
  - Verify canvas context has `imageSmoothingEnabled = false`.

### 2.3 Suite 3: Companion Productivity Tests

- **Task Creation & Persistence:** Verify adding a task persists to state and local storage.
- **Task Completion Reward Loop:** Verify checking a task flips `isCompleted: true`, spawns a confetti particle, and awards $+1$ berry to room inventory.

### 2.4 Suite 4: Multi-Phone Realtime Sync & Concurrency Tests

- **Simultaneous Client Test (Latency Benchmark):**
  - Open two browser contexts (Client A and Client B) connected to pairing code `MCH-842`.
  - Trigger feeding on Client A.
- **Concurrent Race Condition Test:**
  - Fire simultaneous mutations from Client A and Client B at $t=0$.
  - Assert that Firebase `runTransaction()` merges both transactions cleanly with monotonic version increments.
- **Caretaker Toast Broadcast Test:**
  - Verify that when Client A feeds Mochi, Client B displays the toast: _"Alex fed Mochi!"_.

### 2.5 Suite 5: PWA Offline & Security Tests

- **Offline Shell Loading:**
  - In Chrome DevTools, set `Network: Offline`.\*\*
  - Reload page: verify PWA shell, sprites, and Web Audio synthesizer load instantaneously.
- **Offline Action Queue Reconciliation:**
  - Restore network: verify queue drains and commits to cloud database without overwriting newer remote timestamps.
- **Firebase Security Rules:**
  - Attempt unauthenticated write $\to$ expect `PERMISSION_DENIED`.
  - Attempt write to foreign room code $\to$ expect `PERMISSION_DENIED`.
  - Attempt invalid payload (e.g. `hunger = 999`) $\to$ expect schema validation failure.

---

## 3. Test Reporting & Evidence Preservation

All test results must be recorded with:

1. Timestamp & Environment (Node version, OS, browser).
2. Command executed and terminal output.
3. Screenshots of UI state.
4. Pass/Fail status logged in [`docs/development-log.md`](file:///c:/Users/NAVANEETH/Documents/Academic%20Projects/Game_Dev/MOCHI-VIRTUAL-PET/docs/development-log.md) and mirrored in [`submission/MOCHI_AI_Prompts_and_Outputs.docx`](file:///c:/Users/NAVANEETH/Documents/Academic%20Projects/Game_Dev/MOCHI-VIRTUAL-PET/submission/MOCHI_AI_Prompts_and_Outputs.docx).

## 4. Phase 3 Verification & Test Execution Results

| Test ID     | Test Category & Scope                                                                                                                              | Execution Method & Target                                    | Expected Result                                                                 | Actual Result                                                               | Status     |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------- | :------------------------------------------------------------------------------ | :-------------------------------------------------------------------------- | :--------- |
| **TEST-01** | Static Typing & Compilation                                                                                                                        | `npm run build` via TypeScript 5.8 & Vite 6                  | Clean build with zero TypeScript `any` leaks or syntax errors.                  | Compiled in 7.12s (`dist/assets/index-9zM1TJLS.js 277.37 kB`). Zero errors. | **PASSED** |
| **TEST-02** | Character Sprite Integrity                                                                                                                         | Python PIL Flood-Fill & Alpha Verification                   | 512×512 PNG, opaque white body (`#FFFFFF`), transparent background (`alpha=0`). | 5 sprites validated with BFS border flood-fill.                             | **PASSED** |
| **TEST-03** | Task 1: Spacebar Sprint                                                                                                                            | Pointer hover + `KeyboardEvent.code === 'Space'`             | Mochi shifts to 2-frame stride, dust particles render, 8-bit run sound plays.   | Verified in `MochiCharacter.tsx` via `onSpacebarRun`.                       | **PASSED** |
| **TEST-04** | Task 1: Double-Tap Super Happy                                                                                                                     | Pointer double-tap threshold ($\le 250\text{ms}$)            | Mochi leaps vertically, enters `happy` emotion, victory chime plays.            | Verified in `MochiCharacter.tsx` via `onDoubleTap`.                         | **PASSED** |
| \*\*TEST-0  | Task 1: Window-Top Feeer drag to $Y \le 50\text{pximation, heart pohx`via`onFeedA                                                                  |
| \*TES       | PSyneb Ao 8t so.                                                                                                                                   | dio.urr                                                      |
| **TEST-07** | Screen Navigation & Modals b switching across 5 views                                                                                              | View transitions hout unmounting pet state or layout jitter. | Verified: Welcome,kShared Pet, Settings all render smoothly.                    | **PASSED**                                                                  |
| **TEST-08** | Real Browser Verification Ppeteer automated browser capture (`localhost3igh-resolution PNG screenshots captured across mobile and desktop console. | All 7 screenshots verified and embedded in Word & Markd      |

---

## 5. Phase 4 Pet Mechanics, Local Persiste& Productivity Verification Matrix

Executed via Puppeteer headless Chrome teaness (`scripts/test_phase4.js`) targeting live Vite server (`http://localhost:5173/`):

| Test ID                                                          | Test Case & Feature Target                                                                               | Verification Procedure & Assertions                                       | Expected Result                                                        | Actual Result                                                  | Status     |
| :--------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------ | :--------------------------------------------------------------------- | :------------------------------------------------------------- | :--------- |
| **TEST-P4-01**                                                   | Screen Navigation Transition                                                                             | Click "ENTER MOCHI" button on onboarding screen.                          | View transitions to Main Pet Room.                                     | Canvas rendered with Mochi and room header.                    | **PASSED** |
| **TEST-P4-02**                                                   | Initial Vitals Display                                                                                   | Inspect DOM for Hunger, Joy, and Energy gauges.                           | Gauges render with valid percentages (0–100%).                         | Hunger (35%), Joy (85%), Energy (90%) confirmed.               | **PASSED** |
| **TEST-P4-03**                                                   | Feeding Interaction & Cap                                                                                | Click "Feed" in ActionDock with 5 berries.                                | Hunger drops by $-25\%$ (more full), berry consumed, bite sound plays. | Berry deducted (4 left), chewing sound fired, toast displayed. | **PASSED** |
| **TEST-P4-04**                                                   | Playing Interaction & Energy                                                                             | Click "Play" in ActionDock.                                               | Joy increases $+18\%$, Energy decreases $-14\%$, victory chime plays.  | State updated immediately; joy rose to $100\%$.                | **PASSED** |
| \*\*TEST-5 Petting Interaction & Love Click "Pet" in ActionDock. | Gentle purays, hearts spawnfSSED\*\*                                                                     |
| \*\*TE                                                           | Slle leepes o "Wdered; led                                                                               |
| **TEST-P4-07**                                                   | Tasks Screen Navigation                                                                                  | Click Tasks icon in TopBar.                                               | Companion Tasks screen rendered with header and daily progresuform.    | **PASSED**                                                     |
| **TEST-P4-08a**                                                  | Empty Task Rejection                                                                                     | "Add" with empty input.                                                   | Form prevents submission shows validation warning.                     | "Task description ciD\*\*                                      |
| \*_TEST-P4-08b_                                                  | Valid Task Creation                                                                                      | Typerite Phase 4 documentation" and submit.                               | Tapended to list, total count increments.                              | Task card added with checkbox a dge.                           | **PASSED** |
| **TEST-P4-08c**                                                  | Duplicate Task Rejection                                                                                 | Submit "Write Phase 4 documentanjects duplicate, shows duplicate warning. | "A task with this title alrddisplayed.                                 | **PASSED**                                                     |
| **TEST-P4-09**                                                   | Inline Task Editing                                                                                      | Click it pencil on task card.                                             | Ca nput with Save/Cancel buttons.                                      | Input focused; title edited dD\*\*                             |
| **TEST-P4-10**                                                   | Task Completion & RCck task card to toggle completion.                                                   | kd, text struck through, berry awarded.                                   | Inventory berries incremented; Mochi celebrates.                       | **PASSED**                                                     |
| **TEST-P4-11** Task Filter Tabs                                  | Togglteen "Active", "Completed", "Afnamically without state loss.                                        | Filter tabs correctly filter actiss.                                      | **PASSED**                                                             |
| **TEST-P4-12**                                                   | LocalStorage Persistenpect `window.localStorage` keyst_v1`, `mochi_tasks_v1`, `mochi_settings_v1` exist. | ee keys.                                                                  | **PASSED**                                                             |
| **TEST-P4-13**                                                   | Page Reload & State tExecute `page.reload()` and re-enter room.                                          | Restes previous vitals and tasks without NaN or crash ered flawlessly.    | **PASSED**                                                             |

---

## 6. Phase 5 Muti-Device Shared PeR Synchronization Verification Matrix

Executed via Pupeteer multi-page browser harnes (`scripts/test_phase5_multidevice.js`) simuitwo concurrent phone sessions (Phone A = Owner, Phone B = er the dual-engine sync architecture (`http://loca`

| Test ID        | Test Case & Synchronization Target         | Verification Procedure & Assertions                                               | Expected Result                                                                      | Actual Result                                                  | Status     |
| :------------- | :----------------------------------------- | :-------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------- | :------------------------------------------------------------- | :--------- |
| **TEST-P5-01** | Phone A Initialization & Auth              | Launch Page A, inject Session A identity, enter Pet Room.                         | Anonymous UID generated, Pet Room rendered with persistent session.                  | Phone A mounted into Pet Room with Owner session.              | **PASSED** |
| **TEST-P5-02** | Cryptographic Pairing Code                 | Inspect TopBar pill `#pairingCode` on Phone A.                                    | Code adheres to `MCH-XXX` pattern with unambiguous characters.                       | Active pairing code `#MCH-842` confirmed.                      | **PASSED** |
| **TEST-P5-03** | Phone B Room Join Flow                     | Launch Page B, enter `#MCH-842` in Co-Parent Room form, submit.                   | Phone B connects to shared room, caretaker roster increments to 2 members.           | Phone B paired; connected roster shows Owner + Caretaker.      | **PASSED** |
| **TEST-P5-04** | Real-Time Sync: Phone A Feed $\to$ Phone B | Phone A clicks "Feed"; inspect Phone B hunger gauge and toast.                    | Phone B receives hunger update within $<500\text{ms}$; toast shows caretaker action. | State synced to Phone B in **386ms**; chewing toast triggered. | **PASSED** |
| \*\*TEST-5     | Real-Time Sync: Phone B Play $\to$o        | Phone B clicks "Play"; inspect Phonsone A receives hatate synced to P\*PASSED\*\* |
| \*\*TE         | AtomPhonreaeal-ed arettre                  |

---

## 7. Phase 6 Comprehensive QA, Security & Regression Audit Matrix

Executed via Puppeteer comprehensive audit runner (`scripttst_phase6_qa.js`) targeting responsive layouts, input guarding, WA service worker availability, and accessibility:

| Test ID        | Test Category & Suite                                                               | Verification Assertions                                | Expected Result                         | Actual Result                           | Status     |
| :------------- | :---------------------------------------------------------------------------------- | :----------------------------------------------------- | :-------------------------------------- | :-------------------------------------- | :--------- |
| **QA-RESP-01** | Responsive: $320\times 568$                                                         | `document.documentElement.scrollWidth <= 320`          | Clean fit with zero horizontal overflow | `scrollWidth <= 320px` confirmed        | **PASSED** |
| **QA-RESP-02** | Responsive: $375\times 812$                                                         | `document.documentElement.scrollWidth <= 375`          | Clean iPhone X layout fit               | `scrollWidth <= 375px` confirmed        | **PASSED** |
| **QA-RESP-03** | Responsive: $390\times 844$                                                         | `document.documentElement.scrollWidth <= 390`          | Modern smartphone fit                   | `scrollWidth <= 390px` confirmed        | **PASSED** |
| **QA-RESP-04** | Responsive: $768\times 1024$                                                        | `document.documentElement.scrollWidth <= 768`          | Tablet portrait chassis fit             | `scrollWidth <= 768px` confirmed        | **PASSED** |
| \*\*QA-RES     | Responsive: $1024\tim cument.documentElement.schlet landscape layspx` confirmed     | \*                                                     |
| _06_           | R0$ ocumrolskto144nfir                                                              |
| **QA-PET-01**  | Pet Mechanics: Spacebar Spri ver over Mochi + `Space` key                           | Sprint animation+ run audio                            | Animated sprint confirmed               | \*ED\*\*                                |
| **QA-PET-02**  | Input Guard: Spacebar ProtectFocus task input + type text with spaces               | Texttyped without triggering sprpping" entered cleanly | **PASSED**                              |
| **QA-TASK-01** | Productivity: Task Creationuit new task title                                       | Task card prepended with bery badge                    | Task created t\*\*                      |
| **QA-TASK-02** | Productivity: Duplicate Rejen                                                       | Submit identical task twice                            | Warning toast prvents duplicate         | Duplicate rt\*\*                        |
| **QA-TASK-03** | Productivity: Empty Task Che ubmit blank input                                      | Warning toast displayed                                | "Task description cannot be empt        |
| **QA-TASK-04** | Productivity: Inline Editing                                                        | Click edit pencil on TaskCard                          | Input field renders in-place            | In-plaa\*\*                             |
| \*_QA-A11Y-01_ | Accessibility: ARIA Semantics heck `role`, `aria-label`, buttonAve elements labeled | 100% accg                                              | **PASSED**                              |
| **QA-PWA-01**  | PWA: Web App Manifest                                                               | Validate /manifest.json`                               | Valid W3C JSON with maskabns            | Name, icons (192, 512) confirmed SD\*\* |
| **QA-PWA-02**  | PWA: Service Worker Shell                                                           | I `sw.js` registration                                 | rk-First navigation                     | `sw.js` registerctive                   | **PASSED** |
