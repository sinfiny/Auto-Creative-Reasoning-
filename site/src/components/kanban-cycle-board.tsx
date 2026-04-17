import { type FormEvent, type ReactNode, useEffect, useEffectEvent, useMemo, useState } from "react"
import {
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  Compass,
  FileText,
  FolderKanban,
  Pause,
  PencilLine,
  Play,
  Plus,
  RotateCcw,
  ScrollText,
  Sparkles,
  Wrench,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type Stage = "benchmark" | "hypothesis" | "work" | "complete"

type NovelCard = {
  id: string
  title: string
  cycle: number
  focus: string
}

type BoardState = Record<Stage, NovelCard[]>

const STORAGE_KEY = "skills-novel-loop-board"
const AUTO_TICK_MS = 4200
const STAGES: Stage[] = ["benchmark", "hypothesis", "work", "complete"]

const STAGE_META = {
  benchmark: {
    icon: BookOpen,
    label: "Benchmark",
    short: "BR",
    subtitle: "New and returning drafts enter here first.",
    accent: "text-zinc-100",
    chip: "border-zinc-600 bg-zinc-800 text-zinc-100",
  },
  hypothesis: {
    icon: Compass,
    label: "Hypothesis / Direction",
    short: "HD",
    subtitle: "Name the next creative bet before touching the prose.",
    accent: "text-sky-300",
    chip: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  },
  work: {
    icon: Wrench,
    label: "Work Upon It",
    short: "WO",
    subtitle: "Turn the direction into actual pages, beats, and edits.",
    accent: "text-emerald-300",
    chip: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  },
  complete: {
    icon: Check,
    label: "Complete",
    short: "CP",
    subtitle: "Completed passes wait here, then re-enter benchmark.",
    accent: "text-amber-300",
    chip: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  },
} as const

const DEFAULT_BOARD: BoardState = {
  benchmark: [
    {
      id: "ash-cartographer",
      title: "The Ash Cartographer",
      cycle: 1,
      focus: "Compare the opening promise against the strongest benchmark chapter.",
    },
    {
      id: "salt-archive",
      title: "Salt Archive",
      cycle: 2,
      focus: "Re-enter benchmark after a clean reveal pass to test the new rhythm.",
    },
  ],
  hypothesis: [
    {
      id: "monsoon-cipher",
      title: "Monsoon Cipher",
      cycle: 1,
      focus: "Test whether the betrayal lands harder if the warm scene turns colder earlier.",
    },
  ],
  work: [
    {
      id: "clockwork-orchard",
      title: "Clockwork Orchard",
      cycle: 3,
      focus: "Rewrite the scene spine so every beat cashes the new direction.",
    },
  ],
  complete: [
    {
      id: "glass-tide",
      title: "Glass Tide",
      cycle: 2,
      focus: "Completed a tighter benchmark pass and is ready to feed the next loop.",
    },
  ],
}

const LEFT_RAIL_ITEMS = [
  { icon: FolderKanban, label: "Board", active: true },
  { icon: BookOpen, label: "Story" },
  { icon: PencilLine, label: "Plan" },
  { icon: ScrollText, label: "Script" },
  { icon: Bot, label: "Assist" },
]

const PLAN_FOLDERS = [
  "Reference stack",
  "Audience goals",
  "Narrator goals",
  "World-building questions",
  "Loop archive",
]

function cloneBoard(board: BoardState): BoardState {
  return {
    benchmark: [...board.benchmark],
    hypothesis: [...board.hypothesis],
    work: [...board.work],
    complete: [...board.complete],
  }
}

function createNovel(title: string): NovelCard {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `novel-${Date.now()}`,
    title,
    cycle: 1,
    focus: "Fresh entry. Benchmark it before locking the next hypothesis.",
  }
}

function rotateBoard(board: BoardState) {
  const nextBoard = cloneBoard(board)
  const movedIds: string[] = []

  const leavingBenchmark = nextBoard.benchmark.shift()
  const leavingHypothesis = nextBoard.hypothesis.shift()
  const leavingWork = nextBoard.work.shift()
  const leavingComplete = nextBoard.complete.shift()

  if (leavingBenchmark) {
    movedIds.push(leavingBenchmark.id)
    nextBoard.hypothesis.push(leavingBenchmark)
  }

  if (leavingHypothesis) {
    movedIds.push(leavingHypothesis.id)
    nextBoard.work.push(leavingHypothesis)
  }

  if (leavingWork) {
    movedIds.push(leavingWork.id)
    nextBoard.complete.push(leavingWork)
  }

  if (leavingComplete) {
    movedIds.push(leavingComplete.id)
    nextBoard.benchmark.push({
      ...leavingComplete,
      cycle: leavingComplete.cycle + 1,
      focus: "Returned from complete. Re-benchmark the pass and decide the next hypothesis.",
    })
  }

  return { nextBoard, movedIds }
}

