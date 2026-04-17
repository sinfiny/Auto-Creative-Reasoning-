#!/usr/bin/env python3
"""Initialize a recorded fiction autoresearch project and loop structure."""

from __future__ import annotations

import argparse
import re
from pathlib import Path

PRESETS = {
    "default-webserial": {
        "objective": "Improve chapter-level retention, reveal control, strategic movement, and causal payoff.",
        "control_skill": "creative-autoresearch-control-plane",
        "guardrails": ["narrative-explicit-reasoning"],
        "mutators": [
            "narrative-auto-reasoning",
            "narrative-minimum-viable-prose",
            "narrative-surgical-editing",
            "sanderson-promise-progress-payoff",
            "sanderson-story-architecture",
            "sanderson-character-engine",
        ],
        "scoring_lenses": [
            ("mystery-payoff-and-fairness-judge", "fairness, causal payoff, consequence density", 0.30),
            ("narrative-hook-hold-payoff", "retention, scene pressure, changed story state", 0.25),
            ("narrative-epistemic-targeting", "reader knowledge control and reveal timing", 0.20),
            ("strategic-webserial-architecture", "promise stack, reveal order, irreversible movement", 0.25),
        ],
        "pass_floor": "At least 7/10 on every core lens and no critical fail.",
        "critical_fail_conditions": [
            "The chapter mainly smooths prose while the diagnosed structural failure remains.",
            "The winning variant weakens story movement or reveal clarity.",
        ],
        "rewrite_routing_priority": "premise -> arc -> chapter -> scene -> prose",
        "minimum_variants": 3,
        "structural_rule": "If the highest-level failure is scene or above, at least one variant must change structure, ordering, or pressure rather than only prose.",
    },
    "reveal-repair": {
        "objective": "Repair reveal timing, clue fairness, and consequence after the reveal lands.",
        "control_skill": "creative-autoresearch-control-plane",
        "guardrails": ["narrative-explicit-reasoning"],
        "mutators": ["narrative-auto-reasoning", "sanderson-story-architecture"],
        "scoring_lenses": [
            ("mystery-payoff-and-fairness-judge", "fairness and payoff integrity", 0.40),
            ("narrative-epistemic-targeting", "knowledge control and meaning shift", 0.35),
            ("strategic-webserial-architecture", "reveal order and irreversible chapter effect", 0.25),
        ],
        "pass_floor": "No fairness collapse and clear post-reveal consequence improvement.",
        "critical_fail_conditions": [
            "The reveal becomes clearer but less fair.",
            "The chapter explains more but changes less.",
        ],
        "rewrite_routing_priority": "chapter -> scene -> prose",
        "minimum_variants": 3,
        "structural_rule": "At least one variant must alter reveal order, seeding, or consequence framing.",
    },
    "interaction-heavy": {
        "objective": "Improve subtext, emotional pressure, and interaction-level propulsion.",
        "control_skill": "creative-autoresearch-control-plane",
        "guardrails": ["narrative-explicit-reasoning"],
        "mutators": ["narrative-auto-reasoning", "narrative-surgical-editing", "sanderson-character-engine"],
        "scoring_lenses": [
            ("narrative-hook-hold-payoff", "interaction pressure and scene movement", 0.30),
            ("narrative-subtext-mapping", "hidden agenda and emotional charge", 0.40),
            ("narrative-contextual-prose-density", "surface clarity under charged dialogue", 0.30),
        ],
        "pass_floor": "Subtext and interaction pressure improve without a readability collapse.",
        "critical_fail_conditions": [
            "Dialogue gets cleaner but flatter.",
            "Subtext becomes explicit explanation.",
        ],
        "rewrite_routing_priority": "scene -> prose",
        "minimum_variants": 3,
        "structural_rule": "At least one variant must change the interaction's goal, leverage, or hidden agenda.",
    },
    "worldbuilding-pressure": {
        "objective": "Strengthen causal world logic, institutional pressure, and strategic consequence.",
        "control_skill": "creative-autoresearch-control-plane",
        "guardrails": ["narrative-explicit-reasoning"],
        "mutators": ["narrative-auto-reasoning", "sanderson-speculative-design", "sanderson-story-architecture"],
        "scoring_lenses": [
            ("strategic-webserial-architecture", "story movement under setting pressure", 0.25),
            ("faction-power-consequence-engine", "cost, institution, exploit space, consequence", 0.35),
            ("grainbound-causal-worldbuilding", "causal world logic and anti-vibes coherence", 0.40),
        ],
        "pass_floor": "World detail must create clearer pressure, cost, or decision space.",
        "critical_fail_conditions": [
            "The setting becomes richer but less consequential.",
            "The variant adds lore without changing behavior or stakes.",
        ],
        "rewrite_routing_priority": "premise -> arc -> chapter -> scene",
        "minimum_variants": 3,
        "structural_rule": "At least one variant must change the institution, rule, or cost structure rather than only descriptions.",
    },
}


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-{2,}", "-", value).strip("-")
    if not value:
        raise ValueError("Expected at least one letter or digit for a slug.")
    return value


