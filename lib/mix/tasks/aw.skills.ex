defmodule Mix.Tasks.Aw.Skills do
  @moduledoc "List discovered AutoWriter skills."
  use Mix.Task

  alias AutoWriter.SkillLibrary

  @shortdoc "List discovered skills"

  def run(_args) do
    "skills"
    |> SkillLibrary.list()
    |> Enum.each(fn skill ->
      Mix.shell().info("#{skill.name} [#{skill.family}]")
    end)
  end
end
