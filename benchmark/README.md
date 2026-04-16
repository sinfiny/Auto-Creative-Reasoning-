# Benchmark

This folder defines the benchmark surface for autonomous creative writing work.

The benchmark is not a leaderboard of copyrighted novels. It is a suite of task classes and evaluation targets that capture what makes strong webserial fiction addictive.

## Benchmark Classes

- `opening-chapters`
- `reveal-scenes`
- `strategic-confrontations`
- `arc-scaffolds`

## Use

For every autonomous writing run:

1. pick a benchmark class
2. pick the relevant rubric sections from `rubrics/`
3. generate or revise the target unit
4. score it
5. decide the highest-level repair
6. log the result in `loop/`

## Rules

- Keep benchmark cases abstract and original.
- Do not fill this folder with scraped novel chapters.
- Prefer short, reusable task cards over giant documents.
- Expand only when the new case type changes what the harness can test.
