# Hypotheses vs Skills

Keep these separate.

## Hypothesis

A hypothesis is an experiment claim:

- what seems broken
- what change might improve it
- what success should look like

Hypotheses belong in `projects/<story-slug>/hypotheses/`.

## Skill

A skill is a reusable mechanism:

- controller
- judge
- mutator
- guardrail

Skills belong in `skills/` and are exposed through the plugin.

## Run Record

A loop run should connect the two:

- hypotheses consulted
- benchmark used
- recommended judges and mutators
- actual skills used
- result

This separation keeps the system legible:

- hypotheses stay exploratory
- skills stay reusable
- runs become evidence
