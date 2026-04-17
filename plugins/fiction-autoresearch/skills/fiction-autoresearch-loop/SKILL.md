---
name: fiction-autoresearch-loop
description: Use when a user wants to start, continue, or review a benchmarked fiction-improvement loop from an existing piece of writing. Initializes a recorded project structure, benchmarks the current draft from multiple lenses, generates assumption-driven variants, and keeps only improvements that clear the selected benchmark.
---

# Fiction Autoresearch Loop

Use this skill when the task is not merely "write a scene" or "edit this prose," but "run an autoresearch-style improvement loop on fiction."

This skill is the plugin entry point for the repository's intended use.

## Inspirations

This workflow translates two source patterns into long-form fiction:

- `karpathy/autoresearch`: keep a baseline, run bounded experiments, benchmark the result, keep or discard, and log every pass
- `forrestchang/andrej-karpathy-skills`: think before changing anything, keep interventions simple, make surgical edits, and define explicit success criteria

## Use This Skill To

- start a new loop from an existing chapter, scene, outline, or arc
- continue a previous loop with new assumptions or rewrite levels
- compare multiple variants of the same fiction unit
- keep a clean record of baseline, variants, benchmarks, deltas, and decisions

## First Step

If the story does not already have a project workspace, initialize it with:

```bash
python3 plugins/fiction-autoresearch/scripts/init_fiction_autoresearch_run.py <story-slug> --title "<story title>" --loop-id <loop-id>
```

Use a loop id like `2026-04-17-baseline`, `2026-04-17-reveal-pass`, or `2026-04-17-arc-repair`.

## Required Project Structure

Keep all loop work under:

```text
projects/<story-slug>/
  README.md
  source/
    input.md
  state/
    characters.md
    timeline.md
    threads.md
  benchmarks/
    README.md
    profiles/
      active-benchmark.md
  loops/
    <loop-id>/
      README.md
      baseline/
        input-snapshot.md
        benchmark-report.md
      variants/
        <variant-id>/
          assumption.md
          candidate.md
          benchmark-report.md
          delta.md
          decision.md
      summary.md
```

Read `references/run-lifecycle.md` and `references/skill-lens-map.md` before a long run.

## Core Loop

1. Read the current fiction unit from `source/input.md` or the active loop snapshot.
2. Read `benchmarks/profiles/active-benchmark.md`.
3. Produce a baseline benchmark report in `loops/<loop-id>/baseline/benchmark-report.md`.
4. Identify the highest-level failure:
   - prose
   - scene
   - chapter
   - arc
   - premise
5. Generate one variant per assumption, not one giant mixed rewrite.
6. For each variant, write:
   - `assumption.md`
   - `candidate.md`
   - `benchmark-report.md`
   - `delta.md`
   - `decision.md`
7. Keep a variant only if it improved the intended target under the active benchmark.
8. Write a loop-level `summary.md` that states what to keep, what to discard, and what to test next.

## Assumption Discipline

Each variant should test one main assumption only, for example:

- the chapter needs a stronger opening tradeoff
- the protagonist should act earlier
- the reveal order is wrong
- the scene is failing due to missing subtext, not weak prose
- the benchmark is overweighting readability and underweighting consequence

Do not combine multiple major hypotheses into one variant unless the benchmark itself demands a chapter- or arc-level rewrite.

## Skill Routing

Use repository skills as evaluative or generative lenses inside the loop.

Start from this default route:

- `$creative-autoresearch-control-plane` for the top-level control decision
- `$mystery-payoff-and-fairness-judge` for benchmarked judging
- `$autonomous-webserial-loop` for strict strategic-webserial iteration
- `$narrative-auto-reasoning` for general scene/chapter drafting and revision
- `$strategic-webserial-architecture` when the real failure is ordering, reveal design, or promise-stack structure
- `$strategic-cast-intelligence-engine` when actors are not behaving intelligently enough
- `$faction-power-consequence-engine` when systems, factions, or costs are under-designed

Use extra lenses from `references/skill-lens-map.md` when composing a custom benchmark.

## Output Contract

For each active loop, the final status should be legible from files alone.

Write the following minimum summary:

```text
Target unit:
Benchmark profile:
Baseline result:
Highest-level failure:
Variants tested:
Variant kept:
Why it won:
What was discarded:
Next loop:
```

## Rules

- Do not overwrite the user's original input. Preserve it in `source/input.md` and snapshot it in each loop.
- Do not merge variants prematurely. Benchmark them separately first.
- Do not keep a variant because it feels nicer if it did not improve the benchmark target.
- Do not polish prose if the benchmark shows a scene, chapter, arc, or premise failure.
- Prefer a simpler successful intervention over a sprawling one with similar scores.
- Every kept change should be explainable as a benchmark improvement, not just an aesthetic preference.
