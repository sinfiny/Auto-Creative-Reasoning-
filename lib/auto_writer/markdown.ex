defmodule AutoWriter.Markdown do
  @moduledoc """
  Tiny markdown-frontmatter helpers.

  The project deliberately keeps this simple: flat `key: value` metadata and
  markdown bodies.
  """

  def read(path) do
    path
    |> File.read!()
    |> split()
  end

  def split("---\n" <> rest) do
    case String.split(rest, "\n---", parts: 2) do
      [frontmatter, body] -> {parse_frontmatter(frontmatter), String.trim_leading(body)}
      _ -> {%{}, rest}
    end
  end

  def split(text), do: {%{}, text}

  def parse_frontmatter(text) do
    text
    |> String.split("\n")
    |> Enum.reduce(%{}, fn line, acc ->
      case String.split(line, ":", parts: 2) do
        [key, value] -> Map.put(acc, String.trim(key), clean(value))
        _ -> acc
      end
    end)
  end

  def frontmatter(map) do
    lines =
      map
      |> Enum.reject(fn {_key, value} -> is_nil(value) or value == "" end)
      |> Enum.map(fn {key, value} -> "#{key}: #{value}" end)
      |> Enum.join("\n")

    "---\n#{lines}\n---\n\n"
  end

  def section(body, title) do
    marker = "## #{title}"

    body
    |> String.split(marker, parts: 2)
    |> case do
      [_] ->
        ""

      [_, rest] ->
        rest
        |> String.split("\n## ", parts: 2)
        |> List.first()
        |> String.trim()
    end
  end

  def first_heading_name(path) do
    {_meta, body} = read(path)

    body
    |> String.split("\n")
    |> Enum.find_value(Path.basename(path, ".md"), fn line ->
      if String.starts_with?(line, "# ") do
        line |> String.trim_leading("# ") |> String.trim()
      end
    end)
  end

  defp clean(value) do
    value
    |> String.trim()
    |> String.trim_leading("\"")
    |> String.trim_trailing("\"")
  end
end
