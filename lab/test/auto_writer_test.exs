defmodule AutoWriterTest do
  use ExUnit.Case

  test "loads a markdown workflow" do
    workflow = AutoWriter.load_workflow("lab/workflows/simple.md")

    assert workflow.path == "lab/workflows/simple.md"
    assert workflow.frontmatter["id"] == "simple"
    assert workflow.body =~ "Simple Workflow"
  end

  test "runs the current empty loop shape" do
    result = AutoWriter.run("lab/workflows/simple.md")

    assert result.workflow.frontmatter["id"] == "simple"
    assert result.dispatch == []
    assert result.events == []
  end
end
