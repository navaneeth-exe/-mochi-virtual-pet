---
description: Documentation maintenance, AI prompt tracking, evidence preservation, and sync between Markdown and Word files for MOCHI.
trigger: always_on
globs: "**/*{doc,submission,prompt}*"
---

# Documentation Rules — MOCHI: Your Pocket Companion

## 1. Living Documentation Mandate
Documentation in this project is not an afterthought; it is an active, mandatory deliverable. All architectural decisions, schema evolutions, and feature implementations must be immediately documented in `docs/` and tracked in `submission/MOCHI_AI_Prompts_and_Outputs.docx` and `submission/MOCHI_AI_Prompts_and_Outputs.md`.

## 2. Complete AI Prompt Preservation
Whenever an AI model (Claude, Gemini, Antigravity, Midjourney, ChatGPT, etc.) is prompted for:
- Character visual art generation or sprite extraction
- Story ideation or emotion refinement
- Architecture design or database schemas
- Core algorithms (decay timers, state machines, conflict resolution)

You MUST capture and record:
1. **Prompt Entry Number:** Sequential ID (e.g., Prompt 01, Prompt 02).
2. **Objective / Task:** Precise purpose of the prompt.
3. **AI Tool Used:** Model name, platform, and interface.
4. **Exact Original Prompt:** Full, unshortened prompt text. Never summarize or truncate.
5. **Refinement Prompt:** If the output required tweaks, record the exact follow-up prompt.
6. **Reason for Refinement:** Technical or creative justification for the iteration.
7. **Generated Output:** Exact code snippet, markdown, or generated visual asset.
8. **Final Decision:** Whether the output was accepted, rejected, or modified.
9. **Date & Timestamp:** ISO timestamp of the run.

## 3. Dual-Format Synchronization (.docx and .md)
- `submission/MOCHI_AI_Prompts_and_Outputs.md` serves as the version-controlled, git-friendly source of truth.
- `submission/MOCHI_AI_Prompts_and_Outputs.docx` serves as the official, professionally formatted submission document.
- The Python documentation generator script in `.agents/skills/project-documentation/` must be run whenever entries are updated so that both formats remain 100% in sync.

## 4. Integrity and Evidence Standards
- **Zero Fabrication:** Never invent fake prompt responses, mock screenshots, or imaginary test suites.
- **Embedded Visuals:** Embed genuine extracted sprites, architecture diagrams, and real application screenshots directly into the Word document.
- **Inspect Before Release:** Verify that the generated `.docx` opens cleanly without corruption or formatting errors.

