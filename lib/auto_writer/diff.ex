defmodule AutoWriter.Diff do
  @moduledoc """
  Word-level diff for review pages.

  Rearrangements are detected as removed words that reappear as additions in a
  different position after the longest common subsequence pass.
  """

  def ops(original, suggested) do
    original_tokens = tokens(original)
    suggested_tokens = tokens(suggested)

    original_tokens
    |> edit_script(suggested_tokens)
    |> mark_moves()
  end

  def kind(original, suggested) do
    ops = ops(original, suggested)
    has_move? = Enum.any?(ops, &(&1.op in [:move_from, :move_to]))
    has_regular_edit? = Enum.any?(ops, &(&1.op in [:remove, :add]))

    cond do
      has_move? and has_regular_edit? -> "mixed"
      has_move? -> "rearrangement"
      has_regular_edit? -> "replacement"
      true -> "unchanged"
    end
  end

  def html(original, suggested) do
    original
    |> ops(suggested)
    |> Enum.map(&op_html/1)
    |> Enum.join(" ")
  end

  defp tokens(text) do
    ~r/[\p{L}\p{N}'-]+|[^\s\p{L}\p{N}]/u
    |> Regex.scan(text)
    |> List.flatten()
  end

  defp edit_script(a, b) do
    left = List.to_tuple(a)
    right = List.to_tuple(b)
    m = tuple_size(left)
    n = tuple_size(right)
    table = lcs_table(left, right, m, n)

    backtrack(left, right, table, m, n, [])
  end

  defp lcs_table(left, right, m, n) do
    for i <- 0..m, j <- 0..n, reduce: %{} do
      table ->
        value =
          cond do
            i == 0 or j == 0 ->
              0

            elem(left, i - 1) == elem(right, j - 1) ->
              Map.fetch!(table, {i - 1, j - 1}) + 1

            true ->
              max(Map.fetch!(table, {i - 1, j}), Map.fetch!(table, {i, j - 1}))
          end

        Map.put(table, {i, j}, value)
    end
  end

  defp backtrack(_left, right, _table, 0, j, acc) when j > 0 do
    backtrack([], right, %{}, 0, j - 1, [%{op: :add, text: elem(right, j - 1)} | acc])
  end

  defp backtrack(left, _right, _table, i, 0, acc) when i > 0 do
    backtrack(left, [], %{}, i - 1, 0, [%{op: :remove, text: elem(left, i - 1)} | acc])
  end

  defp backtrack(_left, _right, _table, 0, 0, acc), do: acc

  defp backtrack(left, right, table, i, j, acc) do
    l = elem(left, i - 1)
    r = elem(right, j - 1)

    cond do
      l == r ->
        backtrack(left, right, table, i - 1, j - 1, [%{op: :same, text: l} | acc])

      Map.fetch!(table, {i - 1, j}) >= Map.fetch!(table, {i, j - 1}) ->
        backtrack(left, right, table, i - 1, j, [%{op: :remove, text: l} | acc])

      true ->
        backtrack(left, right, table, i, j - 1, [%{op: :add, text: r} | acc])
    end
  end

  defp mark_moves(ops) do
    removes = indexed_by_token(ops, :remove)
    adds = indexed_by_token(ops, :add)

    {move_map, _next_id} =
      removes
      |> Enum.reduce({%{}, 1}, fn {token, remove_indexes}, {map, move_id} ->
        add_indexes = Map.get(adds, token, [])

        remove_indexes
        |> Enum.zip(add_indexes)
        |> Enum.reduce({map, move_id}, fn {from, to}, {inner, id} ->
          {
            inner
            |> Map.put(from, {:move_from, id})
            |> Map.put(to, {:move_to, id}),
            id + 1
          }
        end)
      end)

    ops
    |> Enum.with_index()
    |> Enum.map(fn {op, index} ->
      case Map.get(move_map, index) do
        nil -> op
        {new_op, move_id} -> op |> Map.put(:op, new_op) |> Map.put(:move_id, move_id)
      end
    end)
  end

  defp indexed_by_token(ops, op_name) do
    ops
    |> Enum.with_index()
    |> Enum.filter(fn {op, _index} -> op.op == op_name end)
    |> Enum.group_by(fn {op, _index} -> normalize(op.text) end, fn {_op, index} -> index end)
  end

  defp normalize(token), do: String.downcase(token)

  defp op_html(%{op: :same, text: text}), do: escape(text)
  defp op_html(%{op: :remove, text: text}), do: "<del>#{escape(text)}</del>"
  defp op_html(%{op: :add, text: text}), do: "<ins>#{escape(text)}</ins>"

  defp op_html(%{op: :move_from, text: text, move_id: id}) do
    "<del class=\"move\" data-move=\"#{id}\">#{escape(text)}</del>"
  end

  defp op_html(%{op: :move_to, text: text, move_id: id}) do
    "<ins class=\"move\" data-move=\"#{id}\">#{escape(text)}</ins>"
  end

  def escape(text) do
    text
    |> String.replace("&", "&amp;")
    |> String.replace("<", "&lt;")
    |> String.replace(">", "&gt;")
    |> String.replace("\"", "&quot;")
  end
end
