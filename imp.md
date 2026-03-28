# Implementation Notes

This file tracks all structural and implementation decisions made in this project,
serving as a reference for establishing a standard pattern.

---

## Project Goal

Propose technical challenges for company onboarding. Developers interact with these
challenges to gain hands-on experience with the technologies used in the company.

---

## Directory Structure

```
poc/
├── imp.md                              # This file — implementation log and pattern reference
├── site-plan.md                        # Implementation plan for the local dashboard site
├── .claude/
│   └── commands/
│       ├── task.md                     # /task skill — implements a T-NNN task with precision
│       └── novo-projeto.md             # /novo-projeto skill — scaffolds a new onboarding project base
├── site/                               # Local dashboard (React + Vite + Express)
│   ├── public/
│   │   └── ref/
│   │       └── GIF/                    # Only the 2 GIFs actually used by the site
│   └── ...                             # See site-plan.md for full structure
└── tasks/
    ├── template.md                     # Template for creating new tasks
    ├── criteria/
    │   └── template.json               # Template for creating evaluation criteria (rubric)
    ├── evaluate/
    │   └── prompts/
    │       └── evaluator.prompt.md     # System + user prompt sent to Claude API per evaluation
    └── person/
        ├── person.json                 # Developer profile instance (starts empty)
        ├── template.json               # Template for developer profile structure
        └── study/
            ├── template.json           # Template for study plan structure
            └── plan.json               # Active study plan (overwritten by evaluator when needed)
```

---

## Implementation Log

### 2026-03-28 — Initial Structure

- Created `tasks/` as the root container for all challenge-related content.
- Created `tasks/criteria/` — intended to hold the criteria by which each task is evaluated.
- Created `tasks/evaluate/` — intended to hold evaluation logic or results.
- Created `tasks/person/` — intended to hold the developer's profile.
- Created `tasks/person/person.json` — empty JSON object `{}` as a placeholder.

### 2026-03-28 — Templates and Evaluator Prompt

- Created `tasks/template.md` — canonical template for all future tasks. Contains YAML frontmatter
  (id, name, type, difficulty, estimate, services, tags) and the following sections:
  - **Contexto**: observable facts about the current state, no solution hints.
  - **Escopo**: what must be done (not how), each item independently verifiable.
  - **Dicas**: optional references; not a step-by-step guide.
  - **Fora do escopo**: explicit exclusions to prevent gold-plating.
  - **Definition of done**: binary, verifiable criteria — always includes tests.
  - **Domain**: code addresses owned by this task; must not be touched by other tasks unless
    updating this task or its technologies.

- Created `tasks/criteria/template.json` — canonical template for evaluation rubrics. Structure:
  - `references`: pointer to `pattern_file` and `functional_check` command.
  - `dod_criteria`: maps each DoD item to `how_to_verify` + three-tier `evaluation`
    (insufficient / partial / sufficient).
  - `hidden_criteria`: undisclosed criteria with `weight` and `rationale` for composing hints
    without revealing the criterion.
  - `final_evaluation.rules`: five ordered levels (insufficient → partial → sufficient →
    very_good → exceptional) with explicit conditions and a `tiebreaker` by weight.
  - `evaluator_instructions`: tone, language (Português), and rules for hidden criteria handling.

- Created `tasks/evaluate/prompts/evaluator.prompt.md` — prompt file sent to the Claude API.
  - **System prompt** (fixed): defines the evaluator persona, 5-step evaluation process, and
    strict rules on hidden criteria, alternative solutions, and response format.
  - **User prompt** (dynamic): CLI replaces `{{PLACEHOLDERS}}` with actual content at runtime
    (profile, task, rubric, pattern file, functional check output, git diff, test results).
  - **Response schema**: structured JSON covering dod_results, hidden_results, pattern_check,
    functional_check, strengths, mainFeedback, hints, nextFocusArea, and profileUpdate.

### 2026-03-28 — Person Template, Study Plan and Site Plan

- Created `tasks/person/template.json` — developer profile structure with:
  - `skills.scores`: score 0–10 per technology (JS, Node, Nest, OTel, Honeycomb, Splunk, MongoDB, Redis)
    feeds the radar chart on the dashboard.
  - `strengths` / `improvementAreas`: free-text arrays updated after each evaluation.
  - `patterns`: behavioral patterns with type (positive/negative/neutral) and lifecycle
    (active/resolved), accumulated from `profileUpdate.patterns` in evaluation reports.
  - `evaluationHistory`: append-only log of task results.
  - `studyPlan.active` + `currentPlanFile`: pointer to the active study plan.

