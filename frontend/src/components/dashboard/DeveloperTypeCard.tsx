import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { DeveloperType, Seniority } from "@/types/api"

interface DeveloperTypeCardProps {
  developerType: DeveloperType
  seniority?: Seniority
  recommendedRole?: string
  recommendedTeam?: string
  teamFit?: string[]
}

export function DeveloperTypeCard({
  developerType,
  seniority,
  recommendedRole,
  recommendedTeam,
  teamFit
}: DeveloperTypeCardProps) {
  const { developerType: type, confidence, reasons } = developerType
  const pct = Math.round((confidence ?? 0.85) * 100)
  const effectiveSeniority = seniority || "Senior Engineer"
  const effectiveRole = recommendedRole || `${effectiveSeniority} - ${type}`
  const effectiveTeam = recommendedTeam || "Platform Engineering"
  const effectiveSignals = teamFit && teamFit.length ? teamFit : reasons

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle>Developer Type</CardTitle>
          <p className="text-sm text-muted-foreground">
            Domain specialization and engineering archetype
          </p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-foreground border border-border">
          {effectiveSeniority}
        </span>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Type + Confidence */}
        <div>
          <p className="text-2xl font-bold tracking-tight text-foreground">{type}</p>
          <div className="flex items-center gap-3 mt-2">
            <div
              className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Confidence: ${pct}%`}
            >
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-sm font-semibold tabular-nums text-foreground">
              {pct}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Classification Confidence</p>
        </div>

        {/* Recommended Role & Target Team */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Recommended Role
            </p>
            <p className="text-sm font-semibold text-foreground leading-snug">
              {effectiveRole}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Target Team
            </p>
            <p className="text-sm font-semibold text-foreground leading-snug">
              {effectiveTeam}
            </p>
          </div>
        </div>

        {/* Supporting Signals & Team Fit */}
        {effectiveSignals && effectiveSignals.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2.5">
              Supporting Signals & Team Fit
            </p>
            <div className="flex flex-wrap gap-2">
              {effectiveSignals.map((signal) => (
                <span
                  key={signal}
                  className="inline-flex items-center rounded-md bg-secondary border border-border px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {signal}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
