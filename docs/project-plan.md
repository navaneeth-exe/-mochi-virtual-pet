# Project Plan & Engineering Blueprint — MOCHI: Your Pocket Companion

> **Document Status:** Finalized Phase 2 Blueprint  
> **Methodology:** Phase-Gated Iterative Software Engineering  
> **Primary Inspirations:** Finch, Tamagotchi, Neko Atsume, Habitica

---

## 1. Industry Research & Synthesis: Deconstructing Companion Apps

To engineer MOCHI as a living companion rather than a sterile productivity dashboard, we conducted an in-depth comparative study of four market-defining products.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                INDUSTRY RESEARCH MATRIX                                │
├───────────────────┬───────────────────────────────────┬────────────────────────────────┤
│ Product & Source  │ Factual Research Findings         │ Architectural Takeaway         │
├───────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ **Finch**         │ • Self-care & mental health focus │ • Adopt non-punitive loop:     │
│ (finchcare.com)   │ • Positive reinforcement only     │   neglect triggers Sad/Angry,  │
│                   │ • No punishment or pet death      │   never death or reset         │
│                   │ • Completing goals gives energy   │ • Tasks reward food/berries    │
│                   │ • Pet goes on daily adventures    │ • Daily gentle nudges          │
├───────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ **Tamagotchi**    │ • Iconic physical 3-button device │ • Tactile retro console frame  │
│ (tamagotchi-      │ • High emotional vulnerability    │ • 3 clear vital gauges         │
│  official.com)    │ • Instant visual & sound feedback │   (Hunger, Happiness, Energy)  │
│                   │ • Strict physical constraints     │ • 8-bit procedural sound synth │
│                   │ • Real-time continuous decay      │ • Distinct button micro-clicks │
├───────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ **Neko Atsume**   │ • Low-stress, passive collection  │ • Zero language barrier UI     │
│ (nekoatsume.com)  │ • Zero text or cognitive overload │ • Cozy, minimalist space       │
│                   │ • Visual-first spatial interface  │ • Delightful micro-animations  │
│                   │ • Delightful micro-animations     │ • Drag-and-drop food items     │
├───────────────────┼───────────────────────────────────┼────────────────────────────────┤
│ **Habitica**      │ • RPG-style gamified task system  │ • Shared co-parenting room     │
│ (habitica.com)    │ • Multi-user Party accountability │ • Clear task completion states │
│                   │ • Penalties on missed dailies     │ • Real-time multi-device sync  │
│                   │ • Strict task categorization      │ • Caretaker activity feed      │
└───────────────────┴───────────────────────────────────┴────────────────────────────────┘
```

### 1.1 Factual Research vs. MOCHI Design Recommendations

1. **Finch (Reciprocal Care vs. No Guilt):**
   - *Factual Finding:* Finch users show unprecedented 30-day retention because the app never shames them for missing days. Tasks translate into "Energy" for a baby bird that explores and brings back stories.
   - *MOCHI Recommendation:* We reject Tamagotchi's permadeath mechanics. If Mochi is neglected, Mochi transitions to the **Sad** or **Sleepy** state, waiting patiently for the user. Completing tasks in the companion tray generates digital berries to feed Mochi.
2. **Tamagotchi (Physicality & Immediacy):**
   - *Factual Finding:* Tamagotchi's enduring charm stems from physical buttons and immediate, audible reactions to care actions.
   - *MOCHI Recommendation:* On desktop/tablet viewports, MOCHI renders inside a tactile retro handheld console chassis with an embossed D-pad and A/B buttons. Every action triggers immediate 8-bit Web Audio feedback.
3. **Neko Atsume (Spatial Simplicity & Calm):**
   - *Factual Finding:* Neko Atsume succeeds globally by relying on spatial room placement and micro-animations rather than text menus.
   - *MOCHI Recommendation:* Mochi lives in a cozy, uncluttered monochrome room. Interaction controls slide in discreetly via a bottom drawer, keeping the living character front-and-center.
4. **Habitica (Collaborative Accountability):**
   - *Factual Finding:* Habitica's "Party" system leverages social accountability—when team members fail tasks, the party takes damage during boss fights.
   - *MOCHI Recommendation:* Instead of punitive damage, MOCHI implements **Collaborative Co-Parenting**: multiple caretakers connect via a 6-character room code to care for the same pet. When one caretaker feeds Mochi, all connected devices celebrate with a shared cheer.

---

## 2. Phased Development Roadmap

```
  Phase 1: Foundation & Specs                   [DONE]
     │
     ▼
  Phase 2: Research & Blueprint                 [DONE]
     │
     ▼
  Phase 3: Character Assets & Frontend Client   [DONE]
     │
     ▼
  Phase 4: Pet Mechanics & Productivity         [DONE]
     │
     ▼
  Phase 5: Multi-Phone Realtime Sync & Backend  [READY FOR DEV]
     │
     ▼
  Phase 6: Final Packaging & Submission         [PLANNED]
