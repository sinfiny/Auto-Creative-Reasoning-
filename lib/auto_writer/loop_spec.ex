defmodule AutoWriter.LoopSpec do
  @moduledoc """
  Declarative loop defaults.

  Keep this small. The writing intelligence belongs in `skills/`.
  """

  def default do
    %{
      minimum_variants: 3,
      stop_rule: "Keep only variants that improve the intended benchmark target.",
      roles: %{
        controller: [
          "fiction-autoresearch-loop",
          "creative-autoresearch-control-plane"
        ],
        judges: [
          "mystery-payoff-and-fairness-judge",
          "narrative-hook-hold-payoff",
          "narrative-epistemic-targeting",
          "strategic-webserial-architecture"
        ],
        guardrails: [
          "narrative-explicit-reasoning"
        ],
        mutators: [
          "narrative-auto-reasoning",
          "narrative-minimum-viable-prose",
          "narrative-surgical-editing"
        ]
      }
    }
  end
end
