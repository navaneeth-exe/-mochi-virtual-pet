---
name: project-documentation
description: Protocol and automated workflow for capturing AI prompts, recording outputs, updating Markdown logs, and regenerating the official submission Word document (.docx).
trigger: model_decision
globs: "**/*{doc,submission,docx,prompt}*"
---

# Project Documentation Skill — MOCHI: Your Pocket Companion

## 1. Skill Purpose & Scope
This skill guides agents and developers on maintaining continuous, synchronous, and non-destructive documentation for the MOCHI project. It enforces the strict academic requirement that every generative prompt, refinement, rationale, test output, and architecture change is preserved in both:
1. `submission/MOCHI_AI_Prompts_and_Outputs.md` (Git-tracked Markdown source of truth)
2. `submission/MOCHI_AI_Prompts_and_Outputs.docx` (Official formatted submission document)

---

## 2. When to Use This Skill
Activate this skill whenever:
- A new AI prompt is executed for character sprite generation, emotion iteration, or story refinement.
- An engineering milestone or phase transition is reached.
- An architectural or database decision is made.
- Test suites or verification steps are run (recording empirical outputs and screenshots).
- Preparing final submission deliverables.

---

## 3. The 4-Step Documentation Workflow

```
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│  STEP 1: CAPTURE       │      │  STEP 2: APPEND MD     │      │  STEP 3: RUN GENERATOR │      │  STEP 4: VERIFY DOCX   │
│ Record exact prompt,   │ ───> │ Append entry to        │ ───> │ Execute python script  │ ───> │ Open docx with python  │
│ tool, date, output,    │      │ submission/            │      │ generate_docx.py to    │      │ to confirm integrity   │
│ & refinement reason    │      │ MOCHI_...md            │      │ rebuild Word document  │      │ and formatting         │
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘      └────────────────────────┘
```

### Step 1: Capture Complete Prompt Metadata
Whenever prompting an AI tool (Antigravity, Gemini, Claude, Midjourney, DALL-E, etc.), record:
- **Sequential Prompt ID:** (e.g. Prompt 005)
- **Task Objective:** What specific feature or asset was targeted?
- **AI Tool & Date:** Model name, platform, and ISO date.
- **Exact Original Prompt:** Unshortened, full prompt string.
- **Refinement Prompt:** Any subsequent modification prompt.
- **Reason for Refinement:** Technical or artistic justification.
- **Generated Output:** Code snippet, JSON response, or image path.
- **Final Decision:** Accepted / Rejected / Modified.

### Step 2: Append to Markdown Source
Open [`submission/MOCHI_AI_Prompts_and_Outputs.md`](file:///c:/Users/NAVANEETH/Documents/Academic%20Projects/Game_Dev/MOCHI-VIRTUAL-PET/submission/MOCHI_AI_Prompts_and_Outputs.md) and append the new entry under `## Section B: AI Prompt Experiments & Log` or `## Section D: Application Development Evidence`.  
*Rule: Never overwrite previous prompt history. Always append sequentially.*

### Step 3: Regenerate Word Document (.docx)
The Python generator script is located at:
`MOCHI-VIRTUAL-PET/.agents/skills/project-documentation/generate_docx.py`

Run the generation command from the project root:
```powershell
python "MOCHI-VIRTUAL-PET/.agents/skills/project-documentation/generate_docx.py"
```

The script automatically:
- Applies executive styling (title cover, margins, Calibri typography, custom headers/footers).
- Re-renders Section A, Section B, Section C, Section D, and Section E.
- Embeds any new screenshots and sprite assets into document tables.
- Preserves document editability.

### Step 4: Verification Check
Always run a quick validation command to guarantee the `.docx` file is uncorrupted:
```powershell
python -c "import docx; doc = docx.Document('MOCHI-VIRTUAL-PET/submission/MOCHI_AI_Prompts_and_Outputs.docx'); print(f'Paragraphs: {len(doc.paragraphs)}, Tables: {len(doc.tables)}') "
```

---

## 4. Documentation Integrity Rules
1. **Never Summarize Prompts:** Store the literal prompt text so experiments are 100% reproducible.
2. **Never Fabricate Assets or Logs:** If a test failed, record the exact error log; never invent dummy passing logs.
3. **Synchronize Immediately:** Update the document right after completing an activity, never postpone until the end of the project.

