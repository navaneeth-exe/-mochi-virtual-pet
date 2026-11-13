---
description: Overall project objectives, mandatory assignment constraints, development workflow, and feature priorities for MOCHI.
trigger: always_on
globs: "**/*"
---

# Project Rules — MOCHI: Your Pocket Companion

## 1. Project Objectives
MOCHI is an AI-assisted virtual pet companion designed as a mobile-first Progressive Web App (PWA). It brings a charming, nostalgic, digital pocket pet experience inspired by Tamagotchi, Finch, and Neko Atsume, powered by modern web technologies, multi-device real-time synchronization, and a distinct monochrome pixel-art aesthetic.

## 2. Mandatory Assignment Requirements (Authoritative Baseline)
The following requirements originate from the Virtual Pet AI Challenge and MUST never be compromised:
- **Task 1 — Tell a Story:**
  - Character narrative: Mochi emerged from inside a semiconductor chip.
  - Specified core interactions:
    - Hover cursor over Mochi and press Spacebar $\to$ Mochi runs.
    - Double-tap / double-click Mochi $\to$ Mochi becomes super happy.
    - Drag/take Mochi to the top of the window $\to$ feed Mochi.
    - Additional companion interactions: jump, sing songs, emotional reactions.
- **Task 2 — Make a Prototype (Character & Emotion Artwork):**
  - Character extraction prompt: Isolate Mochi from UI/backgrounds, retaining round body, two-leaf sprout, tiny hands/feet, bold black pixelated outline on plain white background.
  - Strict visual style prompt: Black-and-white pixel art ONLY (black, white, subtle grayscale shading). No colors, gradients, or non-pixel decorations. Identical proportions and sprout across all frames.
  - Four distinct emotional expressions:
    1. **Sad:** Drooping eyes, small frowning mouth, visible tear.
    2. **Happy:** Closed smiling eyes, open cheerful mouth, raised blush/cheeks.
    3. **Surprised:** Wide-open eyes, round open mouth, reaction marks (`!?`).
    4. **Angry:** Downward-angled eyebrows, intense eyes, small angry mouth, anger vein mark.
- **Task 3 — Architecture & Realtime Synchronization:**
  - Build pipeline: HTML5 / Canvas / WebGL game container.
  - Deployment pipeline: Web server configuration (Nginx / Apache / modern static host with HTTPS and service worker headers).
  - Multi-phone shared pet architecture: Two or more phones/browsers can simultaneously observe and interact with the same pet instance with real-time state synchronization, conflict resolution, and offline resilience.
  - Technical difficulties and solutions: Document latency, race conditions, offline/online reconciliation, and optimistic UI updates.
- **Submission Preservation:**
  - Full Word document (`submission/MOCHI_AI_Prompts_and_Outputs.docx`) and Markdown source preserving all AI prompts, refinements, rationales, dates, tool names, generated assets, screenshots, and test logs.

## 3. Technology Constraints
- **Frontend Core:** Modern lightweight framework (React/TypeScript with Vite or vanilla TypeScript Web Components) designed for high performance, zero bloat, and sub-second load times.
- **PWA Capabilities:** Web App Manifest, Service Worker for offline asset caching, touch gestures, and responsive viewport scaling.
- **Backend / Realtime Sync:** Firebase Authentication (Anonymous + Email/Pin pairing) and Firebase Realtime Database (low-latency WebSockets) with strict security rules.
- **Visuals:** Strict monochrome (1-bit / 2-bit pixel art style with retro LCD paper tint).
- **Audio:** Web Audio API synthesized retro bleeps and 8-bit chimes (no heavy MP3 downloads required).

## 4. Development Workflow
1. **Foundation & Documentation First:** No application code until docs and approval are locked.
2. **Phase Approval Gate:** Before advancing from one phase to the next, inspect outcomes and acquire user confirmation.
3. **Continuous Documentation Sync:** Record every prompt, refinement, and output in both `.md` and `.docx` before closing any phase.
4. **Never Fabricate:** Never make up test logs, dummy success claims, or mock screenshots.

## 5. Feature Prioritization
- **P0 (Mandatory Core):**
  - Story-aligned interactions (Run via spacebar, Super Happy via double-tap, Feed at window top).
  - 4 verified monochrome emotion sprites (Sad, Happy, Surprised, Angry) and idle state.
  - Realtime multi-device pet synchronization via Firebase.
  - Complete Word and Markdown prompt-and-output submission logs.
- **P1 (PWA & UX Polish):**
  - Service worker offline support, sound toggle (Web Audio chimes), hunger/happiness gauges.
  - Room environment and tactile mini-animations.
- **P2 (Optional Enhancements):**
  - Sound effects toggle, mini-games, journal notes, pet accessories (monochrome).

