# AGENTS.md

## Purpose

This repository is a workspace for building and refining agent skills for benchmarked long-form fiction work, especially web novel and webserial planning, drafting, revision, and evaluation.

The core purpose is not generic AI writing. The core purpose is to build an evaluative loop that can help an AI make a story better against an actual benchmark instead of vague "improve this" prompting.

Three inspirations should be treated as first-order context for work in this repo:

- [`karpathy/autoresearch`](https://github.com/karpathy/autoresearch): the primary inspiration for benchmarked autonomous improvement loops where evaluation and iteration matter more than first-pass generation
- [`forrestchang/andrej-karpathy-skills`](https://github.com/forrestchang/andrej-karpathy-skills): the model for treating long-form writing and knowledge work more like code, with files, directories, dependencies, plans, and reusable workflows
- creative-writing craft sources such as Brandon Sanderson lectures and similar writing podcasts/channels: used mainly for revision moves, deconstruction, reconstruction, and directed creative recovery when the benchmark is not yet met

Agents should preserve those inspirations in the repo's shape and language. This is a writing-systems workspace, not a style-mimicry prompt dump.

Agents working here should optimize for:

- small, composable skills
- honest trigger descriptions
- reusable references instead of raw cache dumps
- minimal repo noise
- benchmarked improvement over vague "make it better" loops

## Operating Direction

Agents should understand the long-term vision behind the current artifacts:

- AI should be able to explore multiple possible timelines of a novel instead of committing to one linear draft too early.
- AI should be able to compare alternate character interactions, event orders, reveals, and chapter structures against explicit quality bars.
- Stories should eventually exist in multiple competing versions that can be benchmarked against each other.
- The system should move toward autonomous long-form writing workflows that can plan, test, judge, revise, and log work repeatedly.

When adding skills, references, benchmarks, or tooling, prefer work that makes this future more operable.

## Expected Skill Shape

Each committed skill should normally include:

```text
skill-name/
  SKILL.md
  agents/
    openai.yaml
```

Optional:

```text
skill-name/
  references/
    ...
```

Use `references/` for reusable notes, rubrics, contracts, and source maps. Do not use it as a dumping ground for one-off scrape output.

## Skill Writing Rules

- Keep `SKILL.md` focused on workflow, routing, rules, and output contracts.
- Put long supporting material into `references/`.
- Prefer a narrow skill with a crisp purpose over a broad vague one.
- Do not imitate living authors or copy proprietary settings. Use source works as craft benchmarks, not templates.
- If a skill coordinates other skills, make the routing logic explicit.
- For autonomous creative work, prefer explicit benchmarks, rubrics, and rewrite ladders over aesthetic intuition alone.
- Treat long-form fiction work like structured knowledge work where useful: plans, dependencies, timelines, character/state files, and reusable framework documents are encouraged when they clarify the loop.
- Revision-oriented craft references should usually inform diagnosis and intervention, not become ornamental summary material.

## Repo Hygiene

- Do not commit `.DS_Store`, local caches, `node_modules`, temporary scrape output, or downloaded videos.
- Prefer committing cleaned reference notes instead of raw Firecrawl captures.
- Keep README aligned with what is actually tracked on `main`.
- If you add a new committed skill, update the README when the new family changes the repo's shape in a meaningful way.
- If you add loop tooling, make sure it points to `benchmark/`, `rubrics/`, `loop/`, and `cases/` rather than hiding evaluation logic in prompts alone.

## Git Guidance

- This repo may contain many local-only skill folders under development. Do not add broad globs that accidentally commit all of them.
- Stage only the files relevant to the current task.
- Before pushing, inspect `git diff --name-only origin/main...HEAD` so large artifacts do not sneak into a commit.
- If a commit accidentally captures bulky local material, preserve it on a backup branch before rewriting `main`.

## Documentation Guidance

- README should describe the repo at a family or suite level, not enumerate every experimental local folder.
- `AGENTS.md` should stay operational and brief.
- Use examples when they reduce ambiguity, not just to add volume.
- README should make the benchmark-first goal, the inspirations, and the future-facing product vision obvious within the first screen or two.
