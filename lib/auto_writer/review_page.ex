defmodule AutoWriter.ReviewPage do
  @moduledoc """
  Static review page renderer.

  It reads paragraph files and append-only event files, then writes HTML. The
  page can collect liked event ids in browser state and export them as JSON.
  """

  alias AutoWriter.{Diff, Event, Markdown, Paragraph}

  def render(run_root, opts \\ []) do
    output = Keyword.get(opts, :output, Path.join([run_root, "review", "index.html"]))

    paragraphs = Paragraph.read_all(run_root)
    events = Event.read_all(run_root) |> Enum.group_by(& &1.paragraph_id)

    html = page(run_root, paragraphs, events)

    File.mkdir_p!(Path.dirname(output))
    File.write!(output, html)
    {:ok, output}
  end

  defp page(run_root, paragraphs, events) do
    """
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>AutoWriter Review - #{escape(Path.basename(run_root))}</title>
      <style>#{css()}</style>
    </head>
    <body>
      <main>
        <header>
          <p class="eyebrow">AutoWriter Review</p>
          <h1>#{escape(Path.basename(run_root))}</h1>
        </header>
        <section class="toolbar">
          <button type="button" onclick="exportLikes()">Export liked events</button>
          <textarea id="liked-output" aria-label="Liked event export" readonly></textarea>
        </section>
        #{Enum.map_join(paragraphs, "\n", &paragraph_html(&1, Map.get(events, &1.id, [])))}
      </main>
      <script>#{js()}</script>
    </body>
    </html>
    """
  end

  defp paragraph_html(paragraph, events) do
    """
    <section class="paragraph" id="#{paragraph.id}">
      <div class="paragraph-text">
        <span class="pid">#{paragraph.id}</span>
        <p>#{escape(paragraph.text)}</p>
      </div>
      <div class="events">
        #{Enum.map_join(events, "\n", &event_html/1)}
      </div>
    </section>
    """
  end

  defp event_html(%{type: "comment"} = event) do
    """
    <article class="event comment" data-event-id="#{event.id}">
      #{event_header(event, "Comment")}
      <p>#{escape(event.comment)}</p>
    </article>
    """
  end

  defp event_html(%{type: "edit"} = event) do
    """
    <article class="event edit" data-event-id="#{event.id}">
      #{event_header(event, "Edit suggestion")}
      <p class="analysis">#{escape(event.analysis)}</p>
      <div class="diff">#{Diff.html(event.original, event.suggested)}</div>
      <details>
        <summary>Suggested paragraph</summary>
        <p>#{escape(event.suggested)}</p>
      </details>
    </article>
    """
  end

  defp event_header(event, label) do
    agent_name = display_name(event.agent)
    skill_name = event.skill && Path.basename(Path.dirname(event.skill))

    """
    <div class="event-header">
      <div>
        <strong>#{label}</strong>
        <span>#{escape(agent_name || event.agent || "agent")}</span>
        <span>#{escape(skill_name || event.skill || "skill")}</span>
      </div>
      <label>
        <input class="event-like" type="checkbox" value="#{event.id}" data-agent="#{escape(event.agent || "")}" data-skill="#{escape(event.skill || "")}" data-type="#{event.type}">
        like
      </label>
    </div>
    """
  end

  defp display_name(nil), do: nil
  defp display_name(path) do
    if File.exists?(path), do: Markdown.first_heading_name(path), else: Path.basename(path, ".md")
  end

  defp css do
    """
    :root { color-scheme: light; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    body { margin: 0; background: #f6f8fb; color: #111827; }
    main { max-width: 1120px; margin: 0 auto; padding: 32px 20px 64px; }
    header { margin-bottom: 24px; }
    h1 { margin: 0; font-size: 32px; letter-spacing: 0; }
    .eyebrow { margin: 0 0 4px; text-transform: uppercase; font-size: 12px; letter-spacing: 0; color: #475467; }
    .toolbar { display: grid; grid-template-columns: 180px 1fr; gap: 12px; margin: 18px 0 28px; align-items: stretch; }
    button { border: 1px solid #1f4e79; background: #1f4e79; color: white; border-radius: 6px; padding: 10px 12px; font: inherit; cursor: pointer; }
    textarea { min-height: 44px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px; resize: vertical; }
    .paragraph { display: grid; grid-template-columns: minmax(280px, 0.9fr) minmax(320px, 1.1fr); gap: 20px; border-top: 1px solid #d5dce8; padding: 22px 0; }
    .paragraph-text { position: sticky; top: 12px; align-self: start; }
    .paragraph-text p { font-size: 17px; line-height: 1.65; margin: 6px 0 0; }
    .pid { color: #52637a; font-size: 12px; font-weight: 700; }
    .events { display: grid; gap: 12px; }
    .event { background: #ffffff; border: 1px solid #d5dce8; border-radius: 8px; padding: 14px; }
    .event-header { display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 10px; }
    .event-header span { display: inline-block; margin-left: 8px; color: #52637a; font-size: 13px; }
    .analysis { color: #344054; }
    .diff { line-height: 1.9; font-size: 16px; background: #eef3f8; border-radius: 6px; padding: 12px; }
    del { background: #f4c7c3; color: #6f1d16; text-decoration: line-through; padding: 1px 3px; border-radius: 4px; }
    ins { background: #c9e8c8; color: #1d5a26; text-decoration: none; padding: 1px 3px; border-radius: 4px; }
    .move { outline: 1px dashed currentColor; }
    details { margin-top: 10px; }
    @media (max-width: 760px) {
      .paragraph, .toolbar { grid-template-columns: 1fr; }
      .paragraph-text { position: static; }
    }
    """
  end

  defp js do
    """
    const key = "autowriter-liked-events";
    const saved = new Set(JSON.parse(localStorage.getItem(key) || "[]"));
    document.querySelectorAll(".event-like").forEach(box => {
      box.checked = saved.has(box.value);
      box.addEventListener("change", () => {
        const next = new Set(JSON.parse(localStorage.getItem(key) || "[]"));
        box.checked ? next.add(box.value) : next.delete(box.value);
        localStorage.setItem(key, JSON.stringify([...next]));
      });
    });
    function exportLikes() {
      const liked = [...document.querySelectorAll(".event-like:checked")].map(box => ({
        event_id: box.value,
        agent: box.dataset.agent,
        skill: box.dataset.skill,
        type: box.dataset.type
      }));
      document.getElementById("liked-output").value = JSON.stringify(liked, null, 2);
    }
    """
  end

  defp escape(text), do: Diff.escape(to_string(text))
end
