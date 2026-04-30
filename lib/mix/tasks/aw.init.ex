defmodule Mix.Tasks.Aw.Init do
  @moduledoc "Create a minimal fiction autoresearch run workspace."
  use Mix.Task

  alias AutoWriter.Run

  @shortdoc "Create a run workspace"

  def run(args) do
    {opts, rest, _invalid} =
      OptionParser.parse(args,
        strict: [
          title: :string,
          loop: :string,
          root: :string
        ]
      )

    slug =
      case rest do
        [value | _] -> value
        _ -> Mix.raise("usage: mix aw.init STORY_SLUG --title \"Story Title\"")
      end

    run_opts =
      []
      |> put_if(:title, opts[:title])
      |> put_if(:loop_id, opts[:loop])
      |> put_if(:root, opts[:root])

    {:ok, root} = Run.init(slug, run_opts)
    Mix.shell().info("Created #{root}")
  end

  defp put_if(opts, _key, nil), do: opts
  defp put_if(opts, key, value), do: Keyword.put(opts, key, value)
end
