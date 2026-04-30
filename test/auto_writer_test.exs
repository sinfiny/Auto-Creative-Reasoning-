defmodule AutoWriterTest do
  use ExUnit.Case

  test "discovers skills" do
    assert AutoWriter.skills("skills") != []
  end

  test "splits paragraphs on blank lines" do
    paragraphs = AutoWriter.Paragraph.split("One.\n\nTwo.\n\n\nThree.")

    assert Enum.map(paragraphs, & &1.id) == ["p0001", "p0002", "p0003"]
    assert Enum.map(paragraphs, & &1.text) == ["One.", "Two.", "Three."]
  end

  test "diff detects rearranged words" do
    html = AutoWriter.Diff.html("Mara opened the door slowly", "Slowly Mara opened the door")

    assert html =~ "move"
    assert html =~ "<del"
    assert html =~ "<ins"
  end
end
