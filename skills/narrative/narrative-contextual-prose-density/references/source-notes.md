# Source Notes: Contextual Prose Density

Source: Prof. Judy Fan, "Cognitive Tools for Making the Invisible Visible," MIT BCS Colloquium, co-hosted by MIT Quest for Intelligence, March 20, 2025. Video: https://www.youtube.com/watch?v=AF3XJT9YKpM

These notes translate the talk into fiction-craft controls. They are source grounding, not style targets.

## Relevant Talk Beats

- Around 00:08:18, Fan contrasts faithful visual renderings with schematic abstractions. The shared function is highlighting what is relevant to notice.
- Around 00:18:10, she describes how people draw more faithfully when they must distinguish a specific exemplar from similar alternatives, and more sparsely when category-level recognition is enough.
- Around 00:20:05, the key result is that abstraction capacity and context sensitivity are both needed to explain human communication.
- Around 00:21:01-00:28:54, the talk distinguishes visual depictions from visual explanations. Depictions support object identity; explanations emphasize mechanisms, causal parts, arrows, and motion while reducing background.
- Around 00:27:58, explanations are better for communicating how a mechanism works, while depictions are better for communicating which object it is.
- Around 00:31:05-00:36:08, production budget affects ambiguity. As the available budget shrinks, people and models abstract differently.

## Fiction Translation

Treat prose as a representational tool with a limited ink budget:

- If the reader's task is recognition, use depiction density.
- If the reader's task is mechanism, use explanation density.
- If the reader already recognizes the setting or character, shift detail toward causal change.
- If the reader cannot track who or where they are, spend enough depiction to stabilize the mental image.

## Scene ECS Mapping

Useful components for an AI writing IDE:

```text
SceneIntent: depiction | explanation | hybrid
ReaderTask: identify | understand_cause | infer_status | feel_atmosphere | track_action
DetailBudget: high | medium | low
CausalParts: actions, constraints, tools, body positions, rules, consequences
IdentityParts: silhouette, voice, status markers, setting anchors, sensory signature
BackgroundParts: atmosphere, non-causal objects, cultural texture, weather, architecture
SymbolicArrows: transitions, because/therefore links, gestures that change power
```

The writer-agent should allocate tokens to components that serve `ReaderTask`, not to whatever has the most lore attached.
