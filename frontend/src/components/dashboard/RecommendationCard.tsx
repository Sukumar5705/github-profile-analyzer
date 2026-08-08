import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Recommendation } from "@/types/api"
import { Lightbulb } from "lucide-react"

interface RecommendationCardProps {
  recommendations: Recommendation[]
}

const PRIORITY_CONFIG: Record<
  Recommendation["priority"],
  { label: string; badgeClasses: string; numberClasses: string }
> = {
  high: {
    label: "High Priority",
    badgeClasses: "bg-rose-50 text-rose-700 border border-rose-200/80",
    numberClasses: "bg-gradient-to-br from-[#036AFF] to-[#8B5CF6] text-white",
  },
  medium: {
    label: "Medium Priority",
    badgeClasses: "bg-amber-50 text-amber-700 border border-amber-200/80",
    numberClasses: "bg-slate-200 text-[#141414]",
  },
  low: {
    label: "Low Priority",
    badgeClasses: "bg-blue-50 text-blue-700 border border-blue-200/80",
    numberClasses: "bg-slate-100 text-[#64748B]",
  },
}

export function RecommendationCard({ recommendations }: RecommendationCardProps) {
  const sorted = [...recommendations].sort((a, b) => {
    const order: Record<Recommendation["priority"], number> = { high: 0, medium: 1, low: 2 }
    return order[a.priority] - order[b.priority]
  })

  return (
    <Card className="glass-card shadow-soft transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#036AFF] border border-blue-100">
            <Lightbulb className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Actionable Career Recommendations</CardTitle>
            <p className="text-xs text-[#64748B]">
              Ranked steps to elevate profile visibility and technical rating
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-xs text-[#64748B]">No recommendations at this time.</p>
        ) : (
          <ol className="space-y-3" aria-label="Recommendations">
            {sorted.map((rec, i) => {
              const config = PRIORITY_CONFIG[rec.priority]
              return (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-white/80 bg-white/50 p-3.5 shadow-sm"
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-xl text-xs font-bold tabular-nums shadow-sm ${config.numberClasses}`}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-xs sm:text-sm font-semibold text-[#141414] leading-relaxed">
                      {rec.recommendation}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-xl px-2 py-0.5 text-[11px] font-bold ${config.badgeClasses}`}
                    >
                      {config.label}
                    </span>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
