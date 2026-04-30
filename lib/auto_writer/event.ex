defmodule AutoWriter.Event do
  @moduledoc """
  Append-only event files.

  Events are markdown documents with flat metadata and typed sections. They are
  meant to be easy to read before they are easy to query.
  """

  alias AutoWriter.{Diff, Markdown}

  defstruct [
    :id,
    :type,
    :run_id,
    :paragraph_id,
    :paragraph_index,
    :agent,
    :skill,
    :prompt,
    :assignment,
    :created_at,
    :edit_kind,
    :comment,
    :analysis,
    :original,
    :suggested,
    :path
  ]

  def comment(run_root, attrs) do
    write(run_root, "comment", attrs, """
    ## Comment

    #{attrs.comment}
    """)
  end

  def edit(run_root, attrs) do
    edit_kind = Diff.kind(attrs.original, attrs.suggested)

    write(run_root, "edit", Map.put(attrs, :edit_kind, edit_kind), """
    ## Analysis

    #{attrs.analysis}

    ## Original

    #{attrs.original}

    ## Suggested

    #{attrs.suggested}
    """)
  end

  def read_all(run_root) do
    run_root
    |> Path.join("events/*.md")
    |> Path.wildcard()
    |> Enum.sort()
    |> Enum.map(&read/1)
  end

  def read(path) do
    {meta, body} = Markdown.read(path)

    %__MODULE__{
      id: Map.fetch!(meta, "id"),
      type: Map.fetch!(meta, "type"),
      run_id: Map.get(meta, "run_id"),
      paragraph_id: Map.fetch!(meta, "paragraph_id"),
      paragraph_index: meta |> Map.get("paragraph_index", "0") |> String.to_integer(),
      agent: Map.get(meta, "agent"),
      skill: Map.get(meta, "skill"),
      prompt: Map.get(meta, "prompt"),
      assignment: Map.get(meta, "assignment"),
      created_at: Map.get(meta, "created_at"),
      edit_kind: Map.get(meta, "edit_kind"),
      comment: Markdown.section(body, "Comment"),
      analysis: Markdown.section(body, "Analysis"),
      original: Markdown.section(body, "Original"),
      suggested: Markdown.section(body, "Suggested"),
      path: path
    }
  end

  defp write(run_root, type, attrs, body) do
    File.mkdir_p!(Path.join(run_root, "events"))

    id = Map.get(attrs, :id, event_id(type))
    path = Path.join([run_root, "events", "#{id}.md"])

    meta =
      %{
        "id" => id,
        "type" => type,
        "run_id" => Map.get(attrs, :run_id),
        "paragraph_id" => Map.fetch!(attrs, :paragraph_id),
        "paragraph_index" => Map.fetch!(attrs, :paragraph_index),
        "agent" => Map.fetch!(attrs, :agent),
        "skill" => Map.fetch!(attrs, :skill),
        "prompt" => Map.get(attrs, :prompt),
        "assignment" => Map.get(attrs, :assignment),
        "edit_kind" => Map.get(attrs, :edit_kind),
        "created_at" => DateTime.utc_now() |> DateTime.to_iso8601()
      }

    File.write!(path, Markdown.frontmatter(meta) <> String.trim(body) <> "\n")
    {:ok, path}
  end

  defp event_id(type) do
    stamp =
      DateTime.utc_now()
      |> DateTime.to_iso8601(:basic)
      |> String.replace(":", "")

    unique = System.unique_integer([:positive, :monotonic])
    "#{stamp}_#{type}_#{unique}"
  end
end
