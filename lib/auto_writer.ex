defmodule AutoWriter do
  @moduledoc """
  Public interface for AutoWriter Core.

  AutoWriter Core is intentionally small: it loads a declarative workflow and
  leaves agent dispatch and event storage as explicit design spaces.
  """

  alias AutoWriter.{Loop, Workflow}

  defdelegate load_workflow(path), to: Workflow, as: :load
  defdelegate run(path), to: Loop
end
