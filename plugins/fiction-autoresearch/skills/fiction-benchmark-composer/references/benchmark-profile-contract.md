# Benchmark Profile Contract

Write benchmark profiles in this shape:

```text
Benchmark name:
Story or project:
Target unit:
Objective:

Control skill:
Scoring lenses:
- skill:
  focus:
  weight:

Pass floor:
Critical fail conditions:
Rewrite routing priority:

Success criteria:
- ...

Notes:
```

## Example Lens Sets

### Strategic Webserial Opening

- control skill: `creative-autoresearch-control-plane`
- scoring lenses:
  - `narrative-hook-hold-payoff`
  - `mystery-payoff-and-fairness-judge`
  - `strategic-cast-intelligence-engine`

### Consequence-Heavy Reveal

- control skill: `creative-autoresearch-control-plane`
- scoring lenses:
  - `mystery-payoff-and-fairness-judge`
  - `narrative-epistemic-targeting`
  - `faction-power-consequence-engine`

### Intimate Subtext Scene

- control skill: `narrative-auto-reasoning`
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
