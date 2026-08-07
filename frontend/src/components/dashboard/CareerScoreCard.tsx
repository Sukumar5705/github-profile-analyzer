import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { CareerScore, ScoreBreakdownItem, HireDecision } from "@/types/api"

interface CareerScoreCardProps {
  careerScore: CareerScore
  hireDecision?: HireDecision
  confidence?: number
  confidenceReason?: string
}

function scoreLabel(score: number): { label: string; badgeBg: string } {
  if (score >= 85) return { label: "Exceptional", badgeBg: "bg-success/10 text-success border border-success/20" }
  if (score >= 70) return { label: "Strong", badgeBg: "bg-primary/10 text-primary border border-primary/20" }
  if (score >= 50) return { label: "Competent", badgeBg: "bg-warning/10 text-warning border border-warning/20" }
  return { label: "Developing", badgeBg: "bg-destructive/10 text-destructive border border-destructive/20" }
}

function hireDecisionBadge(decision?: string): { text: string; badgeClass: string } {
  switch (decision) {
    case "Strong Hire":
      return { text: "Strong Hire", badgeClass: "bg-success/10 text-success border border-success/20" }
    case "Hire":
      return { text: "Hire", badgeClass: "bg-primary/10 text-primary border border-primary/20" }
    case "Leaning Hire":
      return { text: "Leaning Hire", badgeClass: "bg-primary/10 text-primary border border-primary/20" }
    case "Leaning No Hire":
      return { text: "Leaning No Hire", badgeClass: "bg-warning/10 text-warning border border-warning/20" }
    default:
      return { text: decision || "Evaluation Complete", badgeClass: "bg-secondary text-foreground border border-border" }
  }
}

export function CareerScoreCard({ careerScore, hireDecision, confidence, confidenceReason }: CareerScoreCardProps) {
  const { score, scoreBreakdown, confidence: scoreConf, confidenceReason: scoreConfReason } = careerScore
  const effectiveConfidence = confidence ?? scoreConf ?? 90
  const effectiveConfReason = confidenceReason || scoreConfReason || "Comprehensive evaluation based on verified public repositories."
  const { label, badgeBg } = scoreLabel(score)
  const decisionBadge = hireDecisionBadge(hireDecision)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle>Career Score</CardTitle>
          <p className="text-sm text-muted-foreground">
            A weighted assessment across key engineering signals
          </p>
        </div>
        {hireDecision && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${decisionBadge.badgeClass}`}>
            {decisionBadge.text}
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Score display */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-5xl font-bold tracking-tight text-foreground tabular-nums">
              {score}
            </span>
            <span className="text-xl font-normal text-muted-foreground">
              /100
            </span>
          </div>
          <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${badgeBg}`}>
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
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${score}%` }}
          />
        </div>

        {/* AI Confidence Indicator */}
        <div className="rounded-lg bg-muted/40 border border-border p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-muted-foreground uppercase tracking-wide">
              Evaluation Confidence
            </span>
            <span className="font-semibold text-foreground tabular-nums">
              {effectiveConfidence}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-primary/80 transition-all duration-500"
              style={{ width: `${effectiveConfidence}%` }}
            />
          </div>
          {effectiveConfReason && (
            <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">
              {effectiveConfReason}
            </p>
          )}
        </div>

        {/* AI Score Breakdown with Rationale */}
        {Array.isArray(scoreBreakdown) && scoreBreakdown.length > 0 && (
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Score Breakdown
            </h4>
            <div className="space-y-2">
              {scoreBreakdown.map((item: ScoreBreakdownItem, idx: number) => (
                <div key={idx} className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-foreground">
                      {item.category}
                    </span>
                    <span className="tabular-nums font-semibold text-foreground">
                      {item.score}<span className="text-muted-foreground font-normal">/100</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/70 transition-all duration-500"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  {item.reason && (
                    <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">
                      {item.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
