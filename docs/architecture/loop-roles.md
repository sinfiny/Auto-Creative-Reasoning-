# Loop Roles

Every skill used in the autoresearch loop should have one primary role.

## Controller

Chooses:

- what to test
- what failed
- what rewrite level to use
- when to stop

Examples:

- `fiction-autoresearch-loop`
- `creative-autoresearch-control-plane`

## Judge

Scores or diagnoses output against explicit criteria.

Examples:

- `mystery-payoff-and-fairness-judge`
- `narrative-hook-hold-payoff`
- `narrative-epistemic-targeting`

## Mutator

Produces or revises the candidate output under the controller's chosen constraints.

Examples:

- `narrative-auto-reasoning`
- `narrative-minimum-viable-prose`
- `narrative-surgical-editing`

## Guardrail

Prevents bad experiments such as overcomplication, contradiction, or scope creep.

Examples:

- `narrative-explicit-reasoning`
- `narrative-surgical-editing`

## Candidate Lens

A useful skill that is not yet default.

Examples:

- `narrative-subtext-mapping`
- `narrative-contextual-prose-density`
- `grainbound-causal-worldbuilding`
