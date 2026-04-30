defmodule AutoWriter.Skill do
  @moduledoc """
  Declarative skill metadata read from a SKILL.md file.
  """

  defstruct [:name, :family, :path, :description]

  def from_file(path) do
    text = File.read!(path)
    metadata = frontmatter(text)
    skill_dir = Path.dirname(path)

    %__MODULE__{
      name: Map.get(metadata, "name", Path.basename(skill_dir)),
      family: skill_dir |> Path.dirname() |> Path.basename(),
      path: skill_dir,
      description: Map.get(metadata, "description", "")
    }
  end

  defp frontmatter("---\n" <> rest) do
    rest
    |> String.split("\n---", parts: 2)
    |> List.first()
    |> parse_pairs()
  end

  defp frontmatter(_), do: %{}

  defp parse_pairs(text) do
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
