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

type LocatedNovel = {
  novel: NovelCard
  stage: Stage
}

type PanelPriority = "standard" | "elevated" | "critical"

type DataRowVariant = "default" | "metric" | "stage" | "emphasis"

const STORAGE_KEY = "skills-novel-loop-board"
const AUTO_TICK_MS = 4200
const STAGES: Stage[] = ["benchmark", "hypothesis", "work", "complete"]

const textStyles = {
  display:
    "text-2xl leading-tight font-semibold tracking-[-0.02em] text-zinc-50 xl:text-[2rem]",
  title: "text-lg font-semibold leading-tight text-zinc-50 xl:text-xl",
  section: "text-[15px] font-semibold text-zinc-100 xl:text-base",
  body: "text-sm leading-6 text-zinc-300",
  strongBody: "text-[15px] font-medium leading-6 text-zinc-200",
  action: "text-base font-medium leading-7 text-zinc-100 xl:text-lg",
  cardTitle: "text-[15px] font-semibold leading-tight text-zinc-50",
  cardTitleActive: "text-lg font-semibold leading-tight text-zinc-50 xl:text-xl",
  meta: "font-mono text-[11px] text-zinc-500",
  metaStrong: "font-mono text-[11px] text-zinc-400",
  label:
    "font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500",
  smallLabel:
    "font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600",
  metric: "text-2xl font-semibold leading-none text-zinc-50 xl:text-[2rem]",
  badge: "font-mono text-[10px]",
}

const STAGE_META = {
  benchmark: {
    icon: BookOpen,
    label: "Benchmark",
    short: "BR",
    subtitle: "Measure the draft against the benchmark stack before deciding the next move.",
    chip: "border-zinc-600 bg-zinc-800 text-zinc-100",
    highlight: "from-zinc-800/80 to-zinc-900/50",
    actionLabel: "Send To Hypothesis",
    actionReason: "Benchmark gaps are clear enough to convert into one direction.",
  },
  hypothesis: {
    icon: Compass,
    label: "Hypothesis / Direction",
    short: "HD",
    subtitle: "Choose the smallest high-leverage creative bet before touching pages.",
    chip: "border-sky-500/30 bg-sky-500/10 text-sky-200",
    highlight: "from-sky-500/10 to-zinc-950/30",
    actionLabel: "Start Work Pass",
    actionReason: "The direction is concrete enough to become an actual rewrite pass.",
  },
  work: {
    icon: Wrench,
    label: "Work Upon It",
    short: "WO",
    subtitle: "Turn the direction into scene-level changes, then capture proof.",
    chip: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    highlight: "from-emerald-500/10 to-zinc-950/30",
    actionLabel: "Mark Complete",
    actionReason: "The pass has landed and is ready for verification.",
  },
  complete: {
    icon: Check,
    label: "Complete",
    short: "CP",
    subtitle: "Ship the pass, preserve the evidence, then re-benchmark the result.",
    chip: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    highlight: "from-amber-500/10 to-zinc-950/30",
    actionLabel: "Re-benchmark",
    actionReason: "The shipped pass should survive another fresh comparison.",
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
      benchmarkSet: "benchmarks/cards/opening-hook-v2",
      experimentId: "BR-014",
      score: 73,
      delta: 0,
      updatedAt: "3 min ago",
      artifactPath: "projects/ash-cartographer/loops/2026-04-17-baseline/baseline/benchmark-report.md",
      nextAction: "Capture the single biggest opening gap and turn it into one clear direction.",
      sceneSeed:
        "The cartographer arrives in a city that catalogues ash as if it were scripture and realizes the map is reading him back.",
      statusNote: "New intake awaiting first comparison against the benchmark stack.",
    },
    {
      id: "salt-archive",
      title: "Salt Archive",
      cycle: 2,
      focus: "Re-enter benchmark after the reveal pass to test whether the ending now earns the setup.",
      owner: "Codex Agent",
      benchmarkSet: "benchmarks/cards/reveal-payoff-matrix",
      experimentId: "BR-011",
      score: 81,
      delta: 4,
      updatedAt: "19 min ago",
      artifactPath: "projects/salt-archive/loops/2026-04-17-reveal-pass/summary.md",
      nextAction: "Verify that the stronger reveal lands earlier without flattening the mystery curve.",
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
      benchmarkSet: "benchmarks/rubrics/tension-gradient",
      experimentId: "HD-022",
      score: 78,
      delta: 6,
      updatedAt: "8 min ago",
      artifactPath: "projects/monsoon-cipher/benchmarks/profiles/active-benchmark.md",
      nextAction: "Move the coded lie into beat two and preserve the emotional cost on the page.",
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
      benchmarkSet: "loops/presets/default-webserial.yaml",
      experimentId: "WO-031",
      score: 84,
      delta: 9,
      updatedAt: "just now",
      artifactPath: "projects/clockwork-orchard/loops/2026-04-17-chapter-spine/variants/v3-scene-spine/delta.md",
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
      benchmarkSet: "benchmarks/cards/ending-pressure",
      experimentId: "CP-019",
      score: 88,
      delta: 12,
      updatedAt: "42 min ago",
      artifactPath: "evaluations/cases/glass-tide/final-pass-summary.md",
      nextAction: "Re-enter benchmark to confirm the stronger ending does not weaken the chapter handoff.",
      sceneSeed:
        "The tide hardens into mirror-bright shelves while the harbor decides which memory it is willing to keep.",
      statusNote: "Pass shipped. Waiting to loop back through benchmark.",
    },
  ],
}

