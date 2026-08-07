import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { CareerScore } from "@/types/api"

interface CareerScoreCardProps {
  careerScore: CareerScore
}

const BREAKDOWN_LABELS: Record<string, string> = {
  documentation: "Documentation",
  diversity: "Diversity",
  deployment: "Deployment",
  techBreadth: "Tech Breadth",
  activity: "Activity",
  openSource: "Open Source",
}

function scoreLabel(score: number): { label: string; color: string } {
  if (score >= 85) return { label: "Exceptional", color: "text-success" }
  if (score >= 70) return { label: "Strong", color: "text-success" }
  if (score >= 55) return { label: "Developing", color: "text-warning" }
  return { label: "Needs Work", color: "text-destructive" }
}

export function CareerScoreCard({ careerScore }: CareerScoreCardProps) {
  const { score, breakdown } = careerScore
  const { label, color } = scoreLabel(score)

  const maxBreakdown = Math.max(...Object.values(breakdown), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Score ring / display */}
        <div className="flex items-end gap-3">
          <span className="text-5xl font-bold tabular-nums text-foreground leading-none">
            {score}
          </span>
          <span className="text-2xl font-light text-muted-foreground leading-none mb-0.5">
            / 100
          </span>
          <span className={`text-sm font-medium ${color} ml-auto mb-1`}>
            {label}
          </span>
        </div>

        {/* Overall progress bar */}
        <div
          className="h-2 w-full rounded-full bg-secondary overflow-hidden"
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Career score: ${score} out of 100`}
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Breakdown */}
        <div className="space-y-3 pt-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Breakdown
          </p>
          {Object.entries(breakdown).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">
                  {BREAKDOWN_LABELS[key] ?? key}
                </span>
                <span className="text-sm tabular-nums font-medium text-foreground">
                  {value}
                </span>
              </div>
              <div
                className="h-1.5 w-full rounded-full bg-secondary overflow-hidden"
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={maxBreakdown}
                aria-label={`${BREAKDOWN_LABELS[key] ?? key}: ${value}`}
              >
                <div
                  className="h-full rounded-full bg-primary/60 transition-all duration-500"
                  style={{ width: `${(value / maxBreakdown) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
