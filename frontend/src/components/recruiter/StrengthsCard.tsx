import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

interface StrengthsCardProps {
  strengths: string[]
}

export function StrengthsCard({ strengths }: StrengthsCardProps) {
  return (
    <Card className="glass-card shadow-soft transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Strengths & Positive Signals</CardTitle>
            <p className="text-xs text-[#64748B]">
              Key hiring advantages verified across repositories
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {strengths.length === 0 ? (
          <p className="text-xs text-[#64748B]">
            No specific strengths identified.
          </p>
        ) : (
          <ul className="space-y-2.5" aria-label="Candidate strengths">
            {strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-white/80 bg-white/50 p-3 shadow-sm">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
                  aria-hidden="true"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs sm:text-sm font-medium text-[#141414] leading-relaxed">
                  {strength}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}