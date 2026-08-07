import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Recommendation } from "@/types/api"

interface RecommendationCardProps {
  recommendations: Recommendation[]
}

const PRIORITY_CONFIG: Record<
  Recommendation["priority"],
  { label: string; badgeClasses: string; numberClasses: string }
> = {
  high: {
    label: "High",
    badgeClasses: "bg-destructive/10 text-destructive",
    numberClasses: "bg-destructive/10 text-destructive",
  },
  medium: {
    label: "Medium",
    badgeClasses: "bg-warning/10 text-warning",
    numberClasses: "bg-warning/10 text-warning",
  },
  low: {
    label: "Low",
    badgeClasses: "bg-secondary text-muted-foreground",
    numberClasses: "bg-secondary text-muted-foreground",
  },
}

export function RecommendationCard({ recommendations }: RecommendationCardProps) {
  const sorted = [...recommendations].sort((a, b) => {
    const order: Record<Recommendation["priority"], number> = { high: 0, medium: 1, low: 2 }
    return order[a.priority] - order[b.priority]
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recommendations at this time.</p>
        ) : (
          <ol className="space-y-3" aria-label="Recommendations">
            {sorted.map((rec, i) => {
              const config = PRIORITY_CONFIG[rec.priority]
              return (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-border p-3.5"
                >
                  <span
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums ${config.numberClasses}`}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm text-foreground leading-relaxed">
                        {rec.recommendation}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.badgeClasses}`}
                    >
                      {config.label} priority
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
