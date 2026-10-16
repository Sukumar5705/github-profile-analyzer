import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useProfile } from "@/hooks/useProfileData"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ROUTES } from "@/routes/paths"
import { 
  Target, 
  CheckCircle2, 
  Circle, 
  TrendingUp, 
  RefreshCw 
} from "lucide-react"

export function RoadmapPage() {
  const { username } = useParams<{ username: string }>()
  const { data, isLoading, isError, error, refetch } = useProfile(username ?? "")
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({})

  if (!username) {
    return (
      <div className="glass-card p-12 text-center max-w-xl mx-auto shadow-soft my-12">
        <h1 className="text-xl font-bold text-[#141414]">No Candidate Selected</h1>
        <p className="mt-2 text-sm text-[#64748B]">Select a candidate to view their career growth roadmap.</p>
        <Link to={ROUTES.home} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#036AFF] to-[#6366F1] px-5 py-2.5 text-xs font-bold text-white shadow-md">
          Return Home
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1440px] mx-auto animate-pulse">
        <div className="h-32 rounded-2xl bg-white/40 border border-white/60" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-72 rounded-2xl bg-white/40 border border-white/60" />
          <div className="h-72 rounded-2xl bg-white/40 border border-white/60" />
          <div className="h-72 rounded-2xl bg-white/40 border border-white/60" />
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="glass-card p-12 text-center max-w-xl mx-auto shadow-soft my-12">
        <h1 className="text-xl font-bold text-[#141414]">Unable to Load Career Roadmap</h1>
        <p className="mt-2 text-sm text-[#64748B]">
          {error instanceof Error ? error.message : "Please analyze this profile first."}
        </p>
        <button
          type="button"
          onClick={() => { void refetch() }}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#036AFF] to-[#6366F1] px-5 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    )
  }

  const {
    profile,
    developerType,
    seniority,
    candidateRoadmap,
    learningRoadmap,
    portfolioGaps,
    recommendations
  } = data

  const roadmap = candidateRoadmap || learningRoadmap
  const nextStep = roadmap?.nextCareerStep || `Staff ${developerType?.developerType || "Software Engineer"}`
  const skillsToExpand = roadmap?.skillsToExpand || ["Distributed Systems", "Cloud Infrastructure", "CI/CD Automation"]

  const timelineData = roadmap?.timeline || {
    month1: roadmap?.month1 || { focus: "Architecture & Modularity", tasks: ["Refactor monolithic modules into decoupled packages", "Implement comprehensive integration tests"] },
    month2: roadmap?.month2 || { focus: "Performance & Scalability", tasks: ["Profile memory and CPU bottlenecks", "Implement Redis caching and connection pooling"] },
    month3: roadmap?.month3 || { focus: "Production Readiness & Open Source", tasks: ["Set up automated GitHub Actions release pipelines", "Write comprehensive API docs and live demo sites"] },
    goal: roadmap?.goal || "Achieve staff-level engineering leadership and high-impact open source credibility."
  }

  const months = [
    { key: "month1", title: "Month 1: Foundation & Architecture", data: timelineData.month1 },
    { key: "month2", title: "Month 2: Scale & Optimization", data: timelineData.month2 },
    { key: "month3", title: "Month 3: Production & Community", data: timelineData.month3 }
  ]

  // Calculate total tasks and completion
  const allTaskKeys: string[] = []
  months.forEach((m) => {
    (m.data?.tasks || []).forEach((_, i) => {
      allTaskKeys.push(`${m.key}-${i}`)
    })
  })

  const completedCount = allTaskKeys.filter(k => completedTasks[k]).length
  const progressPct = allTaskKeys.length > 0 ? Math.round((completedCount / allTaskKeys.length) * 100) : 0

  const toggleTask = (key: string) => {
    setCompletedTasks(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      {/* ── Header Banner ────────────────────────────────────────── */}
      <header className="glass-card shadow-soft p-6 transition-all space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-xl text-xs font-bold bg-white/80 text-[#141414] border border-white/80 shadow-sm">
                Current: {seniority || "Senior Engineer"}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-xl text-xs font-bold bg-purple-50 text-[#8B5CF6] border border-purple-100">
                {developerType?.developerType || "Software Engineer"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#141414] leading-tight">
              {profile.name || `@${profile.username}`} — Career Growth Roadmap
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Strategic trajectory designed to elevate engineering impact and career seniority
            </p>
          </div>

          <div className="rounded-2xl border border-white/80 bg-white/60 p-4 sm:text-right shrink-0 shadow-sm">
            <div className="flex items-center sm:justify-end gap-1.5 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <TrendingUp className="h-3.5 w-3.5 text-[#036AFF]" />
              <span>Target Next Level</span>
            </div>
            <p className="text-sm font-bold text-[#141414] mt-0.5">{nextStep}</p>
          </div>
        </div>

        {/* High-Leverage Skills to Expand */}
        {skillsToExpand && skillsToExpand.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-white/80">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              High-Leverage Skills to Expand
            </p>
            <div className="flex flex-wrap gap-2">
              {skillsToExpand.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-xl bg-white/80 border border-white/80 px-3 py-1 text-xs font-semibold text-[#141414] shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── Progress Bar ─────────────────────────────────────────── */}
      <Card className="glass-card shadow-soft transition-all">
        <CardContent className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-[11px] text-[#64748B]">
              Roadmap Milestone Progress
            </span>
            <span className="font-bold text-[#141414] tabular-nums">
              {completedCount} of {allTaskKeys.length} Tasks ({progressPct}%)
            </span>
          </div>
          <div
            className="h-2 w-full rounded-full bg-slate-200/60 overflow-hidden"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#036AFF] to-[#8B5CF6] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── 3-Month Actionable Timeline ──────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#141414]">
            3-Month Actionable Sprint Plan
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Structured monthly objectives to build verified portfolio proof
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {months.map((month, mIdx) => {
            const mData = month.data
            if (!mData) return null

            return (
              <div
                key={month.key}
                className="glass-card p-5 shadow-soft flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="space-y-3">
                  <div>
                    <span className="inline-flex items-center rounded-xl bg-purple-50 border border-purple-100 px-2.5 py-0.5 text-xs font-bold text-[#8B5CF6]">
                      Month {mIdx + 1}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#141414] leading-snug">
                    {mData.focus || month.title}
                  </h3>

                  <div className="space-y-2 pt-1">
                    {(mData.tasks || []).map((task, tIdx) => {
                      const taskKey = `${month.key}-${tIdx}`
                      const isDone = Boolean(completedTasks[taskKey])

                      return (
                        <button
                          key={tIdx}
                          type="button"
                          onClick={() => toggleTask(taskKey)}
                          className={`w-full flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all text-xs cursor-pointer shadow-sm ${
                            isDone
                              ? "bg-white/40 border-slate-200/50 text-[#64748B] line-through"
                              : "bg-white/70 border-white/80 hover:bg-white text-[#141414]"
                          }`}
                        >
                          <span className="mt-0.5 shrink-0" aria-hidden="true">
                            {isDone ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="h-4 w-4 text-[#64748B]" />
                            )}
                          </span>
                          <span className="leading-relaxed font-semibold">{task}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Strategic Growth Goal ────────────────────────────────── */}
      {timelineData.goal && (
        <Card className="glass-card shadow-soft transition-all">
          <CardContent className="p-5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <Target className="h-3.5 w-3.5 text-[#036AFF]" />
              <span>Strategic Career Growth Goal</span>
            </div>
            <p className="text-xs sm:text-sm text-[#141414] leading-relaxed font-semibold">
              {timelineData.goal}
            </p>
          </CardContent>
        </Card>
      )}

      {/* ── Quick Reference: Gaps & Recommendations ──────────────── */}
      {((portfolioGaps && portfolioGaps.length > 0) || (recommendations && recommendations.length > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolioGaps && portfolioGaps.length > 0 && (
            <Card className="glass-card shadow-soft transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle>Identified Portfolio Gaps</CardTitle>
                  <p className="text-xs text-[#64748B]">Areas to strengthen in your public portfolio</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {portfolioGaps.map((gap, i) => (
                  <div key={i} className="rounded-xl border border-white/80 bg-white/50 p-3.5 space-y-1 shadow-sm">
                    <p className="text-xs font-bold text-[#141414]">{gap.area}</p>
                    <p className="text-xs text-[#64748B] leading-relaxed font-medium">{gap.advice}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {recommendations && recommendations.length > 0 && (
            <Card className="glass-card shadow-soft transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle>Key Recommendations</CardTitle>
                  <p className="text-xs text-[#64748B]">Actionable guidance for portfolio improvement</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {recommendations.map((rec, i) => (
                  <div key={i} className="rounded-xl border border-white/80 bg-white/50 p-3.5 space-y-1 shadow-sm">
                    <span className="inline-flex items-center rounded-lg bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#036AFF] uppercase">
                      {rec.priority} Priority
                    </span>
                    <p className="text-xs text-[#141414] leading-relaxed font-semibold">{rec.recommendation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
