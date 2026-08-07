import { Card, CardContent } from "@/components/ui/card"
import type { CareerScore, DeveloperType, HireDecision, Seniority } from "@/types/api"

interface HiringDecisionCardProps {
  careerScore: CareerScore
  developerType: DeveloperType
  hireDecision?: HireDecision
  seniority?: Seniority
  recommendedRole?: string
  recommendedTeam?: string
  confidence?: number
  confidenceReason?: string
}

interface VerdictConfig {
  label: string
  tagline: string
  interviewRec: string
  hiringLevel: string
  badgeClass: string
}

function getVerdictConfig(decision?: string, score: number = 75, seniority?: string, role?: string): VerdictConfig {
  const level = seniority || (score >= 85 ? "Principal Engineer" : score >= 75 ? "Staff Engineer" : "Senior Engineer")
  const targetRole = role || `${level}`

  switch (decision) {
    case "Strong Hire":
      return {
        label: "Strong Hire",
        tagline: "Exceptional technical depth and verified portfolio. High priority hire.",
        interviewRec: "Fast-track to final on-site interview and executive alignment",
        hiringLevel: `${level} (Target: ${targetRole})`,
        badgeClass: "bg-success/10 text-success border border-success/20",
      }
    case "Hire":
      return {
        label: "Hire",
        tagline: "Strong candidate with solid engineering foundation and verified repos.",
        interviewRec: "Proceed to standard technical interview loop",
        hiringLevel: `${level} (Target: ${targetRole})`,
        badgeClass: "bg-primary/10 text-primary border border-primary/20",
      }
    case "Leaning Hire":
      return {
        label: "Leaning Hire",
        tagline: "Positive signals. Verify specific systems depth and test automation.",
        interviewRec: "Focus screen on architecture and real-world system scaling",
        hiringLevel: `${level}`,
        badgeClass: "bg-primary/10 text-primary border border-primary/20",
      }
    case "Leaning No Hire":
      return {
        label: "Leaning No Hire",
        tagline: "Portfolio lacks sufficient evidence or production readiness at target level.",
        interviewRec: "Conduct targeted technical phone screen before committing on-site",
        hiringLevel: "Needs Seniority Re-calibration",
        badgeClass: "bg-warning/10 text-warning border border-warning/20",
      }
    default:
      return {
        label: decision || "Evaluation Complete",
        tagline: "Comprehensive evaluation compiled from verified GitHub repositories.",
        interviewRec: "Review portfolio showcase and interview questions",
        hiringLevel: level,
        badgeClass: "bg-secondary text-foreground border border-border",
      }
  }
}

export function HiringDecisionCard({
  careerScore,
  developerType,
  hireDecision,
  seniority,
  recommendedRole,
  recommendedTeam,
  confidence,
  confidenceReason
}: HiringDecisionCardProps) {
  const score = careerScore.score
  const effectiveDecision = hireDecision || (score >= 85 ? "Strong Hire" : score >= 70 ? "Hire" : "Leaning Hire")
  const effectiveConfidence = confidence ?? Math.round((developerType.confidence ?? 0.9) * 100)
  const verdict = getVerdictConfig(effectiveDecision, score, seniority, recommendedRole)

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Verdict badge */}
          <div className="flex-shrink-0 space-y-2">
            <span
              className={`inline-flex items-center rounded-md px-3.5 py-1 text-sm font-semibold border ${verdict.badgeClass}`}
              role="status"
            >
              {verdict.label}
            </span>
            <p className="text-xs text-muted-foreground">
              Confidence: <strong className="font-semibold text-foreground tabular-nums">{effectiveConfidence}%</strong>
            </p>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 space-y-4">
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {verdict.tagline}
            </p>

            {/* Score bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="font-medium uppercase tracking-wide">Career Score</span>
                <span className="font-semibold tabular-nums text-foreground">
                  {score} / 100
                </span>
              </div>
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
            </div>

            {/* Facts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Target Role
                </p>
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {recommendedRole || verdict.hiringLevel}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Target Team
                </p>
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {recommendedTeam || "Platform Engineering"}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Interview Next Step
                </p>
                <p className="text-xs text-foreground leading-snug font-medium">
                  {verdict.interviewRec}
                </p>
              </div>
            </div>

            {confidenceReason && (
              <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">
                {confidenceReason}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}