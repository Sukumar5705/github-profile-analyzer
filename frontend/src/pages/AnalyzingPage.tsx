/**
 * AnalyzingPage.tsx
 *
 * Full-page "DevIntel Intelligence Engine" loading experience.
 *
 * Navigation flow:
 *   Landing → /analyzing/:username → /dashboard/:username (on success)
 *                                  → error state with Retry / Back to Home
 *
 * Design principles:
 *  - No fake percentages — we can't know exactly where the backend is.
 *  - Rotate through informational status messages while waiting.
 *  - Mark stages only when we have real evidence they are complete
 *    (currently the backend returns one response, so all stages are
 *    "informational waiting states" until success, at which point we
 *    flash them complete before navigating away).
 *  - Reduced-motion support via `prefers-reduced-motion`.
 *  - WCAG contrast and live-region announcements.
 */

import { useEffect, useRef, useState, useCallback } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  GitBranch,
  Database,
  Code2,
  Brain,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  Clock,
  Terminal,
  Loader2,
} from "lucide-react"
import { useAnalysisProgress } from "../hooks/useProfileData"
import { ROUTES } from "../routes/paths"
import { useQueryClient } from "@tanstack/react-query"
import { analyzeProfile } from "../api/github"
import { profileKeys } from "../hooks/useProfileData"
// ─────────────────────────────────────────────────────────────────────────────
// Stage definitions (mapped to the real backend pipeline)
// ─────────────────────────────────────────────────────────────────────────────

interface Stage {
  id: string
  label: string
  shortLabel: string
  icon: React.ElementType
  messages: string[]
}

const STAGES: Stage[] = [
  {
    id: "connect",
    label: "Connecting to GitHub",
    shortLabel: "GitHub connection",
    icon: GitBranch,
    messages: [
      "Validating GitHub username…",
      "Initializing analysis request…",
      "Reaching GitHub API…",
    ],
  },
  {
    id: "fetch",
    label: "Fetching GitHub data",
    shortLabel: "GitHub data",
    icon: Database,
    messages: [
      "Retrieving public profile information…",
      "Paginating through all repositories…",
      "Collecting contributor metadata…",
      "Persisting raw data to database…",
    ],
  },
  {
    id: "analyze",
    label: "Analyzing repositories",
    shortLabel: "Code signals",
    icon: Code2,
    messages: [
      "Examining repository activity and commit signals…",
      "Profiling language distribution across projects…",
      "Fetching README content for top candidates…",
      "Scoring repository quality and diversity…",
      "Selecting representative portfolio samples…",
    ],
  },
  {
    id: "intelligence",
    label: "Building developer intelligence",
    shortLabel: "AI insights",
    icon: Brain,
    messages: [
      "Running AI recruiter evaluation…",
      "Calculating career score and hire decision…",
      "Detecting developer specialization and seniority…",
      "Identifying technical strengths and portfolio gaps…",
      "Generating role-fit and team compatibility scores…",
    ],
  },
  {
    id: "report",
    label: "Preparing your report",
    shortLabel: "Report",
    icon: FileCheck,
    messages: [
      "Persisting intelligence results…",
      "Assembling the results dashboard…",
      "Almost ready — finalizing insights…",
    ],
  },
]

// How many seconds to spend on each stage before advancing (cumulative)
const STAGE_DURATIONS = [4, 10, 18, 28, 38]
// How often to rotate the sub-message within a stage (ms)
const MESSAGE_ROTATE_MS = 3500

/** Map a backend-reported stage id to its index in STAGES */
const STAGE_ID_INDEX: Record<string, number> = Object.fromEntries(
  STAGES.map((s, i) => [s.id, i])
)

/** Derive the current stage index from elapsed time */
function stageFromElapsed(elapsed: number): number {
  const idx = STAGE_DURATIONS.findIndex((d) => elapsed < d)
  return idx === -1 ? STAGES.length - 1 : idx
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatElapsed(seconds: number) {
  if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""}`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m ${s}s` : `${m} minute${m !== 1 ? "s" : ""}`
}

