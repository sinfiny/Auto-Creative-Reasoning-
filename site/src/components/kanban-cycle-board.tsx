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
  owner: string
  benchmarkSet: string
  experimentId: string
  score: number
  delta: number
  updatedAt: string
  artifactPath: string
  nextAction: string
  sceneSeed: string
  statusNote: string
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
    chip: "border-zinc-600 bg-zinc-800 text-zinc-100",
  },
  hypothesis: {
    icon: Compass,
    label: "Hypothesis / Direction",
    short: "HD",
    subtitle: "Name the next creative bet before touching the prose.",
    chip: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  },
  work: {
    icon: Wrench,
    label: "Work Upon It",
    short: "WO",
    subtitle: "Turn the direction into actual pages, beats, and edits.",
    chip: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  },
  complete: {
    icon: Check,
    label: "Complete",
    short: "CP",
    subtitle: "Completed passes wait here, then re-enter benchmark.",
    chip: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  },
} as const

const DEFAULT_BOARD: BoardState = {
  benchmark: [
    {
      id: "ash-cartographer",
      title: "The Ash Cartographer",
      cycle: 1,
      focus: "Compare the opening promise against the strongest benchmark chapter in the repo.",
      owner: "Setavya",
      benchmarkSet: "benchmark/opening-hook-v2",
      experimentId: "BR-014",
      score: 73,
      delta: 0,
      updatedAt: "3 min ago",
      artifactPath: "cases/ash-cartographer/opening-pass.md",
      nextAction: "Log benchmark gap notes and isolate one sharper opening claim.",
      sceneSeed:
        "The cartographer arrives in a city that catalogues ash as if it were scripture, and realizes the map is reading him back.",
      statusNote: "New intake awaiting first comparison against the benchmark stack.",
    },
    {
      id: "salt-archive",
      title: "Salt Archive",
      cycle: 2,
      focus: "Re-enter benchmark after a reveal pass to test whether the ending now earns the setup.",
      owner: "Codex Agent",
      benchmarkSet: "benchmark/reveal-payoff-matrix",
      experimentId: "BR-011",
      score: 81,
      delta: 4,
      updatedAt: "19 min ago",
      artifactPath: "loop/salt-archive/re-entry-notes.md",
      nextAction: "Measure whether the payoff lands sooner without flattening the mystery curve.",
      sceneSeed:
        "A salt conservator opens a ledger that has been recording future disappearances before they happen.",
      statusNote: "Returned from complete and ready for another measured pass.",
    },
  ],
  hypothesis: [
    {
      id: "monsoon-cipher",
      title: "Monsoon Cipher",
      cycle: 1,
      focus: "Test whether the betrayal lands harder if the warm domestic scene turns colder two beats earlier.",
      owner: "Setavya",
      benchmarkSet: "rubrics/tension-gradient",
      experimentId: "HD-022",
      score: 78,
      delta: 6,
      updatedAt: "8 min ago",
      artifactPath: "rubrics/monsoon-cipher/tension-pass.md",
      nextAction: "Move the coded lie into beat two and keep the emotional cost legible.",
      sceneSeed:
        "Monsoon rain drowns the courtyard while the cipherist smiles through a conversation that has already become a trap.",
      statusNote: "Direction drafted and waiting for a concrete page-level pass.",
    },
  ],
  work: [
    {
      id: "clockwork-orchard",
      title: "Clockwork Orchard",
      cycle: 3,
      focus: "Rewrite the scene spine so every beat cashes the new direction instead of repeating the old one.",
      owner: "Narrative Loop",
      benchmarkSet: "loop/chapter-spine-pass",
      experimentId: "WO-031",
      score: 84,
      delta: 9,
      updatedAt: "just now",
      artifactPath: "cases/clockwork-orchard/chapter-06-after.md",
      nextAction: "Ship the revised beat ladder, then run a benchmark verification pass.",
      sceneSeed:
        "Under the glass canopy, each mechanical fruit opens one tooth at a time as the orchard remembers who planted it.",
      statusNote: "Live pass in progress with the new chapter spine already applied.",
    },
  ],
  complete: [
    {
      id: "glass-tide",
      title: "Glass Tide",
      cycle: 2,
      focus: "Completed a tighter benchmark pass and is ready to feed the next loop.",
      owner: "Codex Agent",
      benchmarkSet: "benchmark/ending-pressure",
      experimentId: "CP-019",
      score: 88,
      delta: 12,
      updatedAt: "42 min ago",
      artifactPath: "cases/glass-tide/final-pass-summary.md",
      nextAction: "Re-enter benchmark to confirm the stronger ending does not weaken the chapter handoff.",
      sceneSeed:
        "The tide hardens into mirror-bright shelves while the harbor decides which memory it is willing to keep.",
      statusNote: "Pass shipped. Waiting to loop back through benchmark.",
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

const REPO_COLLECTIONS = [
  { label: "benchmark", count: "12 sets", detail: "comparison stacks and target chapters" },
  { label: "rubrics", count: "8 scores", detail: "rewrite ladders and pass criteria" },
  { label: "loop", count: "17 logs", detail: "iteration contracts and experiment notes" },
  { label: "cases", count: "9 proofs", detail: "before/after evidence for the pass" },
  { label: "memo", count: "3 docs", detail: "thesis, framing, and roadmap notes" },
]

function cloneBoard(board: BoardState): BoardState {
  return {
    benchmark: [...board.benchmark],
    hypothesis: [...board.hypothesis],
    work: [...board.work],
    complete: [...board.complete],
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function createNovel(title: string): NovelCard {
  const suffix = `${Date.now()}`.slice(-4)
  const slug = slugify(title)

  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `novel-${Date.now()}`,
    title,
    cycle: 1,
    focus: "Fresh entry. Benchmark it before locking the next hypothesis.",
    owner: "You",
    benchmarkSet: "benchmark/new-intake",
    experimentId: `BR-${suffix}`,
    score: 70,
    delta: 0,
    updatedAt: "just now",
    artifactPath: `cases/${slug || "new-novel"}/intake.md`,
    nextAction: "Capture the benchmark gap and convert it into one narrow direction.",
    sceneSeed:
      "A newly entered draft is waiting for its first serious comparison against the benchmark shelf.",
    statusNote: "New intake created from the board UI.",
  }
}

function moveToStage(novel: NovelCard, stage: Stage): NovelCard {
  if (stage === "benchmark") {
    const scoreBump = novel.delta > 0 ? Math.max(1, Math.round(novel.delta / 3)) : 2
    return {
      ...novel,
      cycle: novel.cycle + 1,
      score: Math.min(99, novel.score + scoreBump),
      delta: Math.min(18, novel.delta + 2),
      updatedAt: "just now",
      benchmarkSet: "benchmark/re-entry-check",
      nextAction: "Verify that the shipped pass survives a fresh benchmark comparison.",
      statusNote: "Returned from complete. Ready for another measured pass.",
    }
  }

  if (stage === "hypothesis") {
    return {
      ...novel,
      updatedAt: "just now",
      nextAction: "Lock the next hypothesis before touching the prose again.",
      statusNote: "Benchmark gaps captured. Direction drafted for the next pass.",
    }
  }

  if (stage === "work") {
    return {
      ...novel,
      updatedAt: "just now",
      nextAction: "Rewrite the active scene with the chosen direction applied.",
      statusNote: "Hypothesis approved. Work pass opened.",
    }
  }

  return {
    ...novel,
    updatedAt: "just now",
    score: Math.min(99, novel.score + 2),
    delta: Math.min(18, novel.delta + 1),
    nextAction: "Hold here for verification, then re-enter benchmark.",
    statusNote: "Work pass landed and is ready for loop verification.",
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
    nextBoard.hypothesis.push(moveToStage(leavingBenchmark, "hypothesis"))
  }

  if (leavingHypothesis) {
    movedIds.push(leavingHypothesis.id)
    nextBoard.work.push(moveToStage(leavingHypothesis, "work"))
  }

  if (leavingWork) {
    movedIds.push(leavingWork.id)
    nextBoard.complete.push(moveToStage(leavingWork, "complete"))
  }

  if (leavingComplete) {
    movedIds.push(leavingComplete.id)
    nextBoard.benchmark.push(moveToStage(leavingComplete, "benchmark"))
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

    nextBoard[stage] = lane.flatMap((item) => {
      if (!item || typeof item !== "object") {
        return []
      }

      const card = item as Partial<NovelCard>

      if (
        typeof card.id !== "string" ||
        typeof card.title !== "string" ||
        typeof card.focus !== "string" ||
        typeof card.cycle !== "number"
      ) {
        return []
      }

      return [
        {
          id: card.id,
          title: card.title,
          focus: card.focus,
          cycle: card.cycle,
          owner: typeof card.owner === "string" ? card.owner : "Unknown",
          benchmarkSet:
            typeof card.benchmarkSet === "string" ? card.benchmarkSet : "benchmark/unassigned",
          experimentId: typeof card.experimentId === "string" ? card.experimentId : "BR-0000",
          score: typeof card.score === "number" ? card.score : 70,
          delta: typeof card.delta === "number" ? card.delta : 0,
          updatedAt: typeof card.updatedAt === "string" ? card.updatedAt : "just now",
          artifactPath:
            typeof card.artifactPath === "string" ? card.artifactPath : "cases/untitled/intake.md",
          nextAction:
            typeof card.nextAction === "string"
              ? card.nextAction
              : "Capture the next benchmark gap.",
          sceneSeed:
            typeof card.sceneSeed === "string"
              ? card.sceneSeed
              : "A draft waits for its next pass.",
          statusNote:
            typeof card.statusNote === "string"
              ? card.statusNote
              : "Stored state restored from local workspace.",
        },
      ]
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
    `PROJECT: ${novel.title.toUpperCase()}`,
    `EXPERIMENT: ${novel.experimentId} / ${novel.benchmarkSet}`,
    "",
    `${lead}:`,
    novel.sceneSeed,
    "",
    "SYSTEM:",
    `Current score ${novel.score}/100 (${novel.delta >= 0 ? "+" : ""}${novel.delta} vs previous loop).`,
    `Status note: ${novel.statusNote}`,
    `Next action: ${novel.nextAction}`,
    "",
    "OUTPUT CONTRACT:",
    "Keep the benchmark promise visible.",
    "Choose one measurable creative move.",
    "Preserve enough evidence to justify the next loop.",
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
        <span className="font-mono text-[11px] text-zinc-500">k</span>
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

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-zinc-800/80 py-2 last:border-b-0 last:pb-0">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </span>
      <span className="truncate text-right text-[12px] text-zinc-200">{value}</span>
    </div>
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
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            {meta.short} / {novel.experimentId} / Pass {novel.cycle}
          </p>
        </div>
        <Badge className={cn("shrink-0 font-mono text-[10px]", meta.chip)}>{meta.short}</Badge>
      </div>

      <div className="mt-3 grid gap-2 font-mono text-[10px] text-zinc-500 sm:grid-cols-2">
        <div className="rounded-md border border-zinc-800 bg-[#101014] px-2 py-1.5">
          owner
          <div className="mt-1 text-[11px] text-zinc-300">{novel.owner}</div>
        </div>
        <div className="rounded-md border border-zinc-800 bg-[#101014] px-2 py-1.5">
          score
          <div className="mt-1 text-[11px] text-zinc-300">
            {novel.score}
            <span className="ml-1 text-zinc-500">
              ({novel.delta >= 0 ? "+" : ""}
              {novel.delta})
            </span>
          </div>
        </div>
      </div>

      <p className="mt-3 font-mono text-[11px] leading-5 text-zinc-400">{novel.focus}</p>
      <div className="mt-3 space-y-1.5 font-mono text-[10px] text-zinc-500">
        <p>{novel.benchmarkSet}</p>
        <p>{novel.artifactPath}</p>
      </div>
      <p className="mt-3 text-[11px] text-zinc-500">{stagePrompt(stage, novel)}</p>
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
  const inFlight = board.benchmark.length + board.hypothesis.length + board.work.length
  const workspaceStatus = autoRunning ? "Autosave / live mock mode" : "Manual review mode"
  const activityFeed = useMemo(
    () =>
      activeNovel
        ? [
            `${activeNovel.experimentId} synced to ${activeNovel.artifactPath}`,
            `${STAGE_META[activeStage].label} is the active lane for ${activeNovel.title}.`,
            `Latest score registered at ${activeNovel.score}/100 with ${activeNovel.delta >= 0 ? "+" : ""}${activeNovel.delta} delta.`,
          ]
        : ["Waiting for the next novel to enter the loop."],
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
      <div className="mx-auto h-[100svh] max-w-[1680px] overflow-hidden xl:grid xl:grid-cols-[52px_minmax(0,1fr)]">
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

        <div className="grid h-full min-h-0 grid-rows-[48px_minmax(0,1fr)]">
          <header className="flex items-center justify-between gap-4 border-b border-zinc-800 bg-[#0f0f12] px-4">
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-zinc-100">Novel Loop Workspace</p>
              <p className="mt-1 font-mono text-[11px] text-zinc-500">
                realistic product mockup for benchmark-driven novel iteration
              </p>
            </div>
            <div className="hidden items-center gap-2 lg:flex">
              <Badge className="border-zinc-700 bg-zinc-900 font-mono text-[10px] text-zinc-300">
                team narrative-systems
              </Badge>
              <Badge className="border-zinc-700 bg-zinc-900 font-mono text-[10px] text-zinc-300">
                repo skills/site
              </Badge>
              <Badge className="border-emerald-500/20 bg-emerald-500/10 font-mono text-[10px] text-emerald-200">
                {workspaceStatus}
              </Badge>
            </div>
          </header>

          <div className="min-h-0 overflow-y-auto xl:overflow-hidden xl:grid xl:grid-cols-[1.05fr_1fr_1fr]">
            <WorkspacePanel title="Story Plan" icon={FolderKanban}>
              <PanelBlock title="Workspace">
                <div className="rounded-md border border-zinc-800 bg-[#151519] p-3">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[13px] text-zinc-100">Autoresearch Novel Loop</p>
                      <p className="mt-1 font-mono text-[11px] text-zinc-500">
                        {"benchmark -> hypothesis -> work -> complete -> benchmark"}
                      </p>
                    </div>
                    <Badge className="border-zinc-700 bg-zinc-900 font-mono text-[10px] text-zinc-300">
                      mock build
                    </Badge>
                  </div>
                  <DataRow label="lead" value="Setavya" />
                  <DataRow label="co-pilot" value="Codex Agent" />
                  <DataRow label="active lane" value={STAGE_META[activeStage].label} />
                  <DataRow label="loops" value={`${loopsRun} completed`} />
                </div>
              </PanelBlock>

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
                      Reset Demo
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

              <PanelBlock title="Tracked Collections" dense>
                <div className="space-y-1.5">
                  {REPO_COLLECTIONS.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-md border border-zinc-800 bg-[#121216] px-3 py-2"
                    >
                      <div>
                        <p className="font-mono text-[11px] text-zinc-200">{item.label}</p>
                        <p className="mt-1 text-[11px] text-zinc-500">{item.detail}</p>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500">{item.count}</span>
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
                      Step Once
                    </Button>
                  </div>
                </div>
              </PanelBlock>

              <PanelBlock title="Active Experiment Brief">
                <div className="rounded-md border border-zinc-800 bg-[#151519] p-3">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[13px] text-zinc-100">
                        {activeNovel ? activeNovel.title : "No active novel"}
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-zinc-500">
                        {activeNovel
                          ? `${activeNovel.experimentId} / ${STAGE_META[activeStage].label}`
                          : "Waiting for a draft"}
                      </p>
                    </div>
                    <Badge className={cn("font-mono text-[10px]", STAGE_META[activeStage].chip)}>
                      {STAGE_META[activeStage].short}
                    </Badge>
                  </div>

                  <DataRow label="benchmark_set" value={activeNovel?.benchmarkSet ?? "n/a"} />
                  <DataRow label="owner" value={activeNovel?.owner ?? "n/a"} />
                  <DataRow label="score" value={activeNovel ? `${activeNovel.score}/100` : "n/a"} />
                  <DataRow
                    label="updated"
                    value={activeNovel?.updatedAt ?? "n/a"}
                  />
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

              <PanelBlock title="Pass Checklist" dense>
                <div className="space-y-2 font-mono text-[11px]">
                  {[
                    "benchmark gap captured",
                    "hypothesis narrowed to one change",
                    "rewrite pass linked in cases/",
                    "verification ready for next benchmark",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-md border border-zinc-800 bg-[#121216] px-3 py-2 text-zinc-400"
                    >
                      <span>{item}</span>
                      <span className={cn(index < 2 ? "text-zinc-300" : "text-zinc-600")}>
                        {index < 2 ? "done" : "queued"}
                      </span>
                    </div>
                  ))}
                </div>
              </PanelBlock>
            </WorkspacePanel>

            <WorkspacePanel title="Script" icon={FileText}>
              <PanelBlock title="Live Preview">
                <div className="space-y-3">
                  <div className="overflow-hidden rounded-md border border-zinc-800 bg-[#18181d]">
                    <div className="relative h-44 bg-[radial-gradient(circle_at_35%_20%,rgba(174,255,139,0.18),transparent_25%),radial-gradient(circle_at_72%_28%,rgba(165,235,255,0.12),transparent_22%),linear-gradient(180deg,rgba(49,79,55,0.95),rgba(12,16,15,0.98))]">
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/8 bg-black/35 px-3 py-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-200">
                          preview frame
                        </span>
                        <span className="font-mono text-[10px] text-zinc-400">
                          {activeNovel?.experimentId ?? "no-experiment"}
                        </span>
                      </div>
                    </div>
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

                    <div className="space-y-2 font-mono text-[11px] leading-5 text-zinc-300">
                      {scriptLines.map((line, index) => (
                        <p key={`${line}-${index}`} className={cn(!line && "h-2")}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </PanelBlock>

              <PanelBlock title="Artifacts">
                <div className="space-y-2">
                  {activeNovel ? (
                    [activeNovel.artifactPath, activeNovel.benchmarkSet, `loop/${activeNovel.title.toLowerCase().replace(/\s+/g, "-")}/log.md`].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-md border border-zinc-800 bg-[#121216] px-3 py-2"
                      >
                        <span className="font-mono text-[11px] text-zinc-400">{item}</span>
                        <span className="text-[11px] text-zinc-600">open</span>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-md border border-dashed border-zinc-800 bg-[#121216] p-3 font-mono text-[11px] text-zinc-500">
                      Artifacts will appear here when a novel is active.
                    </div>
                  )}
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

              <PanelBlock title="Activity Feed" dense>
                <div className="space-y-2">
                  {activityFeed.map((item) => (
                    <div
                      key={item}
                      className="rounded-md border border-zinc-800 bg-[#121216] px-3 py-2 font-mono text-[11px] text-zinc-500"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </PanelBlock>
            </WorkspacePanel>
          </div>
        </div>
      </div>
    </div>
  )
}
