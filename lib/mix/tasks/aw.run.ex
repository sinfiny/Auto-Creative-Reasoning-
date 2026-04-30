defmodule Mix.Tasks.Aw.Run do
  @moduledoc "Load a workflow and run the current minimal AutoWriter loop."
  use Mix.Task

  @shortdoc "Run a workflow"

  def run(args) do
    case args do
      [workflow_path] ->
        result = AutoWriter.run(workflow_path)
        Mix.shell().info("Loaded workflow #{result.workflow.path}")
        Mix.shell().info("Task dispatch is not designed yet.")
        Mix.shell().info("Event append is not designed yet.")

      _ ->
        Mix.raise("usage: mix aw.run WORKFLOW.md")
    end
  end
end
