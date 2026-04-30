defmodule AutoWriter.Loop do
  @moduledoc """
  The smallest visible shape of the AutoWriter agent loop.

  This module should remain orchestration only. It loads the workflow, reaches
  the places where task dispatch and event append belong, and stops there until
  those interfaces are deliberately designed.
  """

  alias AutoWriter.Workflow

  def run(workflow_path) when is_binary(workflow_path) do
    workflow = Workflow.load(workflow_path)

    %{
      workflow: workflow,
      dispatch: dispatch_tasks(workflow),
      events: append_events(workflow)
    }
  end

  defp dispatch_tasks(_workflow) do
    # TODO: Define the task dispatch interface here.
    #
    # This is where the workflow should eventually say:
    # - what agent is working
    # - what API or external runner should be used
    # - what input that runner receives
    # - what output contract the runner must return
    []
  end

  defp append_events(_workflow) do
    # TODO: Define the append-only event interface here.
    #
    # The previous Markdown event writer was removed because the event model is
    # not settled. This should become the durable record of what happened in a
    # run after the event shape is designed.
    []
  end
end
