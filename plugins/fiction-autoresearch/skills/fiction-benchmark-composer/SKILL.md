---
name: fiction-benchmark-composer
description: Use when defining or revising a fiction benchmark for a story, chapter, scene, reveal, confrontation, or arc by selecting evaluation lenses from the repository's skill library. Produces a reusable benchmark profile that can be applied across variants in an autoresearch loop.
---

# Fiction Benchmark Composer

Use this skill when the user wants to define the benchmark itself instead of only running against the default repository benchmark set.

This skill makes it trivial to create a custom benchmark by selecting a small set of repository skills as lenses and turning them into a reusable profile.

## When To Use

- a story needs a benchmark different from the default strategic-webserial emphasis
- the user wants to emphasize specific qualities such as subtext, clue fairness, pace, world logic, or strategic intelligence
- a loop is failing because the current benchmark is too broad or too vague
- multiple variants need to be compared against the same custom target

## Inputs

Read:

- `benchmark/starter-benchmark-set.md`
- `rubrics/leaderboard-webserial-rubric.md`
- `rubrics/rewrite-decision-ladder.md`
- `../fiction-autoresearch-loop/references/skill-lens-map.md`

Write or update:

```text
projects/<story-slug>/benchmarks/profiles/active-benchmark.md
```

## Composition Workflow

1. Define the target unit:
   - opening
   - scene
   - chapter
   - reveal
   - confrontation
   - arc scaffold
2. Define the intended outcome:
   - stronger retention
   - smarter cast behavior
   - better clue fairness
   - stronger consequence density
   - clearer prose under complexity
   - denser subtext
3. Choose one control skill.
4. Choose two to four scoring lenses.
5. Define scoring dimensions and weights.
6. Define the pass floor.
7. Define rewrite routing priorities.
8. Save the profile so later variants can be judged against the same target.

## Output Contract

Use the profile shape in `references/benchmark-profile-contract.md`.

## Rules

- Prefer the fewest skills that fully describe the benchmark.
- Do not create a benchmark that mixes contradictory success criteria without stating the tradeoff.
- If a benchmark overfits one style preference, say so explicitly.
- If the benchmark is meant to compare variants, keep it stable for the whole loop.
- Change the benchmark only when the current one is clearly mis-scoring the work.
