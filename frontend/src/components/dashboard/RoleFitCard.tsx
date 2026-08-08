import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { RoleFit } from "@/types/api"
import { Target } from "lucide-react"

interface RoleFitCardProps {
  roleFit?: RoleFit[]
}

function getFitBadgeClass(fit: number): string {
  if (fit >= 85) return "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
  if (fit >= 70) return "bg-blue-50 text-blue-700 border border-blue-200/80"
  if (fit >= 50) return "bg-amber-50 text-amber-700 border border-amber-200/80"
  return "bg-rose-50 text-rose-700 border border-rose-200/80"
}

export function RoleFitCard({ roleFit }: RoleFitCardProps) {
  if (!roleFit || roleFit.length === 0) return null

  return (
    <Card className="glass-card shadow-soft transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#036AFF] border border-blue-100">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Role Fit Index</CardTitle>
            <p className="text-xs text-[#64748B]">
              Suitability match across engineering role specializations
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {roleFit.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-white/80 bg-white/50 p-3.5 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#141414]">{item.role}</span>
              <span className={`px-2.5 py-0.5 rounded-xl text-xs font-bold tabular-nums ${getFitBadgeClass(item.fit)}`}>
                {item.fit}% Fit
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full rounded-full bg-slate-200/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#036AFF] to-[#8B5CF6] transition-all duration-500"
                style={{ width: `${item.fit}%` }}
              />
            </div>

            {item.reason && (
              <p className="text-xs text-[#64748B] leading-relaxed">
                {item.reason}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
