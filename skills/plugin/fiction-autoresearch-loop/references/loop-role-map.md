# Loop Role Map

Use this map to decide what each skill should do inside the fiction autoresearch loop.

Do not treat every skill as a generic "make this better" tool.

## Controller

Controllers decide how the loop runs and when a run should stop.

- `fiction-autoresearch-loop`
  - plugin entrypoint
  - initializes or continues a run
  - enforces baseline -> variants -> keep/discard logging
- `creative-autoresearch-control-plane`
  - chooses the benchmark class
  - identifies the highest-level failure
  - routes the rewrite level
  - decides keep, discard, or escalate
- `fiction-benchmark-composer`
  - defines the benchmark program the loop will optimize against

## Judges

Judges score the draft against the active benchmark.

- `mystery-payoff-and-fairness-judge`
  - fairness, causality, payoff integrity
- `narrative-hook-hold-payoff`
  - retention, propulsion, changed story state
- `narrative-epistemic-targeting`
  - reader knowledge control, reveal timing, lore discipline
- `strategic-webserial-architecture`
  - promise stack, reveal order, irreversible chapter movement
- `strategic-cast-intelligence-engine`
  - actor intelligence, leverage use, countermoves
- `faction-power-consequence-engine`
  - institutions, cost, strategic pressure, exploit space
- `narrative-contextual-prose-density`
  - detail budget, explanation-vs-depiction fit
- `narrative-subtext-mapping`
  - hidden agenda, emotional pressure, subtext density
- `grainbound-causal-worldbuilding`
  - causal world logic, institutional pressure, anti-vibes worldbuilding

## Guardrails

Guardrails prevent the loop from solving the wrong problem.

- `narrative-explicit-reasoning`
  - isolate assumptions before rewriting
  - catch contradiction, missing logic, false diagnosis

Guardrails are not the main score target unless the benchmark specifically cares about them.

## Mutators

Mutators generate the candidate changes.

- `narrative-auto-reasoning`
  - general scene/chapter rewrite engine
- `narrative-minimum-viable-prose`
  - compression, anti-bloat, cleaner surface when prose is actually the problem
- `narrative-surgical-editing`
  - bounded local edits for tightly scoped experiments
- `sanderson-promise-progress-payoff`
  - repair promise mismatch and story motion
- `sanderson-story-architecture`
  - redesign section jobs, escalation, try-fail cycles
- `sanderson-character-engine`
  - redesign protagonist pressure, arc, cast differentiation
- `sanderson-speculative-design`
  - rebuild world/system logic when speculative pressure is broken
- `sanderson-endings-and-revision`
  - design ending-supporting revision passes

## Role Rule

The loop should normally proceed in this order:

1. controller chooses the benchmark and rewrite level
2. judges score the baseline
3. guardrails check the diagnosis
4. mutators create one candidate per assumption
5. judges rescore each candidate
6. controller keeps, discards, or escalates

If a skill's role is unclear, check `catalog/skills.yaml`.
