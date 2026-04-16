# Source Index

Use these sources as methodology references only. Do not imitate Tony or The Grainbound's prose, rhetoric, examples, or persona.

## Caption Pass

English captions were fetched with `yt-dlp` from The Grainbound YouTube channel and cleaned in `/tmp`. The pass covered 15 videos, about 25.3k cleaned words. Full transcripts are intentionally not bundled.

```bash
yt-dlp --write-auto-subs --write-subs --sub-langs 'en.*' --sub-format vtt --skip-download \
  -o '/tmp/grainbound-subs/%(playlist_index)02d-%(id)s-%(title).120B.%(ext)s' \
  'https://www.youtube.com/@TheGrainbound/videos'
```

## Sources Used

| Video | URL | Used For |
|---|---|---|
| Find Your Worldbuilding Type and Finally Get Unstuck | https://www.youtube.com/watch?v=c2MJoTYjOpI | WOAC as a neutral entry-point loop, visual/theme/research diagnosis |
| Are Your Fantasy Races Just Humans With Costumes? | https://www.youtube.com/watch?v=oZYbnvDfDA0 | Biology as environment, species trait workflow, magic-as-body/resource split |
| I Stopped Designing Cultures. This is why. | https://www.youtube.com/watch?v=wjHb_YJUQGs | Base-layer environmental protocol, six-layer stack, reverse gift-giving example |
| The King's Fatal Mistake: Adding A Middle Class | https://www.youtube.com/watch?v=7whHXsOO9_Y | Slow wealth vs portable wealth, economic transition, charter leverage |
| Every Political System in History Runs on This One Engine | https://www.youtube.com/watch?v=ikAKQjK-YT4 | Power centers, currency of power, hidden enforcement, non-feudal politics |
| Fix Your Fantasy Cultures | https://www.youtube.com/watch?v=zX2bJABEAiQ | Shallow reverse, deep reverse, bedrock causes, force audit, value extraction |
| The 5 Forces That Make Cultures Believable | https://www.youtube.com/watch?v=yhthgAf3I34 | Five forces, recursive WOAC, six layers as generated outputs |
| The Problem With One-Dimensional Political Characters | https://www.youtube.com/watch?v=AIFi8OnN5oU | Political actors as layered conflict engines |
| 7 Strategies Houses Use to Control Vassals | https://www.youtube.com/watch?v=907MoXWl464 | Vassal control tools and dependency management |
| Your Fantasy Politics Need This Middle Layer | https://www.youtube.com/watch?v=56OgvPJIi5s | Middle-layer politics, loyalty types, cascade failures |
| Your Fantasy Society is Too Fair (Make It Rigged) | https://www.youtube.com/watch?v=3VuLWiCVyzM | Structural unfairness, rigged systems, pressure from privilege |
| Stop Drawing Maps. Start Building Worlds. | https://www.youtube.com/watch?v=aq6CS3DbkaA | Map necessity, geography as obstacle, route and territory logic |
| Your Fantasy Politics Aren't Boring - They're Built Wrong | https://www.youtube.com/watch?v=f02TCEsYugM | Political conflict as competing power loops |
| Your Worldbuilding Cultures Are Disconnected | https://www.youtube.com/watch?v=cqwyZvALw_w | Reverse causality for arbitrary cultural elements |
| Your Fantasy Worldbuilding Feels Boring? Here's The Fix! | https://www.youtube.com/watch?v=yJkywijQMEk | Human behavior loop, faction wants, obstacles, actions |

## Condensed Source Notes

### WOAC Is The Engine

The repeated method is a loop: a person or group wants something, hits a blocker, acts, and creates a consequence. The consequence becomes the next pressure. Use this to generate culture, politics, religion, economy, and faction conflict.

Agent rule:

- Do not output lore as a list of facts. Output a causal chain that can continue.

### Culture Starts From Pressure

The channel repeatedly frames culture as built upward from ground, weather, resources, threats, and body constraints. Landscape and climate are not background decoration; they define what survival requires and what institutions become useful.

Agent rule:

- Establish terrain, climate, resource cycle, and threat profile before government, religion, art, or etiquette.

### The Six Layers Are Outputs

Survival strategy, coordination, values, worldview, symbolic culture, and daily expression should be generated from prior pressures. These are not independent categories to fill.

Agent rule:

- If a symbolic or daily detail cannot trace back to survival, coordination, power, belief, exchange, or legacy, mark it as decorative and reverse-engineer it.

### Reverse Causality Repairs Vibes

Existing aesthetics can be saved by reversing from consequence to action to obstacle to want, then returning forward with "if true, what else must be true?"

Agent rule:

- Keep the user's cool idea when possible. Make it inevitable by finding its bedrock cause and ripple effects.

### The Five Forces Interlock

Environment, power, belief, exchange, and legacy are active pressures that cross-trigger each other. A drought can create wells, wells create control points, control points create authority, authority needs legitimacy, and legitimacy produces ritual.

Agent rule:

- After any build, audit all five forces. Missing forces are not always fatal, but they are pressure gaps to name.

### Bodies Are Environments

For species design, sensory range, lifespan, reproduction, body maintenance, diet, communication mode, and intrinsic magic should generate social structures. A non-human culture should contain details humans would not have produced in the same way.

Agent rule:

- Ask what the body gives, costs, and uniquely makes experienced before inventing species values or gods.

### Politics Is Power Currency

Political systems differ in visible currency: land, votes, reputation, trade routes, divine legitimacy, debt, or magic. Underneath, they depend on enforcement, dependency, or credible threat.

Agent rule:

- Name power centers and currency before naming institutions. Add middle layers with conditional loyalty and breaking points.

### Maps Need A Job

A map is useful when geography creates meaningful decisions: journey cost, supply, borders, route control, territorial conflict, or continuity. Otherwise, it can become decorative procrastination.

Agent rule:

- Ask what decisions the map creates before drawing or elaborating it.
