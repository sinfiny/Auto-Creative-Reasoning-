defmodule Mix.Tasks.Aw.Review do
  @moduledoc "Render a static review page from paragraph and event files."
  use Mix.Task

  alias AutoWriter.ReviewPage

  @shortdoc "Render static review HTML"

  def run(args) do
    case args do
      [run_root] ->
        {:ok, output} = ReviewPage.render(run_root)
        Mix.shell().info("Wrote #{output}")

      _ ->
        Mix.raise("usage: mix aw.review RUN_ROOT")
    end
  end
end
