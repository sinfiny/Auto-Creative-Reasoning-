# Skills Library

This folder contains the reusable skill library for the repository.

The skills are the declarative center of AutoWriter. Elixir code should stay
small and use this folder as its source of truth.

Each skill should define a narrow writing, judging, revision, or orchestration
behavior. Large supporting material belongs in that skill's `references/`
folder.

## Families

- `character/`: character-centered fiction design and transformation lenses
- `control/`: loop controllers and high-level workflow coordinators
- `plugin/`: plugin-entry skills that package the shared loop workflow for Codex users
- `strategy/`: strategic webserial structure, consequence, and intelligence skills
- `narrative/`: scene, chapter, pacing, epistemic, and prose-control skills
- `interaction/`: dialogue and interpersonal-pressure skills
- `worldbuilding/`: causal lore and setting-system skills
- `editorial/`: non-core editorial tools
- `marketing/`: persuasive commercial writing and positioning skills
- `nonfiction/`: essay, reporting, rhetoric, and audiovisual nonfiction skills
- `sanderson/`: Brandon Sanderson-derived craft suite kept together as a reusable methodology family
