import { useState } from "react"
import { useParams } from "react-router-dom"
import { useProfile } from "@/hooks/useProfileData"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function RoadmapPage() {
  const { username } = useParams<{ username: string }>()
  const { data, isLoading, isError, error } = useProfile(username ?? "")
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({})

  if (!username) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-base font-medium text-foreground">No candidate selected</p>
        <p className="mt-2 text-sm text-muted-foreground">Select a candidate to view their career growth roadmap.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse" aria-busy="true">
        <div className="h-32 rounded-xl bg-muted border border-border" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-72 rounded-xl bg-muted border border-border" />
          <div className="h-72 rounded-xl bg-muted border border-border" />
          <div className="h-72 rounded-xl bg-muted border border-border" />
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-base font-medium text-foreground">Unable to load roadmap</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Please analyze this profile first."}
        </p>
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
    <div className="space-y-8">
      {/* Header Banner */}
      <header className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-foreground border border-border">
                Current: {seniority || "Senior Engineer"}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-muted-foreground border border-border">
                {developerType?.developerType || "Software Engineer"}
              </span>
            </div>
            <h1 className="text-xl font-semibold text-foreground leading-tight">
              {profile.name || `@${profile.username}`} — Career Growth Roadmap
            </h1>
            <p className="text-sm text-muted-foreground">
              Strategic trajectory designed to elevate engineering impact and career seniority
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-3 sm:text-right shrink-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Target Next Level
            </p>
            <p className="text-sm font-semibold text-foreground mt-0.5">{nextStep}</p>
          </div>
        </div>

        {/* High-Leverage Skills to Expand */}
        {skillsToExpand && skillsToExpand.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              High-Leverage Skills to Expand
            </p>
            <div className="flex flex-wrap gap-1.5">
              {skillsToExpand.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-md bg-secondary border border-border px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wide text-muted-foreground">
              Roadmap Milestone Progress
            </span>
            <span className="font-semibold text-foreground tabular-nums">
              {completedCount} of {allTaskKeys.length} Tasks ({progressPct}%)
            </span>
          </div>
          <div
            className="h-2 w-full rounded-full bg-secondary overflow-hidden"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* 3-Month Actionable Timeline */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            3-Month Actionable Sprint Plan
          </h2>
          <p className="text-sm text-muted-foreground">
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
                className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div>
                    <span className="inline-flex items-center rounded-md border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-foreground">
                      Month {mIdx + 1}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-foreground leading-snug">
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
                          className={`w-full flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-colors text-xs ${
                            isDone
                              ? "bg-muted/10 border-border/40 text-muted-foreground line-through"
                              : "bg-muted/20 border-border hover:bg-muted/40 text-foreground"
                          }`}
                        >
                          <span className="mt-0.5 shrink-0" aria-hidden="true">
                            {isDone ? <CheckedIcon /> : <UncheckedIcon />}
                          </span>
                          <span className="leading-relaxed font-medium">{task}</span>
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

      {/* Strategic Growth Goal */}
      {timelineData.goal && (
        <Card>
          <CardContent className="p-5 space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Strategic Career Growth Goal
            </p>
            <p className="text-sm text-foreground leading-relaxed font-medium">
              {timelineData.goal}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Reference: Gaps & Recommendations */}
      {((portfolioGaps && portfolioGaps.length > 0) || (recommendations && recommendations.length > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolioGaps && portfolioGaps.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Identified Portfolio Gaps</CardTitle>
                <p className="text-sm text-muted-foreground">Areas to strengthen in your portfolio</p>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {portfolioGaps.map((gap, i) => (
                  <div key={i} className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                    <p className="text-xs font-semibold text-foreground">{gap.area}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{gap.advice}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {recommendations && recommendations.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Key Recommendations</CardTitle>
                <p className="text-sm text-muted-foreground">Actionable guidance for portfolio improvement</p>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {recommendations.map((rec, i) => (
                  <div key={i} className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                    <span className="inline-flex items-center rounded-md bg-secondary border border-border px-2 py-0.5 text-[10px] font-semibold uppercase text-foreground">
                      {rec.priority} Priority
                    </span>
                    <p className="text-xs text-foreground leading-relaxed font-medium">{rec.recommendation}</p>
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

function CheckedIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-success" aria-hidden="true">
      <circle cx="8" cy="8" r="7" />
      <path d="m5 8 2 2 4-4" />
    </svg>
  )
}

function UncheckedIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true">
      <circle cx="8" cy="8" r="7" />
    </svg>
  )
}
