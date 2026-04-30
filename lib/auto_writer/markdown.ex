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

  defp clean(value) do
    value
    |> String.trim()
    |> String.trim_leading("\"")
    |> String.trim_trailing("\"")
  end
end
