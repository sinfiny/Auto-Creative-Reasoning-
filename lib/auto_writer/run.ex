defmodule AutoWriter.Run do
  @moduledoc """
  Creates a fiction iteration workspace.

  The generated files are plain markdown so the user and the AI can keep the
  actual reasoning declarative.
  """

  alias AutoWriter.LoopSpec

  def init(slug, opts \\ []) when is_binary(slug) do
    title = Keyword.get(opts, :title, humanize(slug))
    loop_id = Keyword.get(opts, :loop_id, today() <> "-baseline")
    root = Keyword.get(opts, :root, "runs") |> Path.join(slug)
    spec = Keyword.get(opts, :spec, LoopSpec.default())

    files = %{
      "README.md" => project_readme(title, slug),
      "source/input.md" => "# Source\n\nPaste the unit under test here.\n",
      "paragraphs/.keep" => "",
      "assignments/.keep" => "",
      "events/.keep" => "",
      "review/.keep" => "",
      "notes.md" => notes(title, spec, loop_id)
    }

    Enum.each(files, fn {relative, content} ->
      path = Path.join(root, relative)
      File.mkdir_p!(Path.dirname(path))
      write_new(path, content)
    end)

    {:ok, root}
  end

  defp write_new(path, content) do
    unless File.exists?(path) do
      File.write!(path, content)
    end
  end

  defp project_readme(title, slug) do
    """
    # #{title}

    Run workspace for `#{slug}`.
    """
  end

  defp notes(title, spec, loop_id) do
    """
    # Notes

    Target: #{title}
    Loop: `#{loop_id}`

    This run is an append-only paragraph experiment. There is no apply step.

    ## Roles

    #{roles(spec.roles)}

    ## Stop Rule

    #{spec.stop_rule}
    """
  end

  defp roles(roles) do
    roles
    |> Enum.map(fn {role, skills} ->
      skill_lines =
        skills
        |> Enum.map(&"- #{&1}")
        |> Enum.join("\n")

      "### #{role}\n\n#{skill_lines}"
    end)
    |> Enum.join("\n\n")
  end

  defp humanize(slug) do
    slug
    |> String.replace("-", " ")
    |> String.split()
    |> Enum.map_join(" ", &String.capitalize/1)
  end

  defp today do
    Date.utc_today() |> Date.to_iso8601()
  end
end
