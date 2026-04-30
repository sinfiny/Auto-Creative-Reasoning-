defmodule AutoWriter.Paragraph do
  @moduledoc """
  Paragraph segmentation and storage.

  Current rule: a paragraph is a non-empty block separated by one or more blank
  lines after normalizing line endings.
  """

  alias AutoWriter.Markdown

  defstruct [:id, :index, :text, :path]

  def split(text) do
    text
    |> String.replace("\r\n", "\n")
    |> String.replace("\r", "\n")
    |> String.split(~r/\n[ \t]*\n+/)
    |> Enum.map(&String.trim/1)
    |> Enum.reject(&(&1 == ""))
    |> Enum.with_index(1)
    |> Enum.map(fn {paragraph, index} ->
      %__MODULE__{id: id(index), index: index, text: paragraph}
    end)
  end

  def ingest(run_root, source_path) do
    text = File.read!(source_path)
    paragraphs = split(text)

    File.mkdir_p!(Path.join(run_root, "source"))
    File.cp!(source_path, Path.join(run_root, "source/input.md"))

    Enum.each(paragraphs, &write(run_root, &1))
    paragraphs
  end

  def read_all(run_root) do
    run_root
    |> Path.join("paragraphs/*.md")
    |> Path.wildcard()
    |> Enum.sort()
    |> Enum.map(&read/1)
  end

  def read(path) do
    {meta, body} = Markdown.read(path)

    %__MODULE__{
      id: Map.fetch!(meta, "id"),
      index: meta |> Map.fetch!("index") |> String.to_integer(),
      text: String.trim(body),
      path: path
    }
  end

  defp write(run_root, paragraph) do
    path = Path.join([run_root, "paragraphs", "#{paragraph.id}.md"])
    File.mkdir_p!(Path.dirname(path))

    content =
      Markdown.frontmatter(%{
        "id" => paragraph.id,
        "index" => paragraph.index
      }) <> paragraph.text <> "\n"

    File.write!(path, content)
  end

  defp id(index), do: "p" <> String.pad_leading(Integer.to_string(index), 4, "0")
end
