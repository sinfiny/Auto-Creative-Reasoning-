# Fiction Autoresearch Plugin

This plugin turns the repository's benchmark-first fiction workflow into a simple Codex entry point.

It is designed for:

- starting a loop from an existing piece of fiction
- defining or revising a benchmark profile
- recording every loop as a reusable project artifact
- comparing assumption-driven variants instead of revising blindly

Use [catalog/skills.yaml](/Users/setavya/Hacks/skills/catalog/skills.yaml) to see which library skills are default, conditional, preset-only, or still candidates, and [loops/presets/](/Users/setavya/Hacks/skills/loops/presets/default-webserial.yaml) to see the current shipping loop shapes.

## Included Skills

- `fiction-autoresearch-loop`
- `fiction-benchmark-composer`

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

## Project Structure

The plugin expects fiction loop work to live under `projects/<story-slug>/`.

Use the included initializer:

```bash
python3 plugins/fiction-autoresearch/scripts/init_fiction_autoresearch_run.py my-story \
  --title "My Story" \
  --loop-id 2026-04-17-baseline
```

That creates a baseline input, benchmark profile, loop folder, and variant logging structure.
