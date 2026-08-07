import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Gap, GapSeverity } from "@/types/api"

interface GapAnalysisCardProps {
  gaps: Gap[]
}

const SEVERITY_CONFIG: Record<GapSeverity, { label: string; classes: string; dotClass: string }> = {
  high: {
    label: "High",
    classes: "bg-destructive/10 text-destructive border-destructive/20",
    dotClass: "bg-destructive",
  },
  medium: {
    label: "Medium",
    classes: "bg-warning/10 text-warning border-warning/20",
    dotClass: "bg-warning",
  },
  low: {
    label: "Low",
    classes: "bg-secondary text-muted-foreground border-border",
    dotClass: "bg-muted-foreground",
  },
}

export function GapAnalysisCard({ gaps }: GapAnalysisCardProps) {
  const sorted = [...gaps].sort((a, b) => {
    const order: Record<GapSeverity, number> = { high: 0, medium: 1, low: 2 }
    return order[a.severity] - order[b.severity]
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gap Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">No significant gaps detected.</p>
        ) : (
          <ul className="space-y-3" aria-label="Skill gaps">
            {sorted.map((gap, i) => {
              const config = SEVERITY_CONFIG[gap.severity]
              return (
                <li
                  key={i}
                  className="rounded-lg border border-border p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {gap.area}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${config.classes}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`}
                        aria-hidden="true"
                      />
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
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