const REPO_COLLECTIONS = [
  { label: "benchmarks", count: "cards + rubrics", detail: "comparison stacks, scoring rules, and target units" },
  { label: "loops", count: "presets + contracts", detail: "default runs, candidate slots, and logging templates" },
  { label: "projects", count: "story workspaces", detail: "source drafts, state files, and recorded loop history" },
  { label: "evaluations", count: "cases + reviews", detail: "before/after proof and skill-value tracking" },
  { label: "catalog", count: "1 registry", detail: "plugin, loop, and validation status per skill" },
]

const LEFT_RAIL_ITEMS = [
  { icon: FolderKanban, label: "Board", active: true },
  { icon: BookOpen, label: "Story" },
  { icon: PencilLine, label: "Plan" },
  { icon: ScrollText, label: "Script" },
  { icon: Bot, label: "Assist" },
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

function findDefaultCard(id: string) {
  for (const stage of STAGES) {
    const match = DEFAULT_BOARD[stage].find((novel) => novel.id === id)
    if (match) {
      return match
    }
  }
  return null
}

function createNovel(title: string): NovelCard {
  const slug = slugify(title) || "new-novel"
  const suffix = `${Date.now()}`.slice(-4)

  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `novel-${Date.now()}`,
    title,
    cycle: 1,
    focus: "Fresh entry. Benchmark it before locking the next hypothesis.",
    owner: "You",
    benchmarkSet: "benchmarks/cards/new-intake",
    experimentId: `BR-${suffix}`,
    score: 70,
    delta: 0,
    updatedAt: "just now",
    artifactPath: `projects/${slug}/loops/intake/baseline/input-snapshot.md`,
    nextAction: "Capture the benchmark gap and convert it into one narrow direction.",
    sceneSeed:
      "A newly entered draft is waiting for its first serious comparison against the benchmark shelf.",
    statusNote: "New intake created from the board UI.",
  }
}

function hydrateNovel(stage: Stage, novel: Partial<NovelCard>) {
  const fallback = (typeof novel.id === "string" && findDefaultCard(novel.id)) || DEFAULT_BOARD[stage][0]

  return {
    id: typeof novel.id === "string" ? novel.id : fallback.id,
    title: typeof novel.title === "string" ? novel.title : fallback.title,
    cycle: typeof novel.cycle === "number" ? novel.cycle : fallback.cycle,
    focus: typeof novel.focus === "string" ? novel.focus : fallback.focus,
    owner: typeof novel.owner === "string" ? novel.owner : fallback.owner,
    benchmarkSet:
      typeof novel.benchmarkSet === "string" ? novel.benchmarkSet : fallback.benchmarkSet,
    experimentId:
      typeof novel.experimentId === "string" ? novel.experimentId : fallback.experimentId,
    score: typeof novel.score === "number" ? novel.score : fallback.score,
    delta: typeof novel.delta === "number" ? novel.delta : fallback.delta,
    updatedAt: typeof novel.updatedAt === "string" ? novel.updatedAt : fallback.updatedAt,
    artifactPath:
      typeof novel.artifactPath === "string" ? novel.artifactPath : fallback.artifactPath,
    nextAction:
      typeof novel.nextAction === "string" ? novel.nextAction : fallback.nextAction,
    sceneSeed:
      typeof novel.sceneSeed === "string" ? novel.sceneSeed : fallback.sceneSeed,
    statusNote:
      typeof novel.statusNote === "string" ? novel.statusNote : fallback.statusNote,
  }
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

      return [hydrateNovel(stage, card)]
    })
  }

  return nextBoard
}

