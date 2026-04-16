# AGENTS.md

## Purpose

This repository is a workspace for building and refining agent skills, mainly for writing, story craft, and adjacent reasoning workflows.

Agents working here should optimize for:

- small, composable skills
- honest trigger descriptions
- reusable references instead of raw cache dumps
- minimal repo noise
- benchmarked improvement over vague "make it better" loops

## Expected Skill Shape

Each committed skill should normally include:

```text
skill-name/
  SKILL.md
  agents/
    openai.yaml
```

Optional:

```text
skill-name/
  references/
    ...
```

Use `references/` for reusable notes, rubrics, contracts, and source maps. Do not use it as a dumping ground for one-off scrape output.

## Skill Writing Rules

- Keep `SKILL.md` focused on workflow, routing, rules, and output contracts.
- Put long supporting material into `references/`.
- Prefer a narrow skill with a crisp purpose over a broad vague one.
- Do not imitate living authors or copy proprietary settings. Use source works as craft benchmarks, not templates.
- If a skill coordinates other skills, make the routing logic explicit.
- For autonomous creative work, prefer explicit benchmarks, rubrics, and rewrite ladders over aesthetic intuition alone.

## Repo Hygiene

- Do not commit `.DS_Store`, local caches, `node_modules`, temporary scrape output, or downloaded videos.
- Prefer committing cleaned reference notes instead of raw Firecrawl captures.
- Keep README aligned with what is actually tracked on `main`.
- If you add a new committed skill, update the README when the new family changes the repo's shape in a meaningful way.
- If you add loop tooling, make sure it points to `benchmark/`, `rubrics/`, `loop/`, and `cases/` rather than hiding evaluation logic in prompts alone.

## Git Guidance

- This repo may contain many local-only skill folders under development. Do not add broad globs that accidentally commit all of them.
- Stage only the files relevant to the current task.
- Before pushing, inspect `git diff --name-only origin/main...HEAD` so large artifacts do not sneak into a commit.
- If a commit accidentally captures bulky local material, preserve it on a backup branch before rewriting `main`.

## Documentation Guidance

- README should describe the repo at a family or suite level, not enumerate every experimental local folder.
- `AGENTS.md` should stay operational and brief.
- Use examples when they reduce ambiguity, not just to add volume.
