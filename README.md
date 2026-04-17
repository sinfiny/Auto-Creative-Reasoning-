# Auto Creative Reasoning Skills

This repository is a benchmark-first workspace for building AI writing systems for long-form fiction, especially web novels and webserials.

The goal is not to make AI generate prose once and call it done. The goal is to give AI an actual benchmark against which it can plan, draft, judge, revise, compare alternatives, and make a story better through repeated loops.

The core thesis is simple:

- generation is not the product
- evaluation is the product
- long-form fiction should be improved through explicit benchmarks, rubrics, rewrite ladders, and logged iteration

This repo is where that thesis is being turned into reusable skills, evaluation artifacts, and eventually an operable creative system.

## Codex Plugin

This repository includes a repo-local Codex plugin at [plugins/fiction-autoresearch](/Users/setavya/Hacks/skills/plugins/fiction-autoresearch/README.md).

The plugin is built to make the intended workflow simple:

- start a benchmarked loop from an existing fiction draft
- define or revise a benchmark profile
- record baseline, variants, deltas, and decisions in `projects/<story-slug>/`
- reuse the repository's skill library as evaluative and generative lenses inside the loop

## Primary Goal

Define a crisp, reusable skill library for specific writing and revision tasks.

Provide a benchmark and rubric system that makes quality judgments explicit and comparable.

Route failures to the correct rewrite level: prose, scene, chapter, arc, or premise.

Produce persuasive before/after evidence that the loop improves outcomes in visible ways.

Turn the thesis into an operable system, not just documents, so the loop can be run, logged, and trusted repeatedly.

## Inspirations

This repo is being built from three main lines of inspiration.

### 1. Autoresearch-style improvement loops

