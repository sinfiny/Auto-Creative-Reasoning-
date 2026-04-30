# Edit Event Schema

An edit event records one suggested transformation of one paragraph. It does not apply the change.

Stored edit events live at:

```text
runs/<run>/events/<event-id>.md
```

Shape:

```markdown
---
id: <event-id>
type: edit
run_id: <run>
paragraph_id: p0001
paragraph_index: 1
agent: agents/example.md
skill: skills/example/example-skill/SKILL.md
prompt: prompts/edit.md
assignment: edit-first-three
edit_kind: replacement | rearrangement | mixed | unchanged
created_at: <iso8601>
---

## Analysis

Why this edit is being suggested.

## Original

Original paragraph text.

## Suggested

Suggested paragraph text.
```

Diff display is derived from `Original` and `Suggested` at render time.
The current diff marks:

- removed words
- added words
- moved-from words
- moved-to words
