defmodule Mix.Tasks.Aw.Ingest do
  @moduledoc "Split a source document into stored paragraph files."
  use Mix.Task

  alias AutoWriter.Paragraph

  @shortdoc "Ingest source text into paragraph files"

  def run(args) do
    case args do
      [run_root, source_path] ->
        paragraphs = Paragraph.ingest(run_root, source_path)
        Mix.shell().info("Wrote #{length(paragraphs)} paragraphs to #{run_root}/paragraphs")

      _ ->
        Mix.raise("usage: mix aw.ingest RUN_ROOT SOURCE_PATH")
    end
  end
end