The primary inspiration is [`karpathy/autoresearch`](https://github.com/karpathy/autoresearch).

The key transfer is from model improvement to story improvement:

- define a benchmark
- evaluate against it explicitly
- choose the right intervention
- compare versions
- keep the loop running until the work clears a quality bar

This repo treats fiction improvement as an evaluated loop, not a one-shot prompt.

### 2. Treating writing like code and knowledge work

The second major inspiration is [`forrestchang/andrej-karpathy-skills`](https://github.com/forrestchang/andrej-karpathy-skills).

The relevant idea is that AI can handle long-form writing more effectively when the work is structured like engineering or research:

- files and directories for reusable assets
- explicit frameworks and dependencies
- plans, timelines, event order, and character logic
- modular skills instead of giant umbrella prompts

This repo applies that mindset to web novel writing and story architecture.

### 3. Creative-writing craft sources

The third inspiration is craft material from writing lectures, podcasts, and channels, including Brandon Sanderson lectures and related creative-writing discussions.

These influences are used mainly for:

- editing already written content
- moving a story in a different direction when a draft stalls
- deconstructing and reconstructing ideas
- creating structured interventions when the benchmark is not met
- supporting manual author-triggered revision moves

These are craft lenses, not templates to imitate.

## Future Vision

The long-term vision is autonomous long-form fiction work that is only practical because AI can explore many paths instead of committing early to one draft.

That future includes:

- multiple possible timelines of a novel being explored in parallel
- alternate orders of events, reveals, and consequences being compared
- competing versions of character interactions being tested for intensity and payoff
- multiple versions of a story existing at once and being judged against explicit criteria
- AI planning, drafting, judging, revising, and logging work autonomously across long horizons

The aim is not "AI novelist" in the shallow sense.

The aim is a creative optimization system for fiction that can discover the most interesting interactions, the most thrilling narrative path, and the strongest version of a story through evaluated iteration.

## Features This Repo Is Building Toward

- modular writing and revision skills with explicit trigger conditions
- benchmark cards for story tasks such as openings, reveals, confrontations, and arc scaffolds
- rubrics that score hook strength, strategy, clue fairness, consequence density, and readability
- rewrite ladders that route failure to the right level instead of blindly polishing prose
- before/after case evidence that makes improvement legible
- loop contracts and experiment logs for repeatable autonomous runs
- eventually, systems for handling branching timelines, competing chapter versions, and structured story-state management

## Current Strengths

The current repo is strongest in:

- fiction planning and revision workflows
- scene and chapter control loops
- prose and subtext diagnosis
- causal worldbuilding
- strategic mystery webserial design
- creative-autoresearch scaffolding for benchmarked iteration

## Repository Layout

The repo is now organized around four separate concerns:

- **plugin surface**: what Codex users interact with first
- **skill library**: reusable writing, judging, and revision skills
- **loop system**: presets, contracts, candidates, and project run records
- **evidence layer**: cases and validation notes that show whether a skill deserves a place in the loop

Core folders:

```text
plugins/      # Codex plugin entrypoint and plugin-only skills
skills/       # reusable library skills grouped by family
benchmarks/   # cards, protocols, and rubrics
loops/        # contracts, presets, and candidate loop additions
evaluations/  # before/after cases and skill-evidence notes
projects/     # actual fiction projects and recorded loop history
catalog/      # source-of-truth registry for skill/plugin/loop status
docs/         # architecture, roadmap, thesis, and research material
bots/         # trend/discovery tooling and ingestion scaffolds
marketing-site/ # separate Vite app for outward-facing product marketing
site/         # companion interface for the loop board
```

Use [catalog/skills.yaml](/Users/setavya/Hacks/skills/catalog/skills.yaml) to answer:

- is this skill part of the plugin?
- is it in the default loop?
- is it still a candidate?
- has it been validated yet?

## Tracked Skill Families

### `skills/character/`

- `character-driven-storytelling`

### `skills/control/`

- `creative-autoresearch-control-plane`
- `autonomous-webserial-loop`

### `skills/narrative/`

- `narrative-auto-reasoning`
- `narrative-explicit-reasoning`
- `narrative-minimum-viable-prose`
- `narrative-surgical-editing`
- `narrative-hook-hold-payoff`
- `narrative-contextual-prose-density`
- `narrative-epistemic-targeting`

### `skills/interaction/`

- `narrative-subtext-mapping`

### `skills/worldbuilding/`

- `grainbound-causal-worldbuilding`

### `skills/strategy/`

- `strategic-webserial-architecture`
- `strategic-cast-intelligence-engine`
- `faction-power-consequence-engine`
- `mystery-payoff-and-fairness-judge`

### `skills/editorial/`

- `prose-clarity-cadence`

### `skills/marketing/`

- `copywriting-mechanics`

### `skills/nonfiction/`

- `clarity-and-visuality-editor`
- `memorable-lines-and-rhetoric`
- `nonfiction-structure-architect`
- `online-writing-idea-finder`
- `research-interview-synthesis`
- `youtube-visual-scriptwriter`

### `skills/sanderson/`

- `sanderson-character-engine`
- `sanderson-endings-and-revision`
- `sanderson-full-methodology`
- `sanderson-professional-writing`
- `sanderson-promise-progress-payoff`
- `sanderson-publishing-strategy`
- `sanderson-speculative-design`
- `sanderson-story-architecture`

### Plugin Surface

- `plugins/fiction-autoresearch/skills/fiction-autoresearch-loop`
- `plugins/fiction-autoresearch/skills/fiction-benchmark-composer`

## Supporting Workspaces

- `docs/research/` stores source-proof notes, trend reports, and incubation material that may later become skills or product decisions.
- `bots/` holds tooling for discovery, crawling, normalization, and originalization experiments.
- `marketing-site/` is a standalone marketing app and is intentionally separate from the skill/plugin system.

## Why This Exists

Most AI writing systems stop at plausible output. They produce smoother prose, but they do not reliably know whether a chapter became more compelling, more strategic, more addictive, or more structurally sound.

This repository exists to build the missing layer:

- explicit evaluation
- controlled revision
- benchmarked comparison
- reusable writing intelligence

In short, this repo exists to help AI not just write stories, but improve them.

## Working Rules For This Repo

- Keep skills modular. Prefer a new focused skill over turning one skill into a giant umbrella.
- Keep `SKILL.md` lean. Put detailed supporting material in `references/`.
- Update `agents/openai.yaml` whenever you add a new skill.
- Keep the trigger description honest and specific. It is what decides when the skill activates.
- Prefer reusable reference notes over raw web captures.
- When building autonomous writing loops, treat evaluation and rewrite selection as first-class artifacts.
- If a skill is added to or removed from the default loop, update `catalog/skills.yaml` and the relevant file in `loops/presets/`.

## What Not To Commit

This repo intentionally ignores local research and tool artifacts such as:

- Firecrawl caches in `.firecrawl/` and `bots/.firecrawl/`
- temporary scrape output in `bots/.tmp/`
- local `node_modules/`
- downloaded videos and other large source media
- machine-specific clutter like `.DS_Store`

If scraped material matters long-term, distill it into a small reference note instead of committing the raw dump.

## Adding A New Skill

1. Create a new folder under the right family in `skills/`.
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
6. Add or update its entry in `catalog/skills.yaml`.

## Status

This repository is an actively evolving workspace, not a polished package registry. Some local skill folders may exist outside Git while they are still being developed or cleaned up for commit.

The website under `site/` is a companion interface for the repo's benchmark to hypothesis to work to complete loop. It is intentionally separate from the skill folders so the frontend can evolve without adding noise to the skill contracts themselves.
