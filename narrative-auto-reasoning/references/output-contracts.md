# Output Contracts

Use these contracts when the task needs structured control. Keep each block concise and fill only fields that matter.

## New Scene Contract

```xml
<reasoning>
Task:
POV:
Emotional goal:
Outward goal:
Known constraints:
Scene mode:
Epistemic goal:
Hidden state:
Hook:
Hold:
Payoff:
Chosen approach:
</reasoning>
```

Then draft the scene.

```xml
<self_check>
Hook present:
Escalation present:
Payoff or cliffhanger present:
No speculative lore:
Character motivation coherent:
Length efficient:
Final revision:
</self_check>
```

If `Final revision` is needed, revise before presenting the final passage.

## Chapter Plan Contract

```text
Chapter job:
Reader promise:
Opening state:
Hook:
Hold:
Payoff:
Character turn:
Lore used:
Scenes:
Exit state:
Risks:
```

Use this when the user asks for chapter generation, chapter diagnosis, or a continuation that must maintain broad momentum.

## Plot Twist Contract

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

Use this before drafting any twist that changes backstory, allegiance, magic rules, identity, death status, romance, betrayal, prophecy, or genre promise.

## Surgical Revision Contract

```text
Edit target:
Allowed edit radius:
Must preserve:
Revised passage:
Changes made:
Remaining risks:
```

Use this whenever the user asks for a targeted edit. If the requested change requires touching other passages, explain why before expanding the radius.

## Contradiction Halt Contract

```text
I need clarification before drafting because:
Known context:
Contradicting request:
Decision needed:
Recommended resolution:
```

Use this when the task asks for an emotional turn, lore fact, timeline step, relationship change, power use, or plot resolution that contradicts established context.

## Prose Compression Contract

```text
Keep:
Cut:
Compress:
Revised passage:
Why it is shorter:
```

Use this when the prose is inflated, overexplained, too abstract, too lore-heavy, or longer than the beat requires.

## Diagnosis Contract

```text
What is working:
Silent assumptions:
Lore pressure:
Character motive issues:
Hook/Hold/Payoff state:
Edit-radius risks:
Highest-leverage fix:
Next draft move:
```

Use this when the user asks what is wrong with a scene, chapter, outline, or premise.

## Cognitive Tool Contract

Use this when an autonomous writing loop must decide what to focus on before drafting.

```xml
<cognitive_tool_layer>
Scene_Mode: depiction | explanation | hybrid
Reader_Current_Model:
Epistemic_Goal:
Target_Update:
Active_Characters:
Hidden_State_Map:
Detail_Budget:
Withheld_Info:
Misread_Risk:
</cognitive_tool_layer>
```

This contract can be combined with the New Scene Contract, but keep it concise. It exists to route attention, not to create a second outline.
