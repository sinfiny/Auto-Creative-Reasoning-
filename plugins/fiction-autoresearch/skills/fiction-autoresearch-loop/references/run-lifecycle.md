# Run Lifecycle

This plugin treats each fiction loop like an experiment run, not an informal editing session.

## Lifecycle

1. Capture the input.
2. Define or load the active benchmark.
3. Benchmark the baseline draft.
4. Name the highest-level failure.
5. Generate variants that each test one assumption.
6. Benchmark each variant again.
7. Keep or discard based on the intended target.
8. Record the decision and the next best loop.

## Baseline Rule

The first benchmark report is the baseline.

Do not skip it.

Without a baseline, later deltas become storytelling about improvement instead of evidence of improvement.

## Variant Rule

Each variant should have a single sentence assumption:

```text
This variant assumes the chapter improves if...
```

Good examples:

- the protagonist makes the costly choice on page one
- the ally's deception is seeded earlier
- the scene is rewritten at the chapter level instead of at the prose level
- the benchmark should prioritize strategic intelligence over atmosphere

## Decision Rule

Each variant ends with one of:

- `keep`
- `discard`
- `escalate rewrite level`
- `change benchmark and retry`

## Summary Rule

Every loop summary should let a later agent answer:

- what was the starting draft
- what benchmark was used
- what variants were tried
- which one won
- what still failed
- what should happen next
