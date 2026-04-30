# Comment Event Schema

A comment event records one agent's read-only analysis of one paragraph.

Stored comment events live at:

```text
runs/<run>/events/<event-id>.md
```

Shape:

```markdown
---
id: <event-id>
type: comment
run_id: <run>
paragraph_id: p0001
paragraph_index: 1
agent: agents/example.md
skill: skills/example/example-skill/SKILL.md
prompt: prompts/comment.md
assignment: comment-all
created_at: <iso8601>
---

## Comment

Agent analysis goes here.
```
