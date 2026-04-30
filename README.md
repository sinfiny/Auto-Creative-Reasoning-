# AutoWriter

AutoWriter Core is a small Elixir project for developing an agent loop.

## Status

The code currently does only one real thing: load a Markdown workflow file.

Task dispatch and event append are intentionally empty. Those interfaces will be
designed before they are implemented.

## Development

```bash
mix aw.run lab/workflows/simple.md
mix test
```

## Shape

```text
lib/
  Elixir orchestration code

skills/
  Declarative skills

lab/workflows/
  Small workflow files used while designing the loop
```
