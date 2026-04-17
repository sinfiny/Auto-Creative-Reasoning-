#!/usr/bin/env python3
"""Initialize a recorded fiction autoresearch project and loop structure."""

from __future__ import annotations

import argparse
import re
from pathlib import Path


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
        "--benchmark-name",
        default="custom-active-benchmark",
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
    benchmark_name = slugify(args.benchmark_name)

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

- target unit
- objective
- control skill
- scoring lenses
- weights
- pass floor
- rewrite routing priority
""",
        args.force,
    )

    write_file(
        project_root / "benchmarks" / "profiles" / "active-benchmark.md",
        f"""Benchmark name: {benchmark_name}
Story or project: {args.title}
Target unit:
Objective:

Control skill:
Scoring lenses:
- skill:
  focus:
  weight:

Pass floor:
Critical fail conditions:
Rewrite routing priority:

Success criteria:
- ...

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
Strengths:
Failures:
Highest-level failure:
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
Scores:
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
""",
        args.force,
    )
    write_file(
        loop_root / "summary.md",
        """# Loop Summary

Target unit:
Benchmark profile:
Baseline result:
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
