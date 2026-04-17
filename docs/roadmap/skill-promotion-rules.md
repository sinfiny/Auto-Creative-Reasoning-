# Skill Promotion Rules

Use these fields in [catalog/skills.yaml](/Users/setavya/Hacks/skills/catalog/skills.yaml):

## `plugin_status`

- `entrypoint`: directly exposed as part of the plugin surface
- `benchmark_surface`: directly exposed for benchmark composition
- `internal_dependency`: used by plugin workflows but not a primary plugin entrypoint
- `library_only`: available in the repo, not wired into the plugin by default

## `loop_status`

- `default_core`: part of the default preset and expected in most runs
- `default_conditional`: part of the default preset when the failure mode applies
- `preset_only`: not part of the default preset, but active in a named preset
- `candidate`: promising, but not yet added to a shipping preset
- `off_loop`: not currently part of the fiction loop

## `validation_status`

- `unreviewed`: no meaningful loop evidence yet
- `trialing`: in use, but still needs stronger evidence
- `validated`: has enough repeatable evidence to justify its current slot

## Promotion Rule

A skill should not become `default_core` unless it has:

- a clear loop role
- low overlap with existing default skills
- repeated evidence that it improves a benchmark target
- a readable explanation of what it catches that the current loop misses
