# AutoWriter

AutoWriter is a small Elixir harness around the `skills/` library for benchmarked fiction iteration.

## Status

The repository is intentionally declarative. Elixir code only creates paragraph files, appends comment/edit events, and renders a static review page.

## Development

```bash
mix aw.skills
mix aw.init my-story --title "My Story"
mix aw.ingest runs/my-story examples/mock_novel.md
mix aw.mock runs/my-story examples/assignments/comment_all.md
mix aw.mock runs/my-story examples/assignments/edit_first_three.md
mix aw.review runs/my-story
```

Agents, prompts, assignments, paragraphs, and events are markdown files. There is no apply step yet.

The small schemas live in `schemas/`.