def write_file(path: Path, content: str, force: bool) -> None:
    if path.exists() and not force:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create a benchmark-first fiction autoresearch project structure."
    )
    parser.add_argument("story_slug", help="Story slug, e.g. ash-cartographer")
    parser.add_argument("--title", required=True, help="Human-readable story title")
    parser.add_argument("--loop-id", required=True, help="Loop identifier, e.g. 2026-04-17-baseline")
    parser.add_argument(
        "--preset",
        default="default-webserial",
        choices=sorted(PRESETS.keys()),
        help="Loop preset to prefill the benchmark and loop plan",
    )
    parser.add_argument(
        "--benchmark-name",
        default=None,
        help="Benchmark profile name",
    )
    parser.add_argument(
        "--variant-id",
        default="v1-first-assumption",
        help="Starter variant folder name",
    )
    parser.add_argument("--force", action="store_true", help="Overwrite existing files")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    story_slug = slugify(args.story_slug)
    loop_id = slugify(args.loop_id)
    variant_id = slugify(args.variant_id)
    preset_name = args.preset
    preset = PRESETS[preset_name]
    benchmark_name = slugify(args.benchmark_name or preset_name)

    project_root = Path.cwd() / "projects" / story_slug
    loop_root = project_root / "loops" / loop_id
    variant_root = loop_root / "variants" / variant_id

    write_file(
        project_root / "README.md",
        f"""# {args.title}

This project stores one fiction work and its benchmarked improvement history.

## Core Rule

Do not treat the draft as a single linear rewrite stream.

Use loops to test assumptions, benchmark variants, and keep only improvements that win on the intended target.

## Default Preset

`{preset_name}`
""",
        args.force,
    )

    write_file(
        project_root / "source" / "input.md",
        f"""# {args.title} Input

Paste or move the current fiction unit here.

This file is the long-lived source input.
Loop-specific snapshots belong under `loops/{loop_id}/baseline/`.
""",
        args.force,
    )

    write_file(
        project_root / "hypotheses" / "README.md",
        """# Hypotheses

This folder is the experiment backlog for the project.

Keep hypotheses separate from skills.

A hypothesis states what change might improve the fiction and which skill roles are recommended.
The run artifacts should later record which skills were actually used and whether the hypothesis worked.
""",
        args.force,
    )
    write_file(
        project_root / "hypotheses" / "backlog.md",
        """# Hypothesis Backlog

Track candidate experiments here before they become loop variants.

Suggested columns:

- hypothesis id
- target unit
- diagnosed failure
- target metric
- recommended judges
- recommended mutators
- status
""",
        args.force,
    )
    write_file(
        project_root / "hypotheses" / "templates" / "hypothesis-template.md",
        """# Hypothesis

Hypothesis id:
Target unit:
Current failure:
Target metric:

Hypothesis statement:

Recommended judges:
- ...

Recommended mutators:
- ...

Recommended guardrails:
- ...

Pass condition:
- ...

Notes:
""",
        args.force,
    )

    write_file(
        project_root / "state" / "characters.md",
        "# Character State\n\nTrack motivations, secrets, relationships, and active pressures here.\n",
        args.force,
    )
    write_file(
        project_root / "state" / "timeline.md",
        "# Timeline State\n\nTrack event order, reveal order, and irreversible changes here.\n",
        args.force,
    )
    write_file(
        project_root / "state" / "threads.md",
        "# Active Threads\n\nTrack questions, promises, payoffs, and unresolved pressures here.\n",
        args.force,
    )

    write_file(
        project_root / "benchmarks" / "README.md",
        """# Benchmark Profiles

Store reusable benchmark profiles here.

Each profile should define:

- preset
- target unit
- objective
- control skill
- guardrails
- mutators
- scoring lenses
- weights
- pass floor
- rewrite routing priority
""",
        args.force,
    )

    scoring_lens_lines = "\n".join(
        [
            f"- skill: {skill}\n  role: judge\n  focus: {focus}\n  weight: {weight:.2f}"
            for skill, focus, weight in preset["scoring_lenses"]
        ]
    )
    critical_fail_lines = "\n".join(f"- {item}" for item in preset["critical_fail_conditions"])
    guardrail_lines = "\n".join(f"- {item}" for item in preset["guardrails"])
    mutator_lines = "\n".join(f"- {item}" for item in preset["mutators"])

    write_file(
        project_root / "benchmarks" / "profiles" / "active-benchmark.md",
        f"""Benchmark name: {benchmark_name}
Story or project: {args.title}
Preset: {preset_name}
Target unit: chapter
Objective: {preset["objective"]}

Control skill: {preset["control_skill"]}
Guardrails:
{guardrail_lines}
Mutators:
{mutator_lines}
Scoring lenses:
{scoring_lens_lines}

Pass floor: {preset["pass_floor"]}
Critical fail conditions:
{critical_fail_lines}
Rewrite routing priority: {preset["rewrite_routing_priority"]}
Minimum variants: {preset["minimum_variants"]}
Structural rewrite rule: {preset["structural_rule"]}

Success criteria:
- The winning variant improves benchmark results in the intended dimensions.
- At least one variant tests a structural assumption when the failure is above prose.

Notes:
""",
        args.force,
    )

    write_file(
        loop_root / "README.md",
        f"""# Loop {loop_id}

This loop should document one full experiment cycle:

1. baseline benchmark
2. variants
3. benchmark deltas
4. keep/discard decisions
5. next loop recommendation

Preset: `{preset_name}`
""",
        args.force,
    )

    write_file(
        loop_root / "plan.md",
        f"""# Loop Plan

Preset: {preset_name}
Benchmark profile: {benchmark_name}
Minimum variants: {preset["minimum_variants"]}

## Required Decisions Before Drafting

- Active hypotheses:
- Highest-level failure:
- Rewrite level:
- Judges to use:
- Guardrails to use:
- Mutators to use:

## Structural Rule

{preset["structural_rule"]}

## Variant Mix

- Variant 1: structural or ordering assumption
- Variant 2: character, pressure, or motive assumption
- Variant 3: pacing or prose assumption

If the user explicitly wants a smaller run, note the reason here before reducing variant count.
""",
        args.force,
    )

    write_file(
        loop_root / "baseline" / "input-snapshot.md",
        f"""# Baseline Input Snapshot

Snapshot the starting text for loop `{loop_id}` here before variant work begins.
""",
        args.force,
    )
    write_file(
        loop_root / "baseline" / "benchmark-report.md",
        """# Baseline Benchmark Report

Target unit:
Benchmark profile:
Preset:
Hypotheses consulted:
Judges used:
Guardrails used:
Actual skills used:
- skill:
  role:
Strengths:
Failures:
Highest-level failure:
Rewrite level:
Score by lens:
- skill:
  score:
  notes:
Next assumption to test:
""",
        args.force,
    )

    write_file(
        variant_root / "assumption.md",
        """# Variant Assumption

This variant assumes the draft improves if:

Style or direction:
Target metric to improve:
Rewrite level:
Hypothesis source:
Recommended judges:
- ...
Recommended mutators:
- ...
Primary mutator:
Primary judge target:
""",
        args.force,
    )
    write_file(
        variant_root / "candidate.md",
        "# Candidate Draft\n\nPut the full variant draft or revised plan here.\n",
        args.force,
    )
    write_file(
        variant_root / "benchmark-report.md",
        """# Variant Benchmark Report

Variant:
Benchmark profile:
Judges used:
Mutators used:
Actual skills used:
- skill:
  role:
Scores by lens:
- skill:
  baseline:
  variant:
  delta:
Strengths:
Regressions:
""",
        args.force,
    )
    write_file(
        variant_root / "delta.md",
        """# Benchmark Delta

Compared against:
Improved:
Regressed:
Net result:
""",
        args.force,
    )
    write_file(
        variant_root / "decision.md",
        """# Variant Decision

Decision: keep | discard | escalate rewrite level | change benchmark and retry

Why:
What to carry forward:
Did this variant solve the diagnosed failure?:
Actual skills used:
- skill:
  role:
""",
        args.force,
    )
    write_file(
        loop_root / "summary.md",
        """# Loop Summary

Target unit:
Benchmark profile:
Baseline result:
Highest-level failure:
Rewrite level:
Hypotheses consulted:
Actual skills used:
- skill:
  role:
Variants tested:
Variant kept:
Reason:
Next loop:
""",
        args.force,
    )

    print(f"Initialized fiction autoresearch project at {project_root}")


if __name__ == "__main__":
    main()
