# Projects

This directory is the operational workspace for benchmarked fiction loops.

Use one folder per fiction project:

```text
projects/<story-slug>/
```

Each project should keep:

- the long-lived source input
- current character, timeline, and thread state
- reusable benchmark profiles
- a recorded history of loops and variants

## Why This Exists

The repository's intended use is not one-off prompting.

It is repeated improvement of the same fiction work through benchmarked loops. That only stays legible if the project structure records:

- what the input was
- what benchmark was used
- what variants were tried
- what improved
- what failed
- what was kept

## Initialize A New Project

From repo root:

```bash
python3 plugins/fiction-autoresearch/scripts/init_fiction_autoresearch_run.py <story-slug> --title "<story title>" --loop-id <loop-id>
```

Example:

```bash
python3 plugins/fiction-autoresearch/scripts/init_fiction_autoresearch_run.py ash-cartographer \
  --title "The Ash Cartographer" \
  --loop-id 2026-04-17-baseline
```
