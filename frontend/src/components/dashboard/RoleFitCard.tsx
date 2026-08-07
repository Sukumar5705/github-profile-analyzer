import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { RoleFit } from "@/types/api"

interface RoleFitCardProps {
  roleFit?: RoleFit[]
}

function getFitBadgeClass(fit: number): string {
  if (fit >= 85) return "bg-success/10 text-success border border-success/20"
  if (fit >= 70) return "bg-primary/10 text-primary border border-primary/20"
  if (fit >= 50) return "bg-warning/10 text-warning border border-warning/20"
  return "bg-destructive/10 text-destructive border border-destructive/20"
}

export function RoleFitCard({ roleFit }: RoleFitCardProps) {
  if (!roleFit || roleFit.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Role Fit Index</CardTitle>
        <p className="text-sm text-muted-foreground">
          Suitability match across engineering role specializations
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {roleFit.map((item, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-border bg-muted/20 p-3.5 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">{item.role}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tabular-nums ${getFitBadgeClass(item.fit)}`}>
                {item.fit}% Fit
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${item.fit}%` }}
              />
            </div>

            {item.reason && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.reason}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
