defmodule AutoWriter.Experiment do
  @moduledoc """
  Runs a markdown assignment against stored paragraphs.

  This module is still a harness. Real agents can replace `MockAgent` later
  without changing paragraph storage, event storage, or review rendering.
  """

  alias AutoWriter.{Assignment, Event, MockAgent, Paragraph}

  def run(run_root, assignment_path) do
    assignment = Assignment.read(assignment_path)
    paragraphs = Paragraph.read_all(run_root)

    assignment
    |> Assignment.target_paragraphs(paragraphs)
    |> Enum.map(&write_event(run_root, assignment, &1))
  end

  defp write_event(run_root, %{mode: "comment"} = assignment, paragraph) do
    Event.comment(run_root, %{
      run_id: Path.basename(run_root),
      paragraph_id: paragraph.id,
      paragraph_index: paragraph.index,
      agent: assignment.agent,
      skill: assignment.skill,
      prompt: assignment.prompt,
      assignment: assignment.id,
      comment: MockAgent.comment(assignment.agent, assignment.skill, paragraph)
    })
  end

  defp write_event(run_root, %{mode: "edit"} = assignment, paragraph) do
    {analysis, suggested} = MockAgent.edit(paragraph)

    Event.edit(run_root, %{
      run_id: Path.basename(run_root),
      paragraph_id: paragraph.id,
      paragraph_index: paragraph.index,
      agent: assignment.agent,
      skill: assignment.skill,
      prompt: assignment.prompt,
      assignment: assignment.id,
      analysis: analysis,
      original: paragraph.text,
      suggested: suggested
    })
  end
end
