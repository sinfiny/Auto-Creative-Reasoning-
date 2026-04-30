defmodule AutoWriter.MockAgent do
  @moduledoc """
  Deterministic fake agent output for testing the event and review pipeline.
  """

  alias AutoWriter.Markdown

  def comment(agent_path, skill_path, paragraph) do
    agent = Markdown.first_heading_name(agent_path)
    skill = Path.basename(Path.dirname(skill_path))

    "#{agent} reads this paragraph through `#{skill}` and notices where the sentence pressure gathers. The useful question is what the paragraph makes the reader expect next."
  end

  def edit(paragraph) do
    suggested =
      paragraph.text
      |> tighten()
      |> maybe_rearrange()

    analysis =
      "This mock edit tests whether a smaller surface change can make the paragraph feel more directed without changing the event itself."

    {analysis, suggested}
  end

  defp tighten(text) do
    text
    |> String.replace(" very ", " ")
    |> String.replace(" a little ", " ")
    |> String.replace(" really ", " ")
    |> String.replace(" somewhat ", " ")
  end

  defp maybe_rearrange(text) do
    if text =~ "," do
      text
    else
      words = String.split(text)

      if length(words) > 14 do
        {front, rest} = Enum.split(words, 4)
        {middle, tail} = Enum.split(rest, max(length(rest) - 4, 0))

        (front ++ tail ++ middle)
        |> Enum.join(" ")
      else
        text
      end
    end
  end
end