```

### Detailed Phase Breakdown

#### Phase 1: Foundation & Reference Analysis *(Completed)*
- [x] Extract Task 1, 2, and 3 requirements from `GAME DEVELOPEMENT TASK SUBMISSION REFERENCE PDF.pdf`.
- [x] Establish structured project directory (`MOCHI-VIRTUAL-PET/`).
- [x] Author persistent instructions (`AGENTS.md`) and specialized rules (`.agents/rules/`).
- [x] Author initial engineering documentation (`docs/`).
- [x] Generate initial Word submission document (`submission/MOCHI_AI_Prompts_and_Outputs.docx`).

#### Phase 2: Research & Development Blueprint *(Completed)*
- [x] Conduct deep research on Finch, Tamagotchi, Neko Atsume, and Habitica.
- [x] Finalize feature specifications (Pet, Productivity, Shared Pet) with interaction & test mapping.
- [x] Finalize technology stack (React 19, TypeScript, Vite, Tailwind CSS, Firebase, PWA).
- [x] Finalize application screen layout and navigation architecture.
- [x] Finalize monochrome visual design system, typography, and animation tokens.
- [x] Finalize multi-phone architecture and Firebase schema with Mermaid diagrams.
- [x] Update all documentation files in `docs/`.
- [x] Update Word document and Markdown source with Phase 2 prompt and findings.

#### Phase 3: Character Assets & Frontend Implementation *(Completed)*
- [x] Extract and segment 5 monochrome pixel-art sprites (Idle, Happy, Sad, Surprised, Angry) via border-seeded BFS flood-fill with solid white bodies and transparent backgrounds.
- [x] Prepare monochrome food items (`food-berry.png`, `food-onigiri.png`) and PWA icons (`icon-192.png`, `icon-512.png`, `favicon.png`).
- [x] Scaffold Vite + React 19 + TypeScript template with strict typing (`"strict": true`, zero `any`).
- [x] Build responsive handheld chassis (`ConsoleFrame`) with tactile D-Pad and physical A/B buttons for desktop/tablet.
- [x] Implement 5 full views & modals: WelcomeScreen, MainPetScreen, TasksScreen, SharedPetScreen, SettingsScreen.
- [x] Implement procedural 8-bit Web Audio synthesizer (`audio.ts`) generating 6 authentic sounds without external media.
- [x] Implement mandatory story gestures: Spacebar run, double-tap super happy leap, and window-top drag feed.
- [x] Implement productivity task list with berry reward loops.
- [x] Verify production build (`npm run build`) in 7.12s with zero errors or warnings.
- [x] Capture 7 genuine high-resolution screenshots via Puppeteer and embed in `.docx` and `.md`.

#### Phase 4: Pet Mechanics & Productivity Implementation *(Completed)*
- [x] Implement centralized pet state system with documented stat interpretation (`hunger`: 0–100, higher means more hungry; `happiness`: 0–100; `energy`: 0–100).
- [x] Implement core pet actions: Feeding (decreases hunger, full check), Playing (joy bonus, energy cost), Petting (purr sound, rapid poke detection), Sleeping (energy recovery, action guard).
- [x] Strictly guard keyboard spacebar event listener against typing inside `<input>` or `<textarea>`.
- [x] Implement deterministic time-based decay & sleep recovery with 24-hour catch-up cap.
- [x] Implement complete LocalStorage persistence engine with automatic schema validation and corruption fallback.
- [x] Implement productivity task management: task creation, inline editing, toggle completion, deletion, duplicate/empty validation.
- [x] Implement task filtering ("All", "Active", "Completed") and daily streak tracker.
- [x] Implement browser Notification API permission management with non-intrusive in-app fallback alerts.
- [x] Implement contextual dialogue library with non-guilt-inducing, warm responses based on vitals and task milestones.
- [x] Execute automated 15-test Puppeteer verification suite (100% passed) and capture 3 new genuine screenshots.

#### Phase 5: Multi-Phone Realtime Sync & Cloud Backend *(Completed)*
- [x] Integrate Firebase SDK (Anonymous Auth & Realtime Database).
- [x] Implement 6-character room pairing generator (`MCH-XXX`) and caretaker join modal.
- [x] Implement bidirectional WebSocket state subscription with optimistic UI updates.
- [x] Implement atomic transactions (`runTransaction`) and monotonic versioning for concurrent updates.
- [x] Implement caretaker activity feed and presence indicators.
- [x] Author production `database.rules.json` with authenticated access, membership check, and schema bounds.
- [x] Engineer dual-engine architecture (`syncEngine.ts`) with seamless BroadcastChannel fallback for multi-window testing.
- [x] Execute automated 6-suite Puppeteer multi-device test (`scripts/test_phase5_multidevice.js`) with 100% pass rate.
- [x] Capture 3 genuine high-resolution multi-device screenshots and embed in `.docx` and `.md`.

#### Phase 6: QA, Debugging, Security Audit & Refinement *(Completed)*
- [x] Comprehensive application audit across components, types, state machine, and sync.
- [x] Author and register production PWA Service Worker (`public/sw.js`) with Cache-First static assets and Network-First navigation.
- [x] Resolve responsive layout overflow on narrow mobile screens down to $320\text{px}$.
- [x] Upgrade character interaction to Pointer Events for universal touch, mouse, and stylus drag-to-feed support.
- [x] Implement WCAG accessibility enhancements: ARIA semantics, button labels, and `prefers-reduced-motion` compliance.
- [x] Author strict Firebase security rules audit and verify zero open access.
- [x] Execute automated regression suites across 36 tests with 100% pass rate.
- [x] Compile detailed QA audit report in `docs/phase-6-qa-report.md`.

#### Phase 7: Deployment, Evidence Packaging & Final Submission *(Next Queued Phase)*
- [ ] Configure production web server pipelines (Nginx / Apache / static hosting).
- [ ] Verify static production distribution (`dist/`).
- [ ] Finalize submission `.docx` and `.md` with all prompt entries, test reports, and figures.
- [ ] Package deliverables for final project submission.

---

## 3. Technology Risk & Mitigation Matrix

| Risk Factor | Severity | Probability | Engineered Mitigation |
| :--- | :--- | :--- | :--- |
| **Simultaneous multi-phone write collision** | High | Medium | Use Firebase atomic transactions (`runTransaction`) with monotonic version sequencing (`version: N+1`). |
| **Touch gesture ambiguity (double-tap vs. zoom)** | Medium | High | Apply CSS `touch-action: manipulation` and manage double-tap timing threshold ($\le 300\text{ms}$) via custom touch hook. |
| **High-DPI pixel blurring on modern displays** | High | Low | Enforce CSS `image-rendering: pixelated` and canvas `context.imageSmoothingEnabled = false`. |
| **Battery drain from continuous cloud sync** | Medium | Low | Use timestamp-anchored deterministic decay formulas; calculate vitals on-demand rather than on interval cloud writes. |
| **Network dropout during shared play** | Medium | Medium | Service Worker caches shell; local IndexedDB queues offline actions and reconciles via transactions on reconnect. |
