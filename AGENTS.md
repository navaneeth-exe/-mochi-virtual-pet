# AGENTS.md — Persistent Instructions for MOCHI: Your Pocket Companion

> **Target Audience:** All AI agents, pair programmers, and subagents operating in this repository.  
> **Status:** Active & Mandatory  
> **Authoritative Baseline:** Virtual Pet AI Challenge Specifications & Architecture Requirements

---

## 1. Core Operating Principles

As an agent working on **MOCHI — Your Pocket Companion**, you must strictly abide by these persistent project rules:

1. **Mandatory Specification Precedence:**
   - Always read and consult [`docs/requirements.md`](file:///c:/Users/NAVANEETH/Documents/Academic%20Projects/Game_Dev/MOCHI-VIRTUAL-PET/docs/requirements.md) before designing, modifying, or implementing any feature.
   - Never drop, alter, or dilute mandatory assignment requirements (the 3 core tasks: Storytelling, 4 Black-and-White Emotion Prototype, and Multiple-Phone Architecture with Synchronization & Technical Difficulty Resolution).
   - Distinguish mandatory assignment deliverables from optional product enhancements.

2. **Follow Architectural & Design Systems:**
   - Adhere strictly to [`docs/architecture.md`](file:///c:/Users/NAVANEETH/Documents/Academic%20Projects/Game_Dev/MOCHI-VIRTUAL-PET/docs/architecture.md) and [`docs/design-system.md`](file:///c:/Users/NAVANEETH/Documents/Academic%20Projects/Game_Dev/MOCHI-VIRTUAL-PET/docs/design-system.md).
   - Ask for explicit user approval before introducing any architectural pivot, switching backends, changing the database schema, or altering core libraries.

3. **Rule Enforcement:**
   - Comply with all specialized rule files located in `.agents/rules/`:
     - [`project-rules.md`](file:///c:/Users/NAVANEETH/Documents/Academic%20Projects/Game_Dev/MOCHI-VIRTUAL-PET/.agents/rules/project-rules.md)
     - [`frontend-design.md`](file:///c:/Users/NAVANEETH/Documents/Academic%20Projects/Game_Dev/MOCHI-VIRTUAL-PET/.agents/rules/frontend-design.md)
     - [`coding-standards.md`](file:///c:/Users/NAVANEETH/Documents/Academic%20Projects/Game_Dev/MOCHI-VIRTUAL-PET/.agents/rules/coding-standards.md)
     - [`firebase-security.md`](file:///c:/Users/NAVANEETH/Documents/Academic%20Projects/Game_Dev/MOCHI-VIRTUAL-PET/.agents/rules/firebase-security.md)
     - [`documentation-rules.md`](file:///c:/Users/NAVANEETH/Documents/Academic%20Projects/Game_Dev/MOCHI-VIRTUAL-PET/.agents/rules/documentation-rules.md)

4. **Mobile-First Responsive PWA:**
   - Target an installable Progressive Web Application (PWA) with offline capabilities (Service Worker), responsive touch-first controls, and viewport adaptation across mobile, tablet, and desktop screens.

5. **Code Quality & Modular Architecture:**
   - Write clean, modular TypeScript code with strict type checking.
   - Separate concerns: UI components, pet state machine, real-time Firebase sync, audio synthesizer/FX, and offline persistence.

6. **Rigorous Verification Over Claims:**
   - Never claim a feature is complete, working, or bug-free without running verification commands, inspecting outputs, or validating test cases.
   - Never fabricate test logs, screenshots, or mock outputs.

7. **Living Documentation & Prompt Preservation:**
   - Maintain the Word prompt-and-output record ([`submission/MOCHI_AI_Prompts_and_Outputs.docx`](file:///c:/Users/NAVANEETH/Documents/Academic%20Projects/Game_Dev/MOCHI-VIRTUAL-PET/submission/MOCHI_AI_Prompts_and_Outputs.docx)) and its Markdown mirror ([`submission/MOCHI_AI_Prompts_and_Outputs.md`](file:///c:/Users/NAVANEETH/Documents/Academic%20Projects/Game_Dev/MOCHI-VIRTUAL-PET/submission/MOCHI_AI_Prompts_and_Outputs.md)) concurrently with every prompt and development milestone.
   - Whenever implementation decisions, schemas, or routes change, immediately update the corresponding docs in `docs/` and log the entry in `docs/development-log.md`.

---

## 2. Directory Navigation Quick Reference

| Directory / File | Description |
| :--- | :--- |
| `references/` | Reference materials, assignment PDFs, and visual references. |
| `docs/requirements.md` | Authoritative requirements, mandatory vs. optional features, acceptance criteria. |
| `docs/project-plan.md` | Phases, milestones, task checklist, and dependencies. |
| `docs/architecture.md` | PWA, Firebase Auth/Realtime Database, multi-phone sync, deployment pipeline. |
| `docs/design-system.md` | Monochrome palette, pixel-art specs, typography, animations, responsive design. |
| `docs/database-schema.md` | Realtime Database data layout, security rules, conflict resolution, pet state. |
| `docs/testing-strategy.md` | Unit, integration, visual regression, multi-device sync, and PWA testing. |
| `docs/development-log.md` | Chronological log of engineering decisions, changes, and fixes. |
| `.agents/rules/` | Specialized engineering, security, and documentation guidelines. |
| `.agents/skills/` | Operational skills (e.g., project-documentation automation). |
| `submission/` | Final deliverables: .docx and .md prompt records, diagrams, character assets. |
| `public/assets/` | Static game assets, monochrome sprite sheets, icons, manifest. |

---

## 3. Communication Protocol

- When presenting work to the user, link directly to created/modified files using `file:///` URLs.
- Highlight key decisions, architectural tradeoffs, and any items requiring user sign-off.
- Never advance to implementing game features without clear, explicit authorization.

