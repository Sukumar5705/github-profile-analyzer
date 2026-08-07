import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { DeveloperType } from "@/types/api"

interface DeveloperTypeCardProps {
  developerType: DeveloperType
}

export function DeveloperTypeCard({ developerType }: DeveloperTypeCardProps) {
  const { developerType: type, confidence, reasons } = developerType
  const pct = Math.round(confidence * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Developer Type</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Type + confidence */}
        <div>
          <p className="text-2xl font-semibold text-foreground">{type}</p>
          <div className="flex items-center gap-2 mt-2">
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
            <span className="text-sm font-medium tabular-nums text-muted-foreground w-12 text-right">
              {pct}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Confidence</p>
        </div>

        {/* Supporting reasons / skills */}
        {reasons.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2.5">
              Supporting signals
            </p>
            <div className="flex flex-wrap gap-2">
              {reasons.map((reason) => (
                <span
                  key={reason}
                  className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-sm font-medium text-foreground"
                >
                  {reason}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
