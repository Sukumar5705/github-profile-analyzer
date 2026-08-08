import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Gap, GapSeverity } from "@/types/api"
import { AlertCircle } from "lucide-react"

interface GapAnalysisCardProps {
  gaps: Gap[]
}

const SEVERITY_CONFIG: Record<GapSeverity, { label: string; badgeClasses: string; dotClass: string }> = {
  high: {
    label: "High Priority Gap",
    badgeClasses: "bg-rose-50 text-rose-700 border border-rose-200/80",
    dotClass: "bg-rose-500",
  },
  medium: {
    label: "Moderate Gap",
    badgeClasses: "bg-amber-50 text-amber-700 border border-amber-200/80",
    dotClass: "bg-amber-500",
  },
  low: {
    label: "Minor Optimization",
    badgeClasses: "bg-blue-50 text-blue-700 border border-blue-200/80",
    dotClass: "bg-blue-500",
  },
}

export function GapAnalysisCard({ gaps }: GapAnalysisCardProps) {
  const sorted = [...gaps].sort((a, b) => {
    const order: Record<GapSeverity, number> = { high: 0, medium: 1, low: 2 }
    return order[a.severity] - order[b.severity]
  })

  return (
    <Card className="glass-card shadow-soft transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Identified Portfolio Gaps</CardTitle>
            <p className="text-xs text-[#64748B]">
              Blindspots in documentation, testing, and deployment
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-xs text-[#64748B]">No significant gaps detected.</p>
        ) : (
          <ul className="space-y-3" aria-label="Skill gaps">
            {sorted.map((gap, i) => {
              const config = SEVERITY_CONFIG[gap.severity]
              return (
                <li
                  key={i}
                  className="rounded-xl border border-white/80 bg-white/50 p-3.5 space-y-1.5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold text-[#141414]">
                      {gap.area}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-0.5 text-[11px] font-bold ${config.badgeClasses}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`}
                        aria-hidden="true"
                      />
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {gap.advice}
                  </p>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