- Created `tasks/person/study/template.json` — study plan structure with:
  - `meta`: generation date, source evaluations, total weeks, start/end dates.
  - `diagnosis`: weakness/strength analysis that justifies the plan.
  - `topics`: each topic has technology, category, priority, timeline (startWeek/endWeek/durationDays/effort),
    objectives, references (with type and estimated time), and milestones.
  - `weeklyOverview`: weekly focus summary for timeline rendering in the site.

- Created `tasks/person/study/plan.json` — empty plan instance (planStatus: "draft").
  Overwritten by the evaluator CLI when `studyPlanUpdate.shouldGenerate = true`.

- Updated `tasks/evaluate/prompts/evaluator.prompt.md`:
  - Fixed evaluation step order: 1 (DoD) → 2 (hidden) → 3 (pattern+functional_check) →
    4 (final level) → 5 (skill delta) → 6 (study plan) → 7 (feedback).
  - Added ETAPA 5: `skillDelta` — evaluator proposes a -2 to +2 delta on the technology
    skill score; CLI applies it to person.json.
  - Added ETAPA 6: `studyPlanUpdate` — evaluator generates a study plan (≤8 weeks) when
    finalLevel is insufficient/partial or dev has recurring unresolved patterns.
  - Added null-handling instructions for empty profile, missing pattern_file, unrun functional_check.
  - Added `{{TASK_ID}}` as explicit placeholder to prevent misread from frontmatter.
  - Enriched `profileUpdate` with `skillDelta`, `strengthsUpdate`, `improvementAreasUpdate`.
  - Enriched `nextFocusArea` with `rationale` field.

- Created `site-plan.md` — full implementation plan for the local dashboard site. See that file
  for stack decisions, folder structure, API endpoints, component breakdown, and build order.

### 2026-03-28 — Local Dashboard Site (site/)

- Implemented `site/` — local dashboard running React 18 + Vite (port 5173) + Express API (port 3001).
  Started with `npm run dev` via concurrently. See `site-plan.md` for full implementation details.
- Site assets: only the 2 GIFs actually used (`_ANIMATED LOGO DARK RED.gif` and `_ANIMATED LOGO LIGHT BLUE.gif`)
  are stored in `site/public/ref/GIF/` — served directly by Vite, no Express static middleware needed.
  All other files in `ref/` are not consumed by the site.

### 2026-03-28 — Claude Code Skills (.claude/commands/)

- Created `.claude/commands/task.md` — slash command `/task T-NNN` for implementing tasks.
  Drives the AI through: read task → explore domain → ask clarifying questions only if blocking
  ambiguity exists → plan mapped to DoD → implement within scope → verify DoD item by item →
  verify fora do escopo → deliver auditable report. Questions are grouped in a single message and
  only asked when the ambiguity would produce two valid but different implementations.

- Created `.claude/commands/novo-projeto.md` — slash command `/novo-projeto` for scaffolding a
  new onboarding project base. Collects answers across 4 blocks (project context, patterns and
  checks, task intent, initial state delivered to the dev) before generating any file. After
  answers: presents directory tree for confirmation, then creates files in order (package.json →
  config → module skeletons → env → docker-compose → README), marks intentional gaps with
  `// INTENTIONAL:` comments, and closes with a delivery summary mapping what is implemented vs
  what is left open for tasks.

---

## Pattern Conventions

- Each new task (`T-NNN.md`) must follow `tasks/template.md` exactly — frontmatter included.
- Each task must have a paired `tasks/criteria/T-NNN.eval.json` following `criteria/template.json`.
- `tasks/evaluate/prompts/evaluator.prompt.md` is the single prompt contract — the CLI reads it
  verbatim; only placeholders change per run.
- `person.json` accumulates `profileUpdate.patterns` from each evaluation report and is passed
  back as `{{PROFILE_JSON}}` on subsequent evaluations.
- `domain` entries in task files act as ownership markers — cross-task changes to those paths
  require explicit justification.
- Evaluation levels: insufficient → partial → sufficient → very_good → exceptional.
  First matching rule wins; tiebreaker resolves adjacency by hidden_criteria weight.
- `person.json` is the single source of truth for the site's radar chart and dashboard.
  The CLI applies `skillDelta` and `profileUpdate` after each evaluation.
- `study/plan.json` is overwritten (never appended) when a new plan is generated.
  Previous plans should be archived by the CLI to `evaluate/reports/` before overwriting.
- Site (`site/`) runs on `npm run dev`: Vite (5173) + Express API (3001) via concurrently.
  See `site-plan.md` for full implementation details.
- Site static assets live in `site/public/` — only assets actually referenced in source go there.
  The `ref/` directory at the repo root is the source of truth for brand assets; copy only what is used.
- Claude Code skills live in `.claude/commands/` as markdown files. Each file becomes a `/command-name`
  slash command. Skills follow the pattern: ask all questions upfront in one message → plan →
  execute → verify → report. Never interleave questions with implementation.
