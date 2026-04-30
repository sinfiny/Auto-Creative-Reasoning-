# System Map

This repository's creative-autoresearch stack has three layers.

## 1. Generation Layer

These skills create and reshape story material:

- `strategic-webserial-architecture`
- `faction-power-consequence-engine`
- `strategic-cast-intelligence-engine`
- `autonomous-webserial-loop`
- the narrower narrative and prose skills already present in the repo

## 2. Evaluation Layer

These judge whether the output is actually good enough:

- `mystery-payoff-and-fairness-judge`
- benchmark profiles in `runs/<story-slug>/benchmark.md`
- selected judge skills from `skills/`

## 3. Control Layer

This skill chooses:

- what to test
- what failed
- what level to rewrite
- when to stop

## Principle

Creative iteration only becomes reliable when evaluation is decomposed.

Bad pattern:

- write chapter
- "make it better"
- accept the cleanest-sounding draft

Good pattern:

- write constrained unit
- judge specific failure modes
- repair at the correct altitude
- compare deltas
- repeat