function normalizeBoard(value: unknown): BoardState | null {
  if (!value || typeof value !== "object") {
    return null
  }

  const maybeBoard = value as Partial<Record<Stage, unknown>>
  const nextBoard = {} as BoardState

  for (const stage of STAGES) {
    const lane = maybeBoard[stage]

    if (!Array.isArray(lane)) {
      return null
    }

    nextBoard[stage] = lane.filter((item): item is NovelCard => {
      if (!item || typeof item !== "object") {
        return false
      }

      const card = item as Partial<NovelCard>

      return (
        typeof card.id === "string" &&
        typeof card.title === "string" &&
        typeof card.focus === "string" &&
        typeof card.cycle === "number"
      )
    })
  }

  return nextBoard
}

function totalLoops(board: BoardState) {
  return STAGES.reduce(
    (sum, stage) =>
      sum +
      board[stage].reduce((laneSum, novel) => laneSum + Math.max(0, novel.cycle - 1), 0),
    0
  )
}

function stagePrompt(stage: Stage, novel: NovelCard) {
  if (stage === "benchmark") {
    return novel.cycle > 1
      ? "Returned to benchmark for another measured pass."
      : "Fresh against the benchmark bar."
  }

  if (stage === "hypothesis") {
    return "Choose the smallest change with the biggest upside."
  }

  if (stage === "work") {
    return "Push the direction into scenes, sentences, and structure."
  }

  return "Park the shipped pass here until the next loop picks it up."
}

function getActiveStage(board: BoardState): Stage {
  if (board.work.length) return "work"
  if (board.hypothesis.length) return "hypothesis"
  if (board.benchmark.length) return "benchmark"
  return "complete"
}

function buildScriptLines(stage: Stage, novel: NovelCard) {
  const lead =
    stage === "benchmark"
      ? "BENCHMARK"
      : stage === "hypothesis"
        ? "DIRECTION"
        : stage === "work"
          ? "WORK PASS"
          : "COMPLETE"

  return [
    `${lead}: ${novel.title.toUpperCase()} / PASS ${novel.cycle}`,
    "",
    "SYSTEM:",
    `The current loop position is ${STAGE_META[stage].label}.`,
    `Focus: ${novel.focus}`,
    "",
    "NOTES:",
    stagePrompt(stage, novel),
    "Keep the next move visible, small, and testable.",
    "The completed pass must be strong enough to survive re-entry into benchmark.",
  ]
}

function WorkspacePanel({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: typeof FolderKanban
  children: ReactNode
}) {
  return (
    <section className="flex min-h-[640px] flex-col border-t border-zinc-800 bg-[#111113] xl:min-h-0 xl:border-t-0 xl:border-l">
      <header className="flex h-12 items-center justify-between border-b border-zinc-800 px-4">
        <div className="flex items-center gap-2 text-[13px] font-medium text-zinc-100">
          <Icon className="size-3.5 text-zinc-400" />
          <span>{title}</span>
        </div>
        <span className="text-[11px] text-zinc-500">k</span>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </section>
  )
}

