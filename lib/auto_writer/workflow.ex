defmodule AutoWriter.Workflow do
  @moduledoc """
  Loads a Markdown workflow file.

  For now, the workflow is only a Markdown document with optional flat
  frontmatter. It may point at agents, skills, prompts, sources, APIs, or any
  other files, but those meanings are not interpreted here yet.
  """

  alias AutoWriter.Markdown

  defstruct [:path, :frontmatter, :body]

  def load(path) when is_binary(path) do
    {frontmatter, body} = Markdown.read(path)

    %__MODULE__{
      path: path,
      frontmatter: frontmatter,
      body: String.trim(body)
    }
  end
end
