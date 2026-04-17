# Plugin vs Library

The plugin is not the whole repository.

## Plugin

`plugins/fiction-autoresearch/` is the user-facing entrypoint.

Its job is to:

- start or continue a loop
- compose benchmarks
- initialize project structure
- expose the simplest safe workflow for Codex users

## Library

`skills/` contains the reusable writing, judging, and revision skills.

Most of these are dependencies of the plugin workflow, not plugin entrypoints themselves.

## Rule

Do not expose every library skill directly in the plugin surface by default.

Instead:

- keep the plugin thin
- keep the library broad
- use `catalog/skills.yaml` and `loops/presets/` to decide which skills are active by default
