# Source Notes: Epistemic Targeting

Source: Prof. Judy Fan, "Cognitive Tools for Making the Invisible Visible," MIT BCS Colloquium, co-hosted by MIT Quest for Intelligence, March 20, 2025. Video: https://www.youtube.com/watch?v=AF3XJT9YKpM

These notes translate the talk into fiction-craft controls. They are source grounding, not style targets.

## Relevant Talk Beats

- Around 00:37:07-00:39:14, Fan describes data visualization as a tool for seeing patterns too large, noisy, slow, or indirect to observe directly.
- Around 00:39:14, she emphasizes that a learned visualization can condense many observations into a single graphic that supports belief updates.
- Around 00:40:17-00:45:14, she discusses measuring graph understanding by comparing performance and error patterns, not just final answers.
- Around 00:46:13, she explicitly frames plot choice around an epistemic goal: a person has a question about a data set, and the selected plot should help shift beliefs appropriately.
- Around 00:48:27-00:50:25, participants choose among bar, line, and scatter plots. The best account is audience-sensitive: people pick visual features relevant to answering the viewer's question.
- Around 01:04:22-01:07:02, the Q&A identifies bottlenecks: the viewer may not know what part to attend to, how to relate it to an axis, or how to answer the question.

## Fiction Translation

Narrative exposition should be audience-sensitive. The audience is the reader at this exact point in the story, not the author with the full lore bible.

Before adding lore, define:

- What does the reader currently believe?
- What single belief should change?
- What evidence will cause that change?
- What would be a harmful misread?
- What can remain invisible for tension?

The passage is the "visualization" chosen for that reader update.

## Scene ECS Mapping

Useful components for an AI writing IDE:

```text
ReaderCurrentModel: likely reader beliefs before the passage
EpistemicGoal: the one question the passage answers
TargetUpdate: the desired belief change
RequiredEvidence: scene facts needed for the update
AllowedInfo: lore/backstory/entities that directly serve the update
WithheldInfo: lore/backstory/entities deferred for later tension
MisreadRisk: likely wrong inference to prevent
RepresentationForm: direct_scene | summary | dialogue | image | flashback | exposition
```

The generation loop should reject details that do not serve `EpistemicGoal` or prevent `MisreadRisk`.
