defmodule AutoWriter.SkillLibrary do
  @moduledoc """
  Finds skills. It does not decide what a skill means.
  """

  alias AutoWriter.Skill

  def list(root \\ "skills") do
    root
    |> Path.join("*/*/SKILL.md")
    |> Path.wildcard()
    |> Enum.map(&Skill.from_file/1)
    |> Enum.sort_by(& &1.name)
  end

  def names(root \\ "skills") do
    root
    |> list()
    |> Enum.map(& &1.name)
  end
end
