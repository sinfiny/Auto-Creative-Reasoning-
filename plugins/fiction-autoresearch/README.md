# Fiction Autoresearch Plugin

This plugin turns the repository's benchmark-first fiction workflow into a simple Codex entry point.

It is designed for:

- starting a loop from an existing piece of fiction
- defining or revising a benchmark profile
- gathering reusable hypotheses separately from the benchmark and the runs
- recording every loop as a reusable project artifact
- comparing assumption-driven variants instead of revising blindly
- assigning explicit skill roles so judges, mutators, controllers, and guardrails are not mixed together

Use [catalog/skills.yaml](/Users/setavya/Hacks/skills/catalog/skills.yaml) to see which library skills are default, conditional, preset-only, or still candidates, and [loops/presets/](/Users/setavya/Hacks/skills/loops/presets/default-webserial.yaml) to see the current shipping loop shapes.

## Included Skills

- `fiction-autoresearch-loop`
- `fiction-benchmark-composer`
- the shared `skills/` library, including judges, mutators, guardrails, and presets used by the loop

## Core Idea

This plugin translates two main inspirations into fiction work:

- `karpathy/autoresearch`: baseline, evaluate, try a change, keep or discard, log everything
- `forrestchang/andrej-karpathy-skills`: think before coding, keep it simple, make surgical changes, define success criteria

The fiction equivalent is:

1. Input a draft.
2. Benchmark it from multiple lenses.
3. Generate variants that each test a specific assumption.
4. Benchmark again.
5. Keep the variant only if it improved the intended target.

The benchmark file is the program for the run.
If the benchmark is vague, the loop will collapse into shallow editing.

## Project Structure

The plugin expects fiction loop work to live under `projects/<story-slug>/`.

Use the included initializer:

```bash
python3 plugins/fiction-autoresearch/scripts/init_fiction_autoresearch_run.py my-story \
  --title "My Story" \
  --loop-id 2026-04-17-baseline \
  --preset default-webserial
```

That creates:

- a baseline input workspace
- a hypothesis workspace with backlog and templates
- a prefilled benchmark profile based on the selected preset
- a loop plan with required judges, guardrails, mutators, and minimum variants
- baseline and variant logging files

## Presets

The initializer currently supports:

- `default-webserial`
- `reveal-repair`
- `interaction-heavy`
- `worldbuilding-pressure`

## Skill Roles

The plugin expects repo skills to play one of four roles:

- `controller`
- `judge`
- `mutator`
- `guardrail`

See [loop-role-map.md](/Users/setavya/Hacks/skills/skills/plugin/fiction-autoresearch-loop/references/loop-role-map.md) and [catalog/skills.yaml](/Users/setavya/Hacks/skills/catalog/skills.yaml) for the current role assignments.

## Hypotheses

Hypotheses are not skills.

Use `projects/<story-slug>/hypotheses/` to gather experiment ideas such as:

- what you think is broken
- what change might fix it
- which judges should measure success
- which mutators are likely to test it

Then let each loop record:

- which hypotheses were consulted
- which skills were actually used
- whether the run succeeded

## Optional Subagents

Project-scoped Codex subagent configs live under [.codex/agents/](/Users/setavya/Hacks/skills/.codex/agents/README.md).

They are optional helpers for:

- parallel judging with `fiction-judge`
- parallel variant generation with `fiction-mutator`

The parent loop should still own benchmark choice, rewrite-level choice, and final keep/discard decisions.
