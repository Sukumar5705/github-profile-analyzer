import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Gap } from "@/types/api"
import { AlertCircle } from "lucide-react"

interface ConcernsCardProps {
  concerns: string[]
  gaps: Gap[]
}

export function ConcernsCard({ concerns, gaps }: ConcernsCardProps) {
  const highGaps = gaps.filter((g) => g.severity === "high")
  const mediumGaps = gaps.filter((g) => g.severity === "medium")
  const structuredGaps = [...highGaps, ...mediumGaps]

  const hasContent = structuredGaps.length > 0 || concerns.length > 0

  return (
    <Card className="glass-card shadow-soft transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Concerns & Technical Gaps</CardTitle>
            <p className="text-xs text-[#64748B]">
              Potential risks and areas to evaluate during technical screening
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!hasContent ? (
          <p className="text-xs text-[#64748B]">
            No significant concerns identified.
          </p>
        ) : (
          <div className="space-y-2.5" aria-label="Candidate concerns">
            {/* Structured gaps with severity */}
            {structuredGaps.map((gap, i) => (
              <div
                key={`gap-${i}`}
                className="flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/50 p-3 shadow-sm"
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700"
                  aria-hidden="true"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs sm:text-sm font-bold text-[#141414]">
                    {gap.area}
                  </p>
                  {gap.advice && (
                    <p className="text-xs text-[#64748B] leading-relaxed">
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
                className="flex items-start gap-3 rounded-xl border border-white/80 bg-white/50 p-3 shadow-sm"
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700"
                  aria-hidden="true"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs sm:text-sm font-medium text-[#141414] leading-relaxed">
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