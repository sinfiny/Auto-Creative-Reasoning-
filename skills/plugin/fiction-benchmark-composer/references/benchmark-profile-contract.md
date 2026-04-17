# Benchmark Profile Contract

Write benchmark profiles in this shape:

```text
Benchmark name:
Story or project:
Preset:
Target unit:
Objective:

Control skill:
Guardrails:
Mutators:
Scoring lenses:
- skill:
  role:
  focus:
  weight:

Pass floor:
Critical fail conditions:
Rewrite routing priority:
Minimum variants:
Structural rewrite rule:

Success criteria:
- ...

Notes:
```

## Example Lens Sets

### Strategic Webserial Opening

- control skill: `creative-autoresearch-control-plane`
- guardrails:
  - `narrative-explicit-reasoning`
- mutators:
  - `narrative-auto-reasoning`
- scoring lenses:
  - `narrative-hook-hold-payoff`
  - `mystery-payoff-and-fairness-judge`
  - `strategic-webserial-architecture`

### Consequence-Heavy Reveal

- control skill: `creative-autoresearch-control-plane`
- guardrails:
  - `narrative-explicit-reasoning`
- mutators:
  - `narrative-auto-reasoning`
- scoring lenses:
  - `mystery-payoff-and-fairness-judge`
  - `narrative-epistemic-targeting`
  - `faction-power-consequence-engine`

### Intimate Subtext Scene

- control skill: `narrative-auto-reasoning`
- guardrails:
  - `narrative-explicit-reasoning`
- mutators:
  - `narrative-surgical-editing`
- scoring lenses:
  - `narrative-subtext-mapping`
  - `narrative-hook-hold-payoff`
  - `narrative-contextual-prose-density`

## Stability Rule

When comparing variants in the same loop, do not change:

- the scoring lenses
- the weights
- the pass floor

unless the loop explicitly concludes that the benchmark itself was wrong.
