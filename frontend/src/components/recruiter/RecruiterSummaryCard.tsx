import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Profile, DeveloperType } from "@/types/api"

interface RecruiterSummaryCardProps {
  profile: Profile
  developerType: DeveloperType
  executiveSummary?: string
  technicalSummary?: string
  hiringRecommendation?: string
}

export function RecruiterSummaryCard({
  profile,
  developerType,
  executiveSummary,
  technicalSummary,
  hiringRecommendation
}: RecruiterSummaryCardProps) {
  const name = profile.name ?? `@${profile.username}`
  const effectiveExec = executiveSummary || `${name} is identified as a ${developerType.developerType} with strong technical depth across verified repositories.`

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Executive & Technical Summary</CardTitle>
        <p className="text-sm text-muted-foreground">
          Synthesized technical evaluation and hiring insights
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Executive Summary */}
        <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Executive Brief
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            {effectiveExec}
          </p>
        </div>

        {/* Technical Summary */}
        {technicalSummary && (
          <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Technical Architecture & Depth
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {technicalSummary}
            </p>
          </div>
        )}

        {/* Hiring Recommendation */}
        {hiringRecommendation && (
          <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Hiring Committee Recommendation
            </p>
            <p className="text-sm text-foreground leading-relaxed font-medium">
              {hiringRecommendation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}