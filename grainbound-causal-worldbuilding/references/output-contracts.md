# Output Contracts

Use these when the user asks for structured output, AI IDE rules, `CLAUDE.md` content, or a repeatable reasoning loop.

## Forward Culture Build

```xml
<reasoning>
Task:
Known constraints:
Base landscape:
Base climate:
Resource profile:
Threat profile:
Primary survival pressure:
Initial WOAC:
Generation boundary:
</reasoning>
```

```text
Survival Strategy:
Social Organization:
Value Systems:
Worldview/Religion:
Symbolic Culture:
Cultural Expressions:
Internal contradictions:
Story pressure points:
```

```xml
<self_check>
No top-down lore before base layer:
Every trait has a cause:
Consequences create new pressures:
Five forces represented:
Six-layer stack coherent:
Useful contradiction preserved:
Decorative details flagged:
</self_check>
```

## OAC/WOAC Detail Contract

Use before introducing a specific cultural detail.

```xml
<reasoning>
Detail:
Want:
Obstacle:
Action:
Consequence:
New problem created:
Layer touched:
</reasoning>
```

Then provide the detail in prose or bullet form.

## Reverse Vibe Contract

```text
Existing cool element:
Why it currently feels arbitrary:
Reverse chain:
- Consequence:
- Action:
- Obstacle:
- Want:
- Bedrock:
Forward ripples:
Five-force gaps:
Values extracted:
Contradictions:
Recommended keep/change:
```

## Species Culture Contract

```text
Species/body premise:
Functional traits:
For each trait:
- Gives:
- Costs:
- Unique experience:
- WOAC:
- Cultural layers touched:
Trait contradictions:
Power structure:
Belief/worldview:
Exchange with other species:
Legacy/memory:
Could a human culture produce this:
```

## Politics Contract

```text
Political surface:
Power centers:
Currency of power:
Hidden enforcement:
Middle layers:
WOAC loops:
Loyalty reasons:
Breaking points:
Cascade:
Story levers:
```

## Map Audit Contract

```text
Need for map:
Key locations:
Travel-time logic:
Movement cost:
Visibility:
Defensibility:
Control points:
Decisions created:
Contradictions fixed:
Map not needed if:
```

## Diagnosis Contract

```text
What feels decorative:
Missing base layer:
Broken causal chains:
Top-down lore risks:
Force gaps:
Stack gaps:
Unexploited contradictions:
Highest-leverage fix:
Next WOAC cycle:
```

## AI IDE Rule Block

Use when the user asks for `CLAUDE.md`, `AGENTS.md`, prompt rules, or automated workflow instructions.

```markdown
## Causal Worldbuilding Rules

- Do not generate government, religion, economy, class, aesthetics, or customs until landscape, climate, resource profile, and threat profile are defined.
- Before outputting any cultural detail, include a compact WOAC chain: Want, Obstacle, Action, Consequence, New Pressure.
- Generate cultures through the six-layer stack: survival, social organization, values, worldview, symbolic culture, daily expression.
- Treat biology as environment for non-human species. Treat intrinsic magic as biology, external magic as geography/resource, and partial magic access as class pressure.
- Reverse-engineer existing vibes by walking from consequence to action to obstacle to want until reaching geography, biology, magic, history, or human universal.
- After each build, run a force audit: environment, power, belief, exchange, legacy.
- Preserve value contradictions as story engines; do not flatten them into perfect coherence.
```
