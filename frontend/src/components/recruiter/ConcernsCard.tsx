import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Gap } from "@/types/api"

interface ConcernsCardProps {
  concerns: string[]
  gaps: Gap[]
}

export function ConcernsCard({ concerns, gaps }: ConcernsCardProps) {
  // Deduplicate: gaps are more structured, concerns are free-text.
  // Render gaps first (they have severity), then extra concern strings.
  const highGaps = gaps.filter((g) => g.severity === "high")
  const mediumGaps = gaps.filter((g) => g.severity === "medium")
  const structuredGaps = [...highGaps, ...mediumGaps]

  const hasContent = structuredGaps.length > 0 || concerns.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Concerns</CardTitle>
        <p className="text-sm text-muted-foreground">
          Risks and gaps to evaluate
        </p>
      </CardHeader>
      <CardContent>
        {!hasContent ? (
          <p className="text-sm text-muted-foreground">
            No significant concerns identified.
          </p>
        ) : (
          <div className="space-y-2.5" aria-label="Candidate concerns">
            {/* Structured gaps with severity */}
            {structuredGaps.map((gap, i) => (
              <div
                key={`gap-${i}`}
                className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/5 p-3"
              >
                <span
                  className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-warning/20"
                  aria-hidden="true"
                >
                  <WarnIcon />
                </span>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-medium text-foreground">
                    {gap.area}
                  </p>
                  {gap.advice && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {gap.advice}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Free-text concerns */}
            {concerns.map((concern, i) => (
              <div
                key={`concern-${i}`}
                className="flex items-start gap-3"
              >
                <span
                  className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-warning/10"
                  aria-hidden="true"
                >
                  <WarnIcon />
                </span>
                <span className="text-sm text-foreground leading-relaxed">
                  {concern}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function WarnIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="h-3 w-3 text-warning fill-none stroke-current stroke-2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2v4M6 8.5v.5" />
    </svg>
  )
}