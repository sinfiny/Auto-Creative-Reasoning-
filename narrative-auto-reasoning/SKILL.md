---
name: narrative-auto-reasoning
description: Use when planning, drafting, revising, or diagnosing fiction with strict narrative reasoning loops, especially novels, chapters, scenes, lore-heavy stories, character motivation checks, hook/hold/payoff structure, surgical edits, and AI writing IDE workflows. Based on David Perell's writing interviews with Morgan Housel, Alain de Botton, and Steven Pressfield; intended as an editor and reasoning protocol, not a style imitation skill.
---

# Narrative Auto Reasoning

Use this skill to keep fiction work deliberate: clarify motivation before motion, use only the lore the scene needs, edit within the requested radius, and verify hook/hold/payoff before handing prose back.

## Quick Start

Use this skill for:

- Scene and chapter planning
- Prose drafting
- Character motivation checks
- Lore consistency checks
- Plot twist tradeoff analysis
- Surgical revision of existing prose
- AI writing IDE or autonomous writing-agent loops

Before substantial prose work:

- Load `references/craft-map.md` for the condensed operating model.
- Load `references/output-contracts.md` when the user needs a structured scene, chapter, twist, edit, or contradiction loop.
- Load `references/source-index.md` when the user asks where the principles came from.
- Use `$narrative-contextual-prose-density` when the scene needs a deliberate depiction/explanation detail budget.
- Use `$narrative-subtext-mapping` when dialogue or interaction depends on hidden knowledge, agenda, or emotional state.
- Use `$narrative-epistemic-targeting` when lore, backstory, reveals, or reader discovery must be filtered by a single reader insight.

## Operating Loop

Strict mode is the default unless the user explicitly opts out.

1. Identify the task type: plan, draft, revise, diagnose, continue, compress, or rewrite.
2. Extract existing constraints: characters, lore, genre, POV, timeline, tone, prior events, and forbidden changes.
3. Produce a concise `<reasoning>` block before prose. This is an editorial rationale, not hidden chain-of-thought.
4. Define success criteria using Hook, Hold, and Payoff.
5. Draft only what is needed to satisfy the scene or edit.
6. Run a `<self_check>` pass against the original success criteria.
7. If the self-check fails, revise the sequence before presenting it as final.
8. Stop and ask one precise clarification question if the emotional beat or lore state contradicts known context.

## Required Reasoning Block

Before drafting fiction, use this compact shape:

```xml
<reasoning>
Task:
Scene or edit target:
Character emotional goal:
Character outward goal:
Known lore constraints:
Genre/tone constraints:
Narrative tradeoffs:
Chosen approach:
Stop conditions:
</reasoning>
```

Rules:

- State assumptions explicitly.
- Do not invent hidden motivations when the user has already supplied canon.
- If a contradiction appears, stop instead of smoothing it over.
- If a major plot twist is requested, give 2-3 interpretations and choose one with rationale.
- Keep the rationale short enough to help the user steer the story.

## Minimum Viable Prose

- Use only the lore needed for the immediate scene.
- Do not invent new factions, systems, artifacts, mechanics, relationships, or backstory unless asked.
- Avoid philosophical exposition unless it belongs to the POV character.
- Do not pad to hit a requested length if the beat is complete.
- Prefer concrete action, sensory pressure, dialogue, and choice over explanation.
- Compress worldbuilding into consequence-bearing details.

## Cognitive Tool Layer

When the task involves autonomous scene generation, add these controls before drafting:

```xml
<cognitive_tool_layer>
Scene_Mode: depiction | explanation | hybrid
Epistemic_Goal:
Active_Unseen_State:
Detail_Budget:
Withheld_Info:
</cognitive_tool_layer>
```

Rules:

- `Scene_Mode` controls prose density: depiction for recognition and atmosphere, explanation for causal mechanics.
- `Epistemic_Goal` controls what the reader should learn or infer now.
- `Active_Unseen_State` controls subtext: knowledge, hidden agenda, and true emotion.
- `Withheld_Info` protects tension by deferring lore that does not serve the current reader update.

## Surgical Editing

- Touch only the requested component.
- If asked to alter dialogue, preserve surrounding action unless the action creates a contradiction.
- If asked to alter internal monologue, do not rewrite adjacent environmental prose.
- If asked to remove a subplot, remove dangling references while preserving the primary narrative spine.
- Preserve genre framework, progression mechanics, fanfiction-to-original transition rules, and established tropes unless explicitly asked to change them.
- Return a short change note explaining exactly what changed.

## Hook, Hold, Payoff

Before chapter or scene generation, define:

```text
Hook:
Hold:
Payoff:
Failure risk:
```

After generation, verify:

```xml
<self_check>
Hook present:
Hold escalates:
Payoff lands:
Lore preserved:
Character motive coherent:
Prose efficiency:
Revision needed:
</self_check>
```

If `Revision needed` is yes, revise before final output.

## Output Shapes

For a new scene, use:

```text
<reasoning>...</reasoning>

Scene:

<self_check>...</self_check>
```

For a chapter plan, use:

```text
Chapter job:
Hook:
Hold:
Payoff:
Character turn:
Lore used:
Scenes:
Risks:
```

For a plot twist, use:

```text
Twist request:
Existing promises:
Option A:
Option B:
Option C:
Recommended option:
Cost:
Setup needed:
Payoff path:
```

For a surgical revision, use:

```text
Edit target:
Allowed edit radius:
Must preserve:
Revised passage:
Changes made:
Remaining risks:
```

For a lore contradiction halt, use:

```text
I need clarification before drafting because:
Known context:
Contradicting request:
Decision needed:
Recommended resolution:
```

For a prose compression pass, use:

```text
Keep:
Cut:
Compress:
Revised passage:
Why it is shorter:
```

## Guardrails

- Do not imitate David Perell, Morgan Housel, Alain de Botton, Steven Pressfield, or any living author's prose voice.
- Use the source material as craft guidance only.
- Do not quote long transcript passages.
- Do not overwrite the user's story intent.
- Preserve productive ambiguity; fix confusion, not mystery.
- Prefer asking one precise question over inventing missing canon.
- Make the author feel more in control of the story, not less.