function RotatingMessage({ stage }: { stage: Stage }) {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const msgs = stage.messages
    if (msgs.length <= 1) return
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % msgs.length)
    }, MESSAGE_ROTATE_MS)
    return () => clearInterval(id)
  }, [stage])

  const message = stage.messages[msgIndex] ?? stage.messages[0]

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={stage.id + "-" + msgIndex}
        className="mt-2 text-sm text-[#64748B] text-center min-h-[1.5rem]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </motion.p>
    </AnimatePresence>
  )
}
// One shared in-flight request per username, so StrictMode's double effect run
// (mount → unmount → mount) reuses the same POST instead of sending two.
const inflight = new Map<string, Promise<unknown>>()

function startAnalysis(username: string) {
  const key = username.toLowerCase()
  const existing = inflight.get(key)
  if (existing) return existing

  const p: Promise<unknown> = analyzeProfile(username).finally(() => {
    if (inflight.get(key) === p) inflight.delete(key)
  })
  inflight.set(key, p)
  return p
}

// ─────────────────────────────────────────────────────────────────────────────
// AnalyzingPage
// ─────────────────────────────────────────────────────────────────────────────

export function AnalyzingPage() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()

  // ── Elapsed time ────────────────────────────────────────────────────────
  // Computed from a real clock so we never call setState synchronously in an effect.
  const [elapsed, setElapsed] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const navigateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const queryClient = useQueryClient()

  const [status, setStatus] = useState<"pending" | "success" | "error">("pending")
  const [error, setError] = useState<Error | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [completing, setCompleting] = useState(false)

  const isPending = status === "pending"
  const isError = status === "error"

  // Live backend stage — polled only while the POST is in flight.
  const { data: progress } = useAnalysisProgress(username ?? "", isPending)

  useEffect(() => {
    if (!isPending && !completing) {
      startTimeRef.current = null
      return
    }
    startTimeRef.current = Date.now()
    const id = setInterval(() => {
      if (startTimeRef.current === null) return
      const secs = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setElapsed(secs)
    }, 1000)
    return () => clearInterval(id)
  }, [isPending, completing])

  useEffect(() => {
    return () => {
      if (navigateTimeoutRef.current) clearTimeout(navigateTimeoutRef.current)
    }
  }, [])

  // ── Derived display values (computed during render, no setState in effects) ─
  const liveStageIndex =
    progress?.stage != null ? STAGE_ID_INDEX[progress.stage] : undefined

  const stageIndex = completing
    ? STAGES.length - 1
    : liveStageIndex !== undefined
      ? liveStageIndex
      : stageFromElapsed(elapsed) // fallback until the first poll lands

  // ── Analysis orchestration ─────────────────────────────────────────────
  useEffect(() => {
    if (!username) return
    let cancelled = false

    startAnalysis(username)
      .then(() => {
        if (cancelled) return
        queryClient.invalidateQueries({ queryKey: profileKeys.detail(username) })
        setStatus("success")
        setCompleting(true)
        navigateTimeoutRef.current = setTimeout(() => {
          navigate(ROUTES.dashboard(username), { replace: true })
        }, 900)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err : new Error(String(err)))
        setStatus("error")
      })

    return () => {
      cancelled = true
    }
  }, [username, attempt, navigate, queryClient])

  // ── Retry handler ──────────────────────────────────────────────────────
  const handleRetry = useCallback(() => {
    setError(null)
    setCompleting(false)
    setElapsed(0)
    setStatus("pending")
    setAttempt((a) => a + 1)
  }, [])

  const currentStage = STAGES[stageIndex]
  const StageIcon = currentStage.icon
  const isActive = isPending || completing

  // ── Error state ──────────────────────────────────────────────────────────
  if (isError && !isPending) {
    return (
      <AnalyzingLayout username={username ?? ""}>
        <ErrorState
          username={username ?? ""}
          error={error}
          onRetry={handleRetry}
        />
      </AnalyzingLayout>
    )
  }

  // ── Loading / completing state ───────────────────────────────────────────
  return (
    <AnalyzingLayout username={username ?? ""}>
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 py-8">

        {/* ── Central animated engine icon ──────────────────────────── */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Outer glow */}
          <motion.div
            className="absolute rounded-full"
            style={{ width: 160, height: 160, background: "radial-gradient(ellipse at center, rgba(37,99,235,0.18) 0%, rgba(99,102,241,0.10) 50%, transparent 70%)" }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Rotating ring */}
          <motion.div
            className="absolute rounded-full border-2 border-transparent"
            style={{
              width: 120,
              height: 120,
              borderTopColor: "#2563EB",
              borderRightColor: "rgba(99,102,241,0.4)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          />

          {/* Slower counter-rotating ring */}
          <motion.div
            className="absolute rounded-full border border-transparent"
            style={{
              width: 140,
              height: 140,
              borderTopColor: "rgba(139,92,246,0.5)",
              borderBottomColor: "rgba(37,99,235,0.3)",
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
          />

          {/* Stage icon inside the ring */}
          <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg border border-blue-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStage.id}
                initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6, rotate: 15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <StageIcon className="h-8 w-8 text-[#2563EB]" strokeWidth={1.6} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Stage title ───────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.h2
            key={currentStage.id + "-title"}
            className="text-xl sm:text-2xl font-bold text-[#0F172A] text-center tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {currentStage.label}
          </motion.h2>
        </AnimatePresence>

        {/* ── Sub-message ───────────────────────────────────────────── */}
        {!completing && progress?.message ? (
          <AnimatePresence mode="wait">
            <motion.p
              key={progress.message}
              className="mt-2 text-sm text-[#64748B] text-center min-h-[1.5rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              aria-live="polite"
              aria-atomic="true"
            >
              {progress.message}
            </motion.p>
          </AnimatePresence>
        ) : (
          <RotatingMessage key={currentStage.id} stage={currentStage} />
        )}

        {/* ── Username display ──────────────────────────────────────── */}
        <p className="mt-4 text-sm text-[#0F172A] font-medium">
          Analyzing{" "}
          <span className="font-bold text-[#2563EB]">@{username}</span>
        </p>

        {/* ── Indeterminate progress bar ────────────────────────────── */}
        <div className="mt-6 w-full max-w-md">
          <div className="h-1.5 w-full rounded-full bg-blue-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#8B5CF6]"
              animate={{ x: ["0%", "100%", "0%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: "40%" }}
            />
          </div>
        </div>

        {/* ── Elapsed time ─────────────────────────────────────────── */}
        {isActive && elapsed > 3 && (
          <motion.p
            className="mt-3 flex items-center gap-1.5 text-xs text-[#94A3B8]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Clock className="h-3 w-3 shrink-0" />
            Analyzing for {formatElapsed(elapsed)}
          </motion.p>
        )}

        {/* ── Stage pipeline indicator ──────────────────────────────── */}
        <div className="mt-10 w-full max-w-xl">
          <div className="flex items-start justify-between gap-2">
            {STAGES.map((stage, i) => {
              const SIcon = stage.icon
              const isDone = completing || i < stageIndex
              const isCurrentStage = !completing && i === stageIndex
              const isUpcoming = !completing && i > stageIndex

              return (
                <div key={stage.id} className="flex flex-col items-center flex-1 gap-1.5">
                  {/* Node */}
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 transition-colors duration-500 ${isDone
                        ? "border-emerald-400 bg-emerald-50"
                        : isCurrentStage
                          ? "border-[#2563EB] bg-blue-50"
                          : "border-slate-200 bg-white/60"
                        }`}
                      animate={
                        isCurrentStage
                          ? { boxShadow: ["0 0 0 0 rgba(37,99,235,0)", "0 0 0 6px rgba(37,99,235,0.15)", "0 0 0 0 rgba(37,99,235,0)"] }
                          : {}
                      }
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <AnimatePresence mode="wait">
                        {isDone ? (
                          <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          </motion.span>
                        ) : isCurrentStage ? (
                          <motion.span key="active" animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
                            <Loader2 className="h-5 w-5 text-[#2563EB]" />
                          </motion.span>
                        ) : (
                          <motion.span key="pending" initial={{ opacity: isUpcoming ? 0.5 : 0 }} animate={{ opacity: 1 }}>
                            <SIcon className="h-4 w-4 text-slate-400" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Connector line (except last) */}
                    {i < STAGES.length - 1 && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 w-full h-0.5 hidden sm:block">
                        <div
                          className={`h-full transition-colors duration-700 ${isDone ? "bg-emerald-300" : "bg-slate-200"
                            }`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-center text-[10px] sm:text-[11px] font-semibold leading-tight transition-colors duration-300 ${isDone
                      ? "text-emerald-600"
                      : isCurrentStage
                        ? "text-[#2563EB]"
                        : "text-slate-400"
                      }`}
                  >
                    {stage.shortLabel}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Informational note ────────────────────────────────────── */}
        <p className="mt-10 flex items-center gap-2 rounded-xl bg-blue-50/60 border border-blue-100 px-4 py-3 text-xs text-[#64748B] max-w-md text-center">
          <Clock className="h-3.5 w-3.5 shrink-0 text-blue-400" />
          This may take a little while for larger profiles. Please keep this page open.
        </p>
      </div>
    </AnalyzingLayout>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function AnalyzingLayout({ username, children }: { username: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] selection:bg-blue-100 selection:text-blue-900">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link
            to={ROUTES.home}
            className="group flex items-center gap-2.5 text-[#0F172A] rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F172A] text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Terminal className="h-4 w-4 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-[#0F172A]">DevIntel</span>
                <span className="hidden sm:inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                  v3.0
                </span>
              </div>
              <span className="hidden text-[11px] font-normal text-[#64748B] lg:inline-block leading-none mt-0.5">
                Developer Intelligence Platform
              </span>
            </div>
          </Link>

          {/* Analysis in-progress pill */}

          <div
            role="status"
            aria-live="polite"
            aria-label="Analysis in progress"
            className="inline-flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white px-4 py-2 shadow-sm shadow-slate-900/[0.04] transition-all duration-200 hover:border-slate-300 hover:shadow-md"
          >
            {/* Live status indicator */}
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-40 motion-reduce:animate-none" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500 ring-[3px] ring-emerald-50" />
            </span>

            {/* Status label */}
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
              Analysis
            </span>

            {/* Subtle separator */}
            <span
              aria-hidden="true"
              className="h-3.5 w-px bg-slate-200"
            />

            {/* Current state */}
            <span className="text-xs font-semibold tracking-[-0.01em] text-slate-800">
              In progress
            </span>
          </div>

        </div>
      </header>

      {/* ── Main ── */}
      <main
        className="flex-1 flex flex-col items-center justify-center px-4 py-12"
        role="status"
        aria-label={`Analyzing GitHub profile for ${username}`}
      >
        {/* Ambient background blobs */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-100/60 via-blue-50/20 to-transparent blur-3xl opacity-60" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-gradient-to-t from-purple-100/40 to-transparent blur-3xl opacity-50" />
        </div>

        {children}
      </main>
    </div>
  )
}

function ErrorState({
  username,
  error,
  onRetry,
}: {
  username: string
  error: Error | null
  onRetry: () => void
}) {
  const isTimeout =
    error?.message?.toLowerCase().includes("timeout") ||
    error?.message?.toLowerCase().includes("network")

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto px-4 py-8 text-center">
      {/* Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 border-2 border-red-200 mb-6">
        <AlertTriangle className="h-9 w-9 text-red-500" strokeWidth={1.5} />
      </div>

      <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Analysis Failed</h2>
      <p className="mt-2 text-sm text-[#64748B] max-w-sm">
        {error?.message && !isTimeout
          ? error.message
          : `We couldn't complete the analysis for @${username}. The server may be busy or the GitHub API may have rate-limited the request.`}
      </p>

      {isTimeout && (
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-700 max-w-sm">
          The analysis took longer than expected. For large profiles with many repositories, this can occasionally happen. Retrying often succeeds.
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Retry Analysis
        </button>
        <Link
          to={ROUTES.home}
          className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-5 py-2.5 text-sm font-semibold text-[#0F172A] shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <ArrowLeft className="h-4 w-4 text-slate-500" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}