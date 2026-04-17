# Auto Creative Reasoning Skills

This repository is a working collection of modular writing and story-craft skills for Codex-style agents. Each skill is a small, focused unit with a repeatable operating loop, output contract, and optional reference material.

The current repo is strongest in:

- fiction planning and revision workflows
- scene and chapter control loops
- prose and subtext diagnosis
- causal worldbuilding
- strategic mystery webserial design
- creative-autoresearch scaffolding for benchmarked iteration

## Repository Layout

Each tracked skill follows the same basic structure:

```text
skill-name/
  SKILL.md
  agents/
    openai.yaml
  references/
    ...
```

What each file does:

- `SKILL.md`: the actual skill contract, trigger description, rules, and workflow
- `agents/openai.yaml`: UI-facing metadata such as display name and default prompt
- `references/`: only the extra material that the skill may need on demand

The repo also now contains research scaffolding folders:

```text
benchmark/   # benchmark cards and evaluation protocol
rubrics/     # scoring systems and rewrite ladders
loop/        # iteration contracts and experiment logs
cases/       # before/after proof templates
memo/        # startup and research thesis docs
site/        # Astro + shadcn website for the novel loop board
```

## Tracked Skill Families

### Narrative Control Loops

- `narrative-explicit-reasoning`
- `narrative-minimum-viable-prose`
- `narrative-surgical-editing`
- `narrative-hook-hold-payoff`
- `narrative-auto-reasoning`

### Prose And Interpretation

- `narrative-contextual-prose-density`
- `narrative-epistemic-targeting`
- `narrative-subtext-mapping`
- `prose-clarity-cadence`

### Worldbuilding And Structure

- `grainbound-causal-worldbuilding`

### Strategic Mystery Webserial Suite

- `strategic-webserial-architecture`
- `strategic-cast-intelligence-engine`
- `faction-power-consequence-engine`
- `mystery-payoff-and-fairness-judge`
- `autonomous-webserial-loop`

### Creative Autoresearch Layer

- `creative-autoresearch-control-plane`
- benchmark, rubric, loop, case, and memo scaffolds for evaluated iteration

## Implemented Features

- Modular writing and story-craft skills with explicit `SKILL.md` contracts
- UI-facing skill metadata through `agents/openai.yaml`
- Reusable `references/` notes for higher-context skills
- Narrative control loops for planning, drafting, editing, and hook/hold/payoff checks
- Prose diagnosis tools for clarity, cadence, subtext, density, and reader targeting
- Strategic worldbuilding and mystery-webserial architecture skills
- Creative-autoresearch scaffolding through `benchmark/`, `rubrics/`, `loop/`, `cases/`, and `memo/`
- Orchestration skills that route across narrower component skills instead of relying on one giant prompt

## Yet To Implement

- More filled-in benchmark cards and public before/after cases so the evaluation layer has stronger proof artifacts
- Cleaner integration of local research and trend-analysis work into reusable references instead of loose working reports
- A more finished bot-to-benchmark workflow that connects discovery, normalization, commentary, and policy-gated extraction
- Additional repo-level documentation for how the skill families fit together as one system for new contributors
- Further cleanup and triage of local-only experimental material before it is promoted into committed skill families

## Working Rules For This Repo

- Keep skills modular. Prefer a new focused skill over turning one skill into a giant umbrella.
- Keep `SKILL.md` lean. Put detailed supporting material in `references/`.
- Update `agents/openai.yaml` whenever you add a new skill.
- Keep the trigger description honest and specific. It is what decides when the skill activates.
- Prefer reusable reference notes over raw web captures.
- When building autonomous writing loops, treat evaluation and rewrite selection as first-class artifacts.

## What Not To Commit

This repo intentionally ignores local research and tool artifacts such as:

- Firecrawl caches in `.firecrawl/` and `bots/.firecrawl/`
- temporary scrape output in `bots/.tmp/`
- local `node_modules/`
- downloaded videos and other large source media
- machine-specific clutter like `.DS_Store`

If scraped material matters long-term, distill it into a small reference note instead of committing the raw dump.

## Adding A New Skill

1. Create a new folder named after the skill.
2. Add `SKILL.md` with clear frontmatter:

```yaml
---
name: your-skill-name
description: Use when ...
---
```

3. Add `agents/openai.yaml`.
4. Add `references/` only if the skill truly needs extra material.
5. Keep examples and contracts concise enough that the skill stays cheap to load.

## Status

This repository is an actively evolving workspace, not a polished package registry. Some local skill folders may exist outside Git while they are still being developed or cleaned up for commit.

The website under `site/` is a companion interface for the repo's benchmark to hypothesis to work to complete loop. It is intentionally separate from the skill folders so the frontend can evolve without adding noise to the skill contracts themselves.