function PanelBlock({
  title,
  children,
  action,
  dense = false,
}: {
  title: string
  children: ReactNode
  action?: ReactNode
  dense?: boolean
}) {
  return (
    <section className={cn("border-b border-zinc-800 px-4 py-4", dense && "py-3")}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-[12px] font-medium tracking-[0.02em] text-zinc-100">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  )
}

function LaneCard({
  novel,
  stage,
  isMoved,
}: {
  novel: NovelCard
  stage: Stage
  isMoved: boolean
}) {
  const meta = STAGE_META[stage]

  return (
    <article
      className={cn(
        "rounded-md border bg-[#141418] p-3 transition-all duration-300",
        "border-zinc-800",
        isMoved && "border-zinc-500 bg-[#17171d] shadow-[0_0_0_1px_rgba(161,161,170,0.3)]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-zinc-100">{novel.title}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            {meta.short} / Pass {novel.cycle}
          </p>
        </div>
        <Badge className={cn("shrink-0 font-mono text-[10px]", meta.chip)}>{meta.short}</Badge>
      </div>
      <p className="mt-3 font-mono text-[11px] leading-5 text-zinc-400">{novel.focus}</p>
      <p className="mt-2 text-[11px] text-zinc-500">{stagePrompt(stage, novel)}</p>
    </article>
  )
}

export default function KanbanCycleBoard() {
  const [board, setBoard] = useState<BoardState>(DEFAULT_BOARD)
  const [draftTitle, setDraftTitle] = useState("")
  const [autoRunning, setAutoRunning] = useState(true)
  const [movedIds, setMovedIds] = useState<string[]>([])
  const [lastTickAt, setLastTickAt] = useState(0)
  const [clockNow, setClockNow] = useState(0)

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)

    if (!saved) {
      const now = Date.now()
      setLastTickAt(now)
      setClockNow(now)
      return
    }

    try {
      const parsed = JSON.parse(saved)
      const normalized = normalizeBoard(parsed)

      if (normalized) {
        setBoard(normalized)
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }

    const now = Date.now()
    setLastTickAt(now)
    setClockNow(now)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(board))
  }, [board])

  useEffect(() => {
    if (!movedIds.length) {
      return
    }

    const timeout = window.setTimeout(() => setMovedIds([]), 700)

    return () => window.clearTimeout(timeout)
  }, [movedIds])

  const cycleBoard = useEffectEvent(() => {
    setBoard((currentBoard) => {
      const { nextBoard, movedIds: moved } = rotateBoard(currentBoard)
      setMovedIds(moved)
      setLastTickAt(Date.now())
      return nextBoard
    })
  })

  useEffect(() => {
    if (!autoRunning || lastTickAt === 0) {
      return
    }

    const interval = window.setInterval(() => {
      cycleBoard()
    }, AUTO_TICK_MS)

    return () => window.clearInterval(interval)
  }, [autoRunning, lastTickAt])

  useEffect(() => {
    if (!autoRunning || lastTickAt === 0) {
      return
    }

    const interval = window.setInterval(() => {
      setClockNow(Date.now())
    }, 120)

    return () => window.clearInterval(interval)
  }, [autoRunning, lastTickAt])

  const progressValue =
    autoRunning && lastTickAt !== 0
      ? Math.min(100, ((clockNow - lastTickAt) / AUTO_TICK_MS) * 100)
      : 0

  const loopsRun = totalLoops(board)
  const totalCards = STAGES.reduce((sum, stage) => sum + board[stage].length, 0)
  const activeStage = getActiveStage(board)
  const activeNovel = board[activeStage][0]
  const scriptLines = useMemo(
    () => (activeNovel ? buildScriptLines(activeStage, activeNovel) : []),
    [activeNovel, activeStage]
  )

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const title = draftTitle.trim()

    if (!title) {
      return
    }

    setBoard((currentBoard) => ({
      ...currentBoard,
      benchmark: [createNovel(title), ...currentBoard.benchmark],
    }))
    setDraftTitle("")
  }

  function handleReset() {
    setBoard(DEFAULT_BOARD)
    setMovedIds([])
    const now = Date.now()
    setLastTickAt(now)
    setClockNow(now)
  }

  return (
    <div className="min-h-[100svh] bg-[#0b0b0d] text-zinc-100">
      <div className="mx-auto h-[100svh] max-w-[1600px] overflow-hidden xl:grid xl:grid-cols-[52px_minmax(0,1.03fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <aside className="hidden h-full flex-col border-r border-zinc-800 bg-[#0a0a0c] xl:flex">
          <div className="flex h-12 items-center justify-center border-b border-zinc-800">
            <div className="flex size-6 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 text-[10px] text-zinc-300">
              N
            </div>
          </div>
          <div className="flex flex-1 flex-col items-center gap-3 px-2 py-3">
            {LEFT_RAIL_ITEMS.map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                type="button"
                className={cn(
                  "flex size-9 items-center justify-center rounded-md border text-zinc-500 transition-colors",
                  active
                    ? "border-zinc-600 bg-zinc-800 text-zinc-100"
                    : "border-transparent bg-transparent hover:border-zinc-800 hover:bg-zinc-900 hover:text-zinc-300"
                )}
                aria-label={label}
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>
        </aside>

        <WorkspacePanel title="Story Plan" icon={FolderKanban}>
          <PanelBlock title="Novel Intake">
            <form className="space-y-3" onSubmit={handleSubmit}>
              <Input
                aria-label="Novel title"
                className="h-10 border-zinc-700 bg-zinc-900 font-mono text-[12px] text-zinc-100 placeholder:text-zinc-500 focus-visible:border-zinc-500"
                placeholder="Press Enter to add a novel to Benchmark"
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <Button className="h-8 rounded-md bg-zinc-200 px-3 text-[12px] text-zinc-950 hover:bg-white">
                  <Plus className="size-3.5" />
                  Add to Benchmark
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-[12px] text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  onClick={handleReset}
                >
                  <RotateCcw className="size-3.5" />
                  Reset
                </Button>
              </div>
            </form>
          </PanelBlock>

          <PanelBlock
            title="Benchmark Queue"
            action={
              <span className="font-mono text-[11px] text-zinc-500">
                {board.benchmark.length} queued
              </span>
            }
          >
            <div className="space-y-2">
              {board.benchmark.map((novel) => (
                <LaneCard
                  key={novel.id}
                  novel={novel}
                  stage="benchmark"
                  isMoved={movedIds.includes(novel.id)}
                />
              ))}
            </div>
          </PanelBlock>

          <PanelBlock title="Loop Registers" dense>
            <div className="grid gap-2 font-mono text-[11px] text-zinc-400 sm:grid-cols-2">
              <div className="rounded-md border border-zinc-800 bg-[#151519] p-3">
                <p className="text-zinc-500">cards_on_board</p>
                <p className="mt-2 text-xl text-zinc-100">{totalCards}</p>
              </div>
              <div className="rounded-md border border-zinc-800 bg-[#151519] p-3">
                <p className="text-zinc-500">loops_completed</p>
                <p className="mt-2 text-xl text-zinc-100">{loopsRun}</p>
              </div>
            </div>
          </PanelBlock>

          <PanelBlock title="Folders" dense>
            <div className="space-y-1">
              {PLAN_FOLDERS.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-md border border-zinc-800 bg-[#121216] px-3 py-2 text-[12px] text-zinc-400"
                >
                  <span>{item}</span>
                  <span className="text-zinc-600">+</span>
                </div>
              ))}
            </div>
          </PanelBlock>
        </WorkspacePanel>

        <WorkspacePanel title="Beat Plan" icon={PencilLine}>
          <PanelBlock title="Cycle Instructions">
            <div className="space-y-3 rounded-md border border-zinc-800 bg-[#16161a] p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] text-zinc-100">
                    {autoRunning ? "Auto cycle active" : "Auto cycle paused"}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-zinc-500">
                    {"benchmark -> hypothesis -> work -> complete -> benchmark"}
                  </p>
                </div>
                <Badge className="border-zinc-700 bg-zinc-900 font-mono text-[10px] text-zinc-300">
                  {Math.round(AUTO_TICK_MS / 100) / 10}s
                </Badge>
              </div>

              <Progress
                value={progressValue}
                className="h-1.5 bg-zinc-800 [&_[data-slot=progress-indicator]]:bg-zinc-200"
              />

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  className="h-8 rounded-md bg-zinc-200 px-3 text-[12px] text-zinc-950 hover:bg-white"
                  onClick={() => setAutoRunning((running) => !running)}
                >
                  {autoRunning ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                  {autoRunning ? "Pause" : "Start"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-[12px] text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  onClick={() => cycleBoard()}
                >
                  <ArrowRight className="size-3.5" />
                  Step
                </Button>
              </div>
            </div>
          </PanelBlock>

          <PanelBlock
            title="Hypothesis / Direction"
            action={
              <span className="font-mono text-[11px] text-zinc-500">
                {board.hypothesis.length} open
              </span>
            }
          >
            <div className="space-y-3">
              {board.hypothesis.length ? (
                board.hypothesis.map((novel, index) => (
                  <div key={novel.id} className="space-y-2">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                      Beat {index + 1}
                    </p>
                    <LaneCard
                      novel={novel}
                      stage="hypothesis"
                      isMoved={movedIds.includes(novel.id)}
                    />
                  </div>
                ))
              ) : (
                <div className="rounded-md border border-dashed border-zinc-800 bg-[#121216] p-3 font-mono text-[11px] leading-5 text-zinc-500">
                  No active hypothesis. The next benchmarked novel will move here on the next step.
                </div>
              )}
            </div>
          </PanelBlock>

          <PanelBlock
            title="Work Upon It"
            action={
              <span className="font-mono text-[11px] text-zinc-500">
                {board.work.length} in pass
              </span>
            }
          >
            <div className="space-y-3">
              {board.work.length ? (
                board.work.map((novel, index) => (
                  <div key={novel.id} className="space-y-2">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                      Work Beat {index + 1}
                    </p>
                    <LaneCard
                      novel={novel}
                      stage="work"
                      isMoved={movedIds.includes(novel.id)}
                    />
                  </div>
                ))
              ) : (
                <div className="rounded-md border border-dashed border-zinc-800 bg-[#121216] p-3 font-mono text-[11px] leading-5 text-zinc-500">
                  Nothing is actively being worked right now. Advance the board or add another card.
                </div>
              )}
            </div>
          </PanelBlock>
        </WorkspacePanel>

        <WorkspacePanel title="Script" icon={FileText}>
          <PanelBlock title="Live Preview">
            <div className="space-y-3">
              <div className="overflow-hidden rounded-md border border-zinc-800 bg-[#18181d]">
                <div className="h-40 bg-[radial-gradient(circle_at_35%_20%,rgba(174,255,139,0.18),transparent_25%),radial-gradient(circle_at_72%_28%,rgba(165,235,255,0.12),transparent_22%),linear-gradient(180deg,rgba(49,79,55,0.95),rgba(12,16,15,0.98))]" />
              </div>

              <div className="rounded-md border border-zinc-800 bg-[#131318] p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] text-zinc-100">
                      {activeNovel ? activeNovel.title : "No active draft"}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-zinc-500">
                      {activeNovel
                        ? `${STAGE_META[activeStage].label} / pass ${activeNovel.cycle}`
                        : "Waiting for a novel to enter the loop"}
                    </p>
                  </div>
                  <Badge className={cn("font-mono text-[10px]", STAGE_META[activeStage].chip)}>
                    {STAGE_META[activeStage].short}
                  </Badge>
                </div>

                <div className="space-y-3 font-mono text-[11px] leading-5 text-zinc-300">
                  {scriptLines.map((line, index) => (
                    <p key={`${line}-${index}`} className={cn(!line && "h-2")}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </PanelBlock>

          <PanelBlock
            title="Complete"
            action={
              <span className="font-mono text-[11px] text-zinc-500">
                {board.complete.length} done
              </span>
            }
          >
            <div className="space-y-2">
              {board.complete.length ? (
                board.complete.map((novel) => (
                  <LaneCard
                    key={novel.id}
                    novel={novel}
                    stage="complete"
                    isMoved={movedIds.includes(novel.id)}
                  />
                ))
              ) : (
                <div className="rounded-md border border-dashed border-zinc-800 bg-[#121216] p-3 font-mono text-[11px] leading-5 text-zinc-500">
                  Completed passes will collect here, then return to benchmark on the next full turn.
                </div>
              )}
            </div>
          </PanelBlock>

          <PanelBlock title="Operator Notes" dense>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-md border border-zinc-800 bg-[#141418] p-3">
                <p className="flex items-center gap-2 text-[12px] text-zinc-200">
                  <Sparkles className="size-3.5 text-zinc-500" />
                  current_focus
                </p>
                <p className="mt-2 font-mono text-[11px] leading-5 text-zinc-500">
                  {activeNovel?.focus ?? "No active focus yet."}
                </p>
              </div>
              <div className="rounded-md border border-zinc-800 bg-[#141418] p-3">
                <p className="flex items-center gap-2 text-[12px] text-zinc-200">
                  <Bot className="size-3.5 text-zinc-500" />
                  system_state
                </p>
                <p className="mt-2 font-mono text-[11px] leading-5 text-zinc-500">
                  {autoRunning
                    ? "Loop is cycling automatically."
                    : "Loop is paused; manual stepping is active."}
                </p>
              </div>
            </div>
          </PanelBlock>
        </WorkspacePanel>
      </div>
    </div>
  )
}