function findLocatedNovel(board: BoardState, selectedId: string | null): LocatedNovel | null {
  if (!selectedId) {
    return null
  }

  for (const stage of STAGES) {
    const novel = board[stage].find((entry) => entry.id === selectedId)
    if (novel) {
      return { novel, stage }
    }
  }

  return null
}

function firstAvailableNovel(board: BoardState): LocatedNovel | null {
  const orderedStages: Stage[] = ["work", "hypothesis", "benchmark", "complete"]

  for (const stage of orderedStages) {
    const novel = board[stage][0]
    if (novel) {
      return { novel, stage }
    }
  }

  return null
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

function nextStage(stage: Stage): Stage {
  if (stage === "benchmark") return "hypothesis"
  if (stage === "hypothesis") return "work"
  if (stage === "work") return "complete"
  return "benchmark"
}

function buildMoveReason(from: Stage, to: Stage, novel: NovelCard) {
  if (from === "complete" && to === "benchmark") {
    return `${novel.title} re-entered benchmark so the shipped pass can be verified against the benchmark set.`
  }

  return `${novel.title} moved from ${STAGE_META[from].label} to ${STAGE_META[to].label} because ${STAGE_META[from].actionReason.toLowerCase()}`
}

function moveToStage(novel: NovelCard, destination: Stage): NovelCard {
  if (destination === "benchmark") {
    const scoreBump = novel.delta > 0 ? Math.max(1, Math.round(novel.delta / 3)) : 2
    return {
      ...novel,
      cycle: novel.cycle + 1,
      score: Math.min(99, novel.score + scoreBump),
      delta: Math.min(18, novel.delta + 2),
      updatedAt: "just now",
      benchmarkSet: "benchmarks/cards/re-entry-check",
      nextAction: "Verify that the shipped pass survives a fresh benchmark comparison.",
      statusNote: "Returned from complete. Ready for another measured pass.",
    }
  }

  if (destination === "hypothesis") {
    return {
      ...novel,
      updatedAt: "just now",
      nextAction: "Lock the next hypothesis before touching the prose again.",
      statusNote: "Benchmark gaps captured. Direction drafted for the next pass.",
    }
  }

  if (destination === "work") {
    return {
      ...novel,
      updatedAt: "just now",
      score: Math.min(99, novel.score + 2),
      delta: Math.min(18, novel.delta + 2),
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

  return {
    nextBoard,
    movedIds,
    note: movedIds.length
      ? "Auto cycle advanced one novel in each occupied lane."
      : "Auto cycle found no novels to move.",
  }
}

function advanceSelectedNovel(board: BoardState, selectedId: string) {
  const current = findLocatedNovel(board, selectedId)
  if (!current) {
    return { nextBoard: board, note: "No selected novel was available to move." }
  }

  const destination = nextStage(current.stage)
  const nextBoard = cloneBoard(board)
  nextBoard[current.stage] = nextBoard[current.stage].filter((novel) => novel.id !== selectedId)
  nextBoard[destination].push(moveToStage(current.novel, destination))

  return {
    nextBoard,
    note: buildMoveReason(current.stage, destination, current.novel),
  }
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
  emphasis = false,
}: {
  title: string
  icon: typeof FolderKanban
  children: ReactNode
  emphasis?: boolean
}) {
  return (
    <section className="flex min-h-[640px] flex-col border-t border-zinc-800 bg-[#111113] xl:min-h-0 xl:border-t-0 xl:border-l">
      <header className="flex h-12 items-center justify-between border-b border-zinc-800 px-4">
        <div
          className={cn(
            "flex items-center gap-2",
            emphasis ? textStyles.section : "text-[13px] font-medium text-zinc-100"
          )}
        >
          <Icon className={cn("size-3.5 text-zinc-400", emphasis && "text-zinc-200")} />
          <span>{title}</span>
        </div>
        <span className={textStyles.meta}>k</span>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </section>
  )
}

function PanelBlock({
  title,
  children,
  action,
  priority = "standard",
}: {
  title: string
  children: ReactNode
  action?: ReactNode
  priority?: PanelPriority
}) {
  return (
    <section
      className={cn(
        "border-b border-zinc-800 px-4 py-4",
        priority === "elevated" && "py-5",
        priority === "critical" && "py-6"
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3
          className={cn(
            textStyles.section,
            priority === "elevated" && "text-base xl:text-lg",
            priority === "critical" && "text-lg xl:text-xl text-zinc-50"
          )}
        >
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  )
}

function DataRow({
  label,
  value,
  variant = "default",
}: {
  label: string
  value: string
  variant?: DataRowVariant
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-zinc-800/80 py-2 last:border-b-0 last:pb-0">
      <span className={textStyles.label}>{label}</span>
      <span
        className={cn(
          "truncate text-right text-[13px] text-zinc-200",
          variant === "metric" && "text-base font-semibold text-zinc-50",
          variant === "stage" && "text-sm font-medium text-zinc-100",
          variant === "emphasis" && "text-sm font-medium text-zinc-100"
        )}
      >
        {value}
      </span>
    </div>
  )
}

function MetricCard({
  label,
  value,
  tone = "default",
  sublabel,
}: {
  label: string
  value: string
  tone?: "default" | "positive"
  sublabel: string
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#151519] p-4">
      <p className={textStyles.label}>{label}</p>
      <p
        className={cn(
          textStyles.metric,
          tone === "positive" && "text-emerald-300"
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-sm text-zinc-400">{sublabel}</p>
    </div>
  )
}

function LaneCard({
  novel,
  stage,
  isMoved,
  selected = false,
  onSelect,
}: {
  novel: NovelCard
  stage: Stage
  isMoved: boolean
  selected?: boolean
  onSelect?: () => void
}) {
  const meta = STAGE_META[stage]

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl border bg-[#141418] p-4 text-left transition-all duration-300",
        "border-zinc-800 hover:border-zinc-700 hover:bg-[#17171c]",
        selected && "border-zinc-500 bg-[#17171d] shadow-[0_0_0_1px_rgba(161,161,170,0.24)]",
        isMoved && "shadow-[0_0_0_1px_rgba(161,161,170,0.3)]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={cn(selected ? textStyles.cardTitleActive : textStyles.cardTitle)}>
            {novel.title}
          </p>
          <p className={cn("mt-1", textStyles.meta)}>
            {novel.experimentId} / pass {novel.cycle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selected ? (
            <span className="rounded-full border border-zinc-700 px-2 py-0.5 font-mono text-[10px] text-zinc-200">
              current
            </span>
          ) : null}
          <Badge className={cn(textStyles.badge, meta.chip, selected && "px-2.5 py-1")}>
            {meta.short}
          </Badge>
        </div>
      </div>

      <p className={cn("mt-3", selected ? textStyles.strongBody : "text-sm leading-6 text-zinc-300")}>
        {novel.focus}
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 bg-[#101014] px-3 py-2">
          <p className={textStyles.smallLabel}>owner</p>
          <p className="mt-1 text-sm text-zinc-200">{novel.owner}</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-[#101014] px-3 py-2">
          <p className={textStyles.smallLabel}>score</p>
          <p className="mt-1 text-sm font-medium text-zinc-50">
            {novel.score}
            <span className={cn("ml-1", novel.delta >= 0 ? "text-emerald-300" : "text-amber-300")}>
              ({novel.delta >= 0 ? "+" : ""}
              {novel.delta})
            </span>
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <p className={textStyles.metaStrong}>{novel.benchmarkSet}</p>
        <p className="truncate font-mono text-[11px] text-zinc-600">{novel.artifactPath}</p>
      </div>

      {selected ? (
        <div className="mt-4 rounded-lg border border-zinc-700 bg-zinc-900/70 p-3">
          <p className={textStyles.label}>next action</p>
          <p className="mt-2 text-sm font-medium leading-6 text-zinc-100">{novel.nextAction}</p>
        </div>
      ) : null}
    </button>
  )
}

export default function KanbanCycleBoard() {
  const [board, setBoard] = useState<BoardState>(DEFAULT_BOARD)
  const [draftTitle, setDraftTitle] = useState("")
  const [autoRunning, setAutoRunning] = useState(true)
  const [movedIds, setMovedIds] = useState<string[]>([])
  const [lastTickAt, setLastTickAt] = useState(0)
  const [clockNow, setClockNow] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(() => DEFAULT_BOARD.work[0]?.id ?? null)
  const [lastMoveNote, setLastMoveNote] = useState(
    "Select a novel and move it through the loop to record a polished product demo."
  )

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const normalized = normalizeBoard(parsed)

        if (normalized) {
          setBoard(normalized)
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY)
      }
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

  const selected = useMemo(
    () => findLocatedNovel(board, selectedId) ?? firstAvailableNovel(board),
    [board, selectedId]
  )

  useEffect(() => {
    if (selected && selected.novel.id !== selectedId) {
      setSelectedId(selected.novel.id)
    }
  }, [selected, selectedId])

  const cycleBoard = useEffectEvent(() => {
    setBoard((currentBoard) => {
      const { nextBoard, movedIds: moved, note } = rotateBoard(currentBoard)
      setMovedIds(moved)
      setLastTickAt(Date.now())
      setLastMoveNote(note)
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
  const inFlight = board.benchmark.length + board.hypothesis.length + board.work.length
  const activeStage = selected?.stage ?? "benchmark"
  const activeNovel = selected?.novel ?? null
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

    const created = createNovel(title)
    setBoard((currentBoard) => ({
      ...currentBoard,
      benchmark: [created, ...currentBoard.benchmark],
    }))
    setSelectedId(created.id)
    setDraftTitle("")
    setLastMoveNote(`${created.title} was added to Benchmark and is ready for its first measured pass.`)
  }

  function handleReset() {
    setBoard(DEFAULT_BOARD)
    setMovedIds([])
    setSelectedId(DEFAULT_BOARD.work[0]?.id ?? DEFAULT_BOARD.benchmark[0]?.id ?? null)
    setLastMoveNote("Demo state reset. The active work pass is ready for recording.")
    const now = Date.now()
    setLastTickAt(now)
    setClockNow(now)
  }

  function handleAdvanceSelected() {
    if (!activeNovel) {
      return
    }

    setBoard((currentBoard) => {
      const { nextBoard, note } = advanceSelectedNovel(currentBoard, activeNovel.id)
      setMovedIds([activeNovel.id])
      setLastMoveNote(note)
      setLastTickAt(Date.now())
      return nextBoard
    })
  }

  const stageCount = activeStage ? board[activeStage].length : 0
  const primaryActionLabel = activeNovel ? STAGE_META[activeStage].actionLabel : "Advance"
  const activityFeed = activeNovel
    ? [
        `${activeNovel.experimentId} synced to ${activeNovel.artifactPath}`,
        `${STAGE_META[activeStage].label} is the active lane for ${activeNovel.title}.`,
        `Latest score registered at ${activeNovel.score}/100 with ${activeNovel.delta >= 0 ? "+" : ""}${activeNovel.delta} delta.`,
      ]
    : ["Waiting for the next novel to enter the loop."]

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
              <p className={cn("mt-1", textStyles.meta)}>
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
                {autoRunning ? "autosave / live mode" : "manual review mode"}
              </Badge>
            </div>
          </header>

          <div className="min-h-0 overflow-y-auto xl:overflow-hidden xl:grid xl:grid-cols-[0.9fr_1.15fr_0.95fr]">
            <WorkspacePanel title="Story Plan" icon={FolderKanban}>
              <PanelBlock title="Workspace">
                <div className="rounded-xl border border-zinc-800 bg-[#151519] p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className={textStyles.section}>Autoresearch Novel Loop</p>
                      <p className={cn("mt-1", textStyles.meta)}>
                        {"benchmark -> hypothesis -> work -> complete -> benchmark"}
                      </p>
                    </div>
                    <Badge className="border-zinc-700 bg-zinc-900 font-mono text-[10px] text-zinc-300">
                      mock build
                    </Badge>
                  </div>
                  <DataRow label="lead" value="Setavya" />
                  <DataRow label="co-pilot" value="Codex Agent" />
                  <DataRow label="active stage" value={STAGE_META[activeStage].label} variant="stage" />
                  <DataRow label="selected novel" value={activeNovel?.title ?? "n/a"} variant="emphasis" />
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
                    <Button className="h-9 rounded-md bg-zinc-200 px-3 text-[12px] text-zinc-950 hover:bg-white">
                      <Plus className="size-3.5" />
                      Add to Benchmark
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-9 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-[12px] text-zinc-300 hover:bg-zinc-800 hover:text-white"
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
                priority={activeStage === "benchmark" ? "elevated" : "standard"}
                action={<span className={textStyles.meta}>{board.benchmark.length} queued</span>}
              >
                <div className="space-y-3">
                  {board.benchmark.map((novel) => (
                    <LaneCard
                      key={novel.id}
                      novel={novel}
                      stage="benchmark"
                      isMoved={movedIds.includes(novel.id)}
                      selected={selectedId === novel.id}
                      onSelect={() => setSelectedId(novel.id)}
                    />
                  ))}
                </div>
              </PanelBlock>

              <PanelBlock title="Tracked Collections">
                <div className="space-y-2">
                  {REPO_COLLECTIONS.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-zinc-800 bg-[#121216] px-3 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-zinc-200">{item.label}</p>
                        <span className={textStyles.meta}>{item.count}</span>
                      </div>
                      <p className="mt-2 text-sm text-zinc-500">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </PanelBlock>
            </WorkspacePanel>

            <WorkspacePanel title="Beat Plan" icon={PencilLine} emphasis>
              <PanelBlock
                title="Active Experiment"
                priority="critical"
                action={
                  activeNovel ? (
                    <Badge className={cn(textStyles.badge, STAGE_META[activeStage].chip)}>
                      {STAGE_META[activeStage].short}
                    </Badge>
                  ) : null
                }
              >
                {activeNovel ? (
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <p className={textStyles.label}>current stage</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge className={cn("px-2.5 py-1", STAGE_META[activeStage].chip, textStyles.badge)}>
                          {STAGE_META[activeStage].label}
                        </Badge>
                        <span className={textStyles.body}>{STAGE_META[activeStage].subtitle}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h2 className={textStyles.display}>{activeNovel.title}</h2>
                      <p className={textStyles.strongBody}>{activeNovel.focus}</p>
                    </div>

                    <div
                      className={cn(
                        "rounded-2xl border border-zinc-700 bg-gradient-to-br p-5",
                        STAGE_META[activeStage].highlight
                      )}
                    >
                      <p className={textStyles.label}>next action</p>
                      <p className={cn("mt-3", textStyles.action)}>{activeNovel.nextAction}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          className="h-10 rounded-md bg-zinc-100 px-4 text-sm text-zinc-950 hover:bg-white"
                          onClick={handleAdvanceSelected}
                        >
                          <ArrowRight className="size-4" />
                          {primaryActionLabel}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-10 rounded-md border border-zinc-700 bg-zinc-900 px-4 text-sm text-zinc-200 hover:bg-zinc-800 hover:text-white"
                          onClick={() => cycleBoard()}
                        >
                          Step Entire Loop
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      <MetricCard
                        label="current score"
                        value={`${activeNovel.score}/100`}
                        sublabel="Latest measured quality score."
                      />
                      <MetricCard
                        label="score delta"
                        value={`${activeNovel.delta >= 0 ? "+" : ""}${activeNovel.delta}`}
                        tone={activeNovel.delta >= 0 ? "positive" : "default"}
                        sublabel="Change since the previous loop."
                      />
                      <MetricCard
                        label="lane load"
                        value={`${stageCount}`}
                        sublabel="Novels currently in this stage."
                      />
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-[#151519] p-4">
                      <p className={textStyles.label}>why this moved</p>
                      <p className={cn("mt-2", textStyles.body)}>{lastMoveNote}</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-zinc-800 bg-[#121216] p-4 text-sm text-zinc-500">
                    No active novel is selected yet.
                  </div>
                )}
              </PanelBlock>

              <PanelBlock title="Cycle Controls" priority="elevated">
                <div className="rounded-xl border border-zinc-800 bg-[#151519] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className={textStyles.section}>
                        {autoRunning ? "Auto cycle active" : "Auto cycle paused"}
                      </p>
                      <p className={cn("mt-1", textStyles.meta)}>
                        one timed handoff every {Math.round(AUTO_TICK_MS / 100) / 10}s
                      </p>
                    </div>
                    <Badge className="border-zinc-700 bg-zinc-900 font-mono text-[10px] text-zinc-300">
                      live demo
                    </Badge>
                  </div>

                  <Progress
                    value={progressValue}
                    className="mt-4 h-1.5 bg-zinc-800 [&_[data-slot=progress-indicator]]:bg-zinc-200"
                  />

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      className="h-9 rounded-md bg-zinc-200 px-3 text-[12px] text-zinc-950 hover:bg-white"
                      onClick={() => setAutoRunning((running) => !running)}
                    >
                      {autoRunning ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                      {autoRunning ? "Pause Auto Cycle" : "Resume Auto Cycle"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-9 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-[12px] text-zinc-300 hover:bg-zinc-800 hover:text-white"
                      onClick={handleReset}
                    >
                      <RotateCcw className="size-3.5" />
                      Restore Demo State
                    </Button>
                  </div>
                </div>
              </PanelBlock>

              <PanelBlock
                title="Current Lane Queue"
                priority="elevated"
                action={<span className={textStyles.meta}>{stageCount} active</span>}
              >
                <div className="space-y-3">
                  {board[activeStage].map((novel) => (
                    <LaneCard
                      key={novel.id}
                      novel={novel}
                      stage={activeStage}
                      isMoved={movedIds.includes(novel.id)}
                      selected={selectedId === novel.id}
                      onSelect={() => setSelectedId(novel.id)}
                    />
                  ))}
                </div>
              </PanelBlock>
            </WorkspacePanel>

            <WorkspacePanel title="Script" icon={FileText}>
              <PanelBlock title="Live Preview" priority="elevated">
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#18181d]">
                    <div className="relative h-44 bg-[radial-gradient(circle_at_35%_20%,rgba(174,255,139,0.18),transparent_25%),radial-gradient(circle_at_72%_28%,rgba(165,235,255,0.12),transparent_22%),linear-gradient(180deg,rgba(49,79,55,0.95),rgba(12,16,15,0.98))]">
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/8 bg-black/35 px-3 py-2">
                        <span className={textStyles.label}>preview frame</span>
                        <span className={textStyles.meta}>{activeNovel?.experimentId ?? "no-experiment"}</span>
                      </div>
                    </div>
                  </div>

                  {activeNovel ? (
                    <div className="rounded-xl border border-zinc-800 bg-[#131318] p-4">
                      <div className="space-y-2">
                        <p className={textStyles.display}>{activeNovel.title}</p>
                        <p className={textStyles.strongBody}>{activeNovel.statusNote}</p>
                        <p className={cn(textStyles.metaStrong, "truncate")}>
                          {activeNovel.experimentId} / {activeNovel.benchmarkSet}
                        </p>
                      </div>

                      <div className="mt-4 rounded-xl border border-zinc-700 bg-zinc-900/70 p-4">
                        <p className={textStyles.label}>next action</p>
                        <p className={cn("mt-2", textStyles.action)}>{activeNovel.nextAction}</p>
                      </div>

                      <div className="mt-4 space-y-2 font-mono text-[11px] leading-5 text-zinc-300">
                        {scriptLines.map((line, index) => (
                          <p key={`${line}-${index}`} className={cn(!line && "h-2")}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </PanelBlock>

              <PanelBlock title="Artifacts">
                <div className="space-y-2">
                  {activeNovel ? (
                    [activeNovel.artifactPath, activeNovel.benchmarkSet, `projects/${slugify(activeNovel.title)}/loops/latest/summary.md`].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#121216] px-3 py-3"
                      >
                        <span className="truncate font-mono text-[11px] text-zinc-500">{item}</span>
                        <span className={textStyles.smallLabel}>open</span>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-zinc-800 bg-[#121216] p-4 text-sm text-zinc-500">
                      Artifacts will appear here when a novel is selected.
                    </div>
                  )}
                </div>
              </PanelBlock>

              <PanelBlock title="Proof Of Progress">
                <div className="grid gap-3 sm:grid-cols-2">
                  <MetricCard
                    label="cards on board"
                    value={`${totalCards}`}
                    sublabel="Total novels visible in the loop."
                  />
                  <MetricCard
                    label="loops completed"
                    value={`${loopsRun}`}
                    sublabel="Every full return through benchmark."
                  />
                  <MetricCard
                    label="in flight"
                    value={`${inFlight}`}
                    sublabel="Not yet parked in Complete."
                  />
                  <MetricCard
                    label="active pass"
                    value={activeNovel ? `P${activeNovel.cycle}` : "P0"}
                    sublabel="Current pass number for the selected novel."
                  />
                </div>
              </PanelBlock>

              <PanelBlock title="Activity Feed">
                <div className="space-y-2">
                  {activityFeed.map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-zinc-800 bg-[#121216] px-3 py-3 font-mono text-[11px] text-zinc-500"
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
