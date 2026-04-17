# Fanfic To Original System Spec

## Working Title

Originalization Studio

## What We Should Copy From `malus.sh`

Not the legal posture.

What is useful is the product shape:

1. intake
2. structured analysis
3. separation between analysis and rewrite
4. explicit artifact handoff
5. audit trail
6. clear deliverable package

For this repo, the safer and more valuable version is:

"help an author transform their own fanfiction into a publishable original work."

That means the system is not for hiding provenance or laundering someone else's text. It is for helping the author identify what is franchise-dependent, rebuild what must become original, and then iterate until the new work can stand on its own.

## Product Thesis

The product is not "AI rewrites your fanfic."

The product is a guided transformation pipeline with evaluation:

- extract the work's emotional and structural strengths
- identify all franchise-dependent load-bearing elements
- generate a replacement specification
- rebuild characters, setting, and power logic into original forms
- revise until the manuscript clears a publishability bar
- package the result for indie, traditional, or hybrid submission

That fits the repo's existing thesis that the evaluator is the product.

## User Promise

Input:

- the author's fanfic draft
- optional fandom metadata
- optional target market and publishing goal

Output:

- an originality dossier
- a transformation plan
- a rewritten opening or sample package
- a publishability report
- a path recommendation for indie, traditional, or hybrid release

## Safe Positioning

The public framing should be:

- "Turn your fanfic-shaped craft into an original book."
- "Keep the engine, replace the IP dependence."
- "Move from fandom proof-of-concept to market-ready original fiction."

Avoid framing it as:

- "beat copyright"
- "launder derivative work"
- "make fanfic legal"

This is a writing and transformation tool, not a legal shield. Any eventual product should say that clearly.

## System Architecture

### 1. Intake Layer

Collect:

- manuscript or chapter upload
- source platform and URL if applicable
- author confirmation that they wrote the source text
- target format: serial, novel, novella
- target path: indie, traditional, hybrid
- target readership: progression fantasy, romantasy, mystery, etc.

Repo hooks:

- `bots/` extraction and metadata normalization
- `sanderson-publishing-strategy`

### 2. Dependency Extraction Layer

Goal:

Separate what is original in the draft from what depends on canon.

Detect:

- fandom tags
- named IP entities
- canon-specific settings
- canon power systems
- canon relationship structures
- canon plot scaffolding the story is leaning on

Outputs:

- franchise dependency map
- originality surface gap
- transformation load estimate

Repo hooks:

- `bots/` ingestion
- `narrative-epistemic-targeting`
- `narrative-subtext-mapping`

### 3. Transformation Spec Layer

This is the most important artifact.

It should answer:

- what emotional core must be preserved?
- what audience fantasy is the author actually delivering?
- which elements must be replaced completely?
- which can be abstracted and generalized?
- what new world logic is required so the story still works without canon?

Outputs:

- promise stack
- preserve / replace / invent / cut grid
- renamed cast strategy
- rebuilt world premise
- rebuilt power logic
- rebuilt conflict spine

Repo hooks:

- `sanderson-story-architecture`
- `sanderson-character-engine`
- `sanderson-speculative-design`
- `grainbound-causal-worldbuilding`

### 4. Independent Rewrite Layer

Use the transformation spec as the only allowed input for rewriting passes.

That separation matters because the product should not merely do find-and-replace on fandom nouns. It should force a true rebuild of story function.

Outputs:

- fresh synopsis
- chapter-one rewrite
- sample chapters
- series bible if serial

Repo hooks:

- `narrative-surgical-editing`
- `prose-clarity-cadence`
- `narrative-minimum-viable-prose`

### 5. Evaluation Layer

The repo's core advantage is here.

Judge the rewritten work on:

- remaining canon dependence
- structural integrity after replacement
- reader promise clarity
- character distinctiveness
- consequence density
- hook strength
- market readability
- publishability by path

Stop the loop only when the work is no longer "fanfic with the serial numbers filed off" and instead reads like an original project with its own premise engine.

Repo hooks:

- `creative-autoresearch-control-plane`
- `autonomous-webserial-loop`
- `narrative-hook-hold-payoff`

### 6. Delivery Layer

Deliverables should differ by customer intent.

For discovery users:

- originality dossier
- transformation roadmap

For active manuscript users:

- rewritten sample
- synopsis
- pitch paragraph
- comp-positioning note

For ready-to-publish users:

- query package or indie package
- publishing path recommendation
- asset checklist

Repo hooks:

- `sanderson-publishing-strategy`
- `online-writing-idea-finder`

## Core Internal Artifact

Every run should produce an `originalization dossier`.

Suggested contract:

```text
Source type:
Author attestation:
Project type:
Career goal:
Audience target:
Fanfic strengths worth preserving:
Canon-dependent elements:
Transformation load:
Preserve:
Replace:
Invent:
Cut:
New premise:
New character engine:
New world / system logic:
Opening rewrite target:
Evaluation rubric:
Publishing path:
Next action:
```

## Best Initial Wedge

Start narrow.

Recommended first wedge:

- self-authored English-language fanfic
- chapter-based fiction
- strongest for progression fantasy, romantasy, thriller, or mystery
- deliverable is a transformed opening package, not a full novel rewrite

Why this wedge:

- the repo already thinks in chapter loops
- the evaluation system is stronger on serial units than entire-book polish
- authors can feel value quickly from "your opening now works as original fiction"
- publishability can be tested on queries, sample chapters, and beta response before full-book automation

## Concrete Build Plan In This Repo

### Phase 1

Build an analysis-only backend path:

- ingest fanfic from `bots/`
- normalize story metadata
- emit originality dossier JSON
- do not auto-rewrite yet

Success condition:

- dossier catches obvious canon dependence and produces a credible transformation plan

### Phase 2

Attach skill orchestration:

- architecture rebuild
- character rebuild
- world rebuild
- opening rewrite
- evaluation loop

Success condition:

- transformed opening beats the original on a publishability rubric without losing the core audience fantasy

### Phase 3

Add packaging:

- query letter
- synopsis
- indie positioning
- comp note
- title direction

Success condition:

- a user can leave with a submission-ready sample package

## What To Build First

The next real step is not a full app.

It is a backend contract that turns extracted stories into a structured originalization dossier. Once that artifact exists, the skills and rewrite loops have a clean target and the future UI becomes much easier to design.
