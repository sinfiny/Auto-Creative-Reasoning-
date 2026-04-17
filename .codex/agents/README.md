# Project Subagents

These project-scoped custom agents support optional parallel Codex workflows for the fiction autoresearch loop.

They are intentionally narrow:

- `fiction-judge`: read-heavy scoring and benchmark comparison
- `fiction-mutator`: bounded candidate generation from one hypothesis

Use them when the parent loop wants parallel judging or parallel variant generation.
Do not use them as replacements for the main controller.

