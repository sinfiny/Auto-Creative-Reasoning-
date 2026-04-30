defmodule Mix.Tasks.Aw.Mock do
  @moduledoc "Run a markdown assignment with deterministic mock agent output."
  use Mix.Task

  alias AutoWriter.Experiment

  @shortdoc "Create mock comment/edit events"

  def run(args) do
    case args do
      [run_root, assignment_path] ->
        events = Experiment.run(run_root, assignment_path)
        Mix.shell().info("Wrote #{length(events)} events to #{run_root}/events")

      _ ->
        Mix.raise("usage: mix aw.mock RUN_ROOT ASSIGNMENT_PATH")
    end
  end
end
