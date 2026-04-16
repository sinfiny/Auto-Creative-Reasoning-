# Source Index

Use these sources as craft references only. Do not imitate the speakers' prose, rhetorical style, or persona.

## Transcript Pass

English captions were fetched with `yt-dlp`, cleaned in `/tmp`, and used to derive the component skill notes. Full transcripts are intentionally not bundled.

Cleaned transcript word counts from the implementation pass:

| Video ID | Words |
|---|---:|
| `o84GXnrHdgg` | 27,537 |
| `LInND2d6dtA` | 16,571 |
| `KU5FUqbqMK0` | 12,155 |
| `F9DtH-tVQUI` | 15,352 |
| Total | 71,615 |

The component skills carry their own compact transcript-derived notes:

- `$narrative-explicit-reasoning`: assumptions, point, reader attention, reader empathy.
- `$narrative-minimum-viable-prose`: concrete emotion, attention, anti-generic prose, compression.
- `$narrative-surgical-editing`: edit radius, reader point of view, component preservation.
- `$narrative-hook-hold-payoff`: inciting incident, midpoint, all-is-lost, epiphany, stakes, scene cards.

## Sources

| Source | Video | URL | Used For |
|---|---|---|---|
| Morgan Housel interview | How to Write Insanely Well | https://www.youtube.com/watch?v=o84GXnrHdgg | Explicit assumptions, clear thinking, narrative restraint |
| Alain de Botton interview | How to Write Something Truly Beautiful | https://www.youtube.com/watch?v=LInND2d6dtA | Emotional honesty, observation, beauty, avoiding generic AI prose |
| Steven Pressfield interview | 21 Proven Methods for Writing Great Stories | https://www.youtube.com/watch?v=KU5FUqbqMK0 | Structure, scene function, precise story components |
| Steven Pressfield interview | How to Write Absurdly Good Stories | https://www.youtube.com/watch?v=F9DtH-tVQUI | Hook/hold/payoff, rough drafting, editing discipline |
| Judy Fan colloquium | Cognitive Tools for Making the Invisible Visible | https://www.youtube.com/watch?v=AF3XJT9YKpM | Goal-sensitive abstraction, depiction vs. mechanism, subtext as hidden state, reader epistemic goals |

## Notes

- The original Alain de Botton URL in the planning prompt used `kYJ3hOONK4Y`, which `yt-dlp` reported as unavailable.
- The matching available video was identified as `LInND2d6dtA`.
- Full transcripts are intentionally not bundled. Use `yt-dlp` only when a task needs fresh source verification or timestamp-level context.

## Optional Caption Fetch

```bash
yt-dlp --skip-download --write-subs --write-auto-subs --sub-langs 'en.*' --sub-format 'vtt' \
  -o '/tmp/perell-skill/%(id)s.%(ext)s' \
  'https://www.youtube.com/watch?v=o84GXnrHdgg' \
  'https://www.youtube.com/watch?v=LInND2d6dtA' \
  'https://www.youtube.com/watch?v=KU5FUqbqMK0' \
  'https://www.youtube.com/watch?v=F9DtH-tVQUI' \
  'https://www.youtube.com/watch?v=AF3XJT9YKpM'
```

## Condensed Source Notes

### Morgan Housel Interview

Operational use:

- Treat clear writing as evidence of clear thinking.
- Make assumptions visible before relying on them.
- Prefer plain, memorable causal chains over decorative complexity.
- Do not confuse a clever sentence with a sound story decision.

Agent implication:

- Before drafting, state why the character acts and which known facts justify it.
- When motivation is missing, ask or mark the assumption.

### Alain de Botton Interview

Operational use:

- Beauty comes from attention, specificity, and emotional honesty.
- Generic writing often avoids the writer's real feeling.
- Observation matters more than ornament.
- Abstraction should emerge from lived detail, not replace it.

Agent implication:

- Use concrete sensory and emotional evidence.
- Avoid generic "beautiful" prose that could belong to any story.
- Do not let AI fluency smother the author's stranger, truer intent.

### Steven Pressfield: 21 Proven Methods

Operational use:

- Stories need working components: inciting incident, mystery, midpoint pressure, all-is-lost pressure, epiphany, opposing worldview, and genre expectation.
- A scene or beat should have a structural job.
- Genre conventions are tools, not embarrassments.

Agent implication:

- When revising, preserve the component the user did not ask to change.
- When diagnosing, ask which structural job is missing before adding prose.

### Steven Pressfield: Absurdly Good Stories

Operational use:

- Rough drafts are allowed to be imperfect, but they need a target.
- Editing should clarify the story's motion and pressure.
- Hook, escalation, and payoff keep prose from drifting.

Agent implication:

- Define Hook, Hold, and Payoff before drafting.
- Self-check after drafting; revise before presenting if the target was missed.

### Judy Fan Colloquium

Operational use:

- Treat prose as a cognitive tool that highlights what is relevant to notice.
- Choose depiction when the reader needs identity, atmosphere, or recognition.
- Choose explanation when the reader needs causal mechanism, action, or plot logic.
- Make invisible state explicit during planning: knowledge, agenda, emotion, reader belief.
- Define the reader's epistemic goal before adding lore or backstory.
- Filter detail by the viewer/reader question, not by what the author or context window knows.

Agent implication:

- Add a cognitive tool layer to autonomous scene generation.
- Allocate token budget by scene mode.
- Keep subtext in hidden planning variables and surface it indirectly.
- Introduce only the story information needed to update the reader's current mental model.
