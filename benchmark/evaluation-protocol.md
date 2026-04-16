# Evaluation Protocol

Use this protocol for benchmarked runs.

## Per Run

1. Define the target unit.
2. Define the objective of the run.
3. Select one benchmark card.
4. Select rubric sections from `rubrics/leaderboard-webserial-rubric.md`.
5. Generate or revise.
6. Score from 1-5 per category.
7. Record the highest-level failure.
8. Choose one intervention only.
9. Re-score after the intervention.
10. Log whether the intervention improved the benchmark target.

## Output Shape

```text
Run ID:
Target unit:
Benchmark card:
Objective:
Rubric sections:
Version A score:
Main failure:
Intervention:
Version B score:
Delta:
Decision:
```

## Rules

- Do not compare two drafts unless the benchmark target is the same.
- Do not score with hidden criteria.
- Do not call a revision successful unless the benchmark delta improved the intended target.
