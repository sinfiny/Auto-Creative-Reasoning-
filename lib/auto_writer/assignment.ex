defmodule AutoWriter.Assignment do
  @moduledoc """
  A declarative request for one agent and one skill to inspect paragraphs.
  """

  alias AutoWriter.Markdown

  defstruct [:id, :agent, :skill, :prompt, :paragraphs, :mode, :body, :path]

  def read(path) do
    {meta, body} = Markdown.read(path)

    %__MODULE__{
      id: Map.get(meta, "id", Path.basename(path, ".md")),
      agent: Map.fetch!(meta, "agent"),
      skill: Map.fetch!(meta, "skill"),
      prompt: Map.get(meta, "prompt", ""),
      paragraphs: Map.get(meta, "paragraphs", "all"),
      mode: Map.get(meta, "mode", "comment"),
      body: body,
      path: path
    }
  end

  def target_paragraphs(%__MODULE__{paragraphs: "all"}, paragraphs), do: paragraphs

  def target_paragraphs(%__MODULE__{paragraphs: spec}, paragraphs) do
    wanted =
      spec
      |> String.split(",", trim: true)
      |> Enum.flat_map(&expand/1)
      |> MapSet.new()

    Enum.filter(paragraphs, &MapSet.member?(wanted, &1.index))
  end

  defp expand(part) do
    part = String.trim(part)

    case String.split(part, "-", parts: 2) do
      [single] ->
        [String.to_integer(single)]

      [first, last] ->
        String.to_integer(first)..String.to_integer(last)
        |> Enum.to_list()
    end
  end
end
