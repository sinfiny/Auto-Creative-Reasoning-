defmodule AutoWriter do
  @moduledoc """
  Small public interface for the AutoWriter skill harness.
  """

  alias AutoWriter.{Paragraph, ReviewPage, Run, SkillLibrary}

  defdelegate skills(root \\ "skills"), to: SkillLibrary, as: :list
  defdelegate init_run(slug, opts \\ []), to: Run, as: :init
  defdelegate ingest(run_root, source_path), to: Paragraph
  defdelegate render_review(run_root, opts \\ []), to: ReviewPage, as: :render
end
