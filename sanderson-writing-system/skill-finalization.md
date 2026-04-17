# Skill Finalization

This file finalizes the skills and workflows to build from the lecture series.

## Design Goal

The system must support both of these modes:

- narrow invocation for a single craft problem
- full orchestration for "follow Brandon Sanderson's methodology"

That requirement is why the suite uses component skills plus one orchestration skill.

## Final Skills

### `sanderson-professional-writing`

Why it exists:

- The lecture series starts with process, finishing, and professional posture.
- A lot of writing problems are process failures disguised as craft failures.

Trigger when:

- the writer is stalled
- the draft keeps restarting
- outlining vs discovery is the real issue
- the user needs practice structure, not prose generation

### `sanderson-promise-progress-payoff`

Why it exists:

- This is the central Sanderson plot lens and the easiest diagnostic entry point.
- It governs openings, middles, endings, and series promises.

Trigger when:

- the opening is weak
- the middle drags
- the ending feels mismatched
- a series needs a clear reader bargain

### `sanderson-story-architecture`

Why it exists:

- Promise analysis alone does not solve structural inertia.
- The lectures distinguish philosophy of plot from frameworks and progression design.

Trigger when:

- the story has no shape
- escalation is missing
- act breaks are muddy
- multiple arcs need ordering

### `sanderson-character-engine`

Why it exists:

- Sanderson treats reader attachment as adjustable levers rather than vague charisma.
- The character lectures are substantial enough to justify a standalone system.

Trigger when:

- the protagonist is passive
- supporting cast blur together
- the arc type is unclear
- the reader is not emotionally invested

### `sanderson-speculative-design`

Why it exists:

- The magic and worldbuilding lectures form one coherent design philosophy: reader legibility, consequence, and narrative relevance.
- Most speculative projects need these two domains to talk to each other.

Trigger when:

- designing powers, rules, costs, or wonder
- fixing lore dumps
- repairing setting relevance
- deciding how much the reader must understand

### `sanderson-publishing-strategy`

Why it exists:

- The business lectures are detailed enough to support real workflow decisions.
- Career path confusion can waste years even when the writing is good.

Trigger when:

- choosing indie vs traditional vs hybrid
- researching agents
- building a mailing list
- thinking through conferences, rights, or platform

### `sanderson-endings-and-revision`

Why it exists:

- Sanderson's later lectures make revision and endings into learnable systems, not mystical instincts.
- Many writers can draft a book but cannot reliably finish or revise one.

Trigger when:

- ending payoff is weak
- a full draft exists
- revision feedback is noisy
- the writer needs a revision plan instead of more drafting

### `sanderson-full-methodology`

Why it exists:

- The user specifically asked for a single entry point that can follow the complete Sanderson method.
- This skill routes to the right component sequence and enforces a full-stack order of operations.

Trigger when:

- the task is broad
- the user says "follow the full method"
- the project spans premise, plot, character, worldbuilding, revision, and career decisions

## Final Workflow Set

Keep as canonical workflows:

1. Writer Process Calibration
2. Promise Audit
3. Story Architecture Loop
4. Character Engine Design
5. Magic System Design
6. Narrative Worldbuilding Filter
7. Earth Setting Relevance Pass
8. Ending Design Loop
9. Revision Experiment Ladder
10. Agent and Publishing Path Selection
11. Mailing List and Platform Workflow
12. Full Sanderson Methodology

## Why This Split Is Better Than One Giant Skill

- It lets a student practice one concept at a time.
- It avoids overloading small tasks with the full method.
- It gives an AI a clean routing layer.
- It preserves Sanderson's actual lecture segmentation instead of flattening everything into generic writing advice.
