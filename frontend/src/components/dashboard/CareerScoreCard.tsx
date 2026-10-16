import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { CareerScore, ScoreBreakdownItem, HireDecision } from "@/types/api"
import { Award, ShieldCheck } from "lucide-react"

interface CareerScoreCardProps {
  careerScore: CareerScore
  hireDecision?: HireDecision
  confidence?: number
  confidenceReason?: string
}

function scoreLabel(score: number): { label: string; badgeClass: string } {
  if (score >= 85) return { label: "Exceptional", badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200/80" }
  if (score >= 70) return { label: "Strong", badgeClass: "bg-blue-50 text-blue-700 border border-blue-200/80" }
  if (score >= 50) return { label: "Competent", badgeClass: "bg-amber-50 text-amber-700 border border-amber-200/80" }
  return { label: "Developing", badgeClass: "bg-rose-50 text-rose-700 border border-rose-200/80" }
}

function hireDecisionBadge(decision?: string): { text: string; badgeClass: string } {
  switch (decision) {
    case "Strong Hire":
      return { text: "Strong Match", badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200/80" }
    case "Hire":
      return { text: "Potential Match", badgeClass: "bg-blue-50 text-blue-700 border border-blue-200/80" }
    case "Leaning Hire":
      return { text: "Potential Match", badgeClass: "bg-blue-50 text-blue-700 border border-blue-200/80" }
    case "Leaning No Hire":
      return { text: "Needs Review", badgeClass: "bg-amber-50 text-amber-700 border border-amber-200/80" }
    default:
      return { text: decision || "Evaluation Ready", badgeClass: "bg-white/80 text-[#141414] border border-white/80" }
  }
}

export function CareerScoreCard({ careerScore, hireDecision, confidence, confidenceReason }: CareerScoreCardProps) {
  const { score, scoreBreakdown, confidence: scoreConf, confidenceReason: scoreConfReason } = careerScore
  const effectiveConfidence = confidence ?? scoreConf ?? 90
  const effectiveConfReason = confidenceReason || scoreConfReason || "Comprehensive assessment evaluated against industry benchmarks."
  const { label, badgeClass } = scoreLabel(score)
  const decisionBadge = hireDecisionBadge(hireDecision)

  return (
    <Card id="career-score" className="glass-card shadow-soft transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#036AFF] border border-blue-100">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Career Score</CardTitle>
            <p className="text-xs text-[#64748B]">
              Weighted assessment across key engineering signals
            </p>
          </div>
        </div>
        {hireDecision && (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold ${decisionBadge.badgeClass}`}>
            {decisionBadge.text}
          </span>
        )}
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Score display */}
        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-5xl font-extrabold tracking-tight text-[#141414] tabular-nums">
              {score}
            </span>
            <span className="text-lg font-bold text-[#64748B]">
              / 100
            </span>
          </div>
          <span className={`px-3 py-1 rounded-xl text-xs font-bold ${badgeClass}`}>
            {label}
          </span>
        </div>

        {/* Gradient progress bar */}
        <div
          className="h-2.5 w-full rounded-full bg-slate-200/60 overflow-hidden"
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#036AFF] via-[#6366F1] to-[#8B5CF6] transition-all duration-500 shadow-sm"
            style={{ width: `${score}%` }}
          />
        </div>

        {/* AI Confidence Indicator */}
        <div className="rounded-xl bg-white/60 border border-white/80 p-3.5 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-[#64748B] uppercase tracking-wider text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#036AFF]" />
              Evaluation Confidence
            </span>
            <span className="font-extrabold text-[#141414] tabular-nums">
              {effectiveConfidence}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-200/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#036AFF] to-[#8B5CF6] transition-all duration-500"
              style={{ width: `${effectiveConfidence}%` }}
            />
          </div>
          {effectiveConfReason && (
            <p className="text-xs text-[#64748B] leading-relaxed pt-0.5">
              {effectiveConfReason}
            </p>
          )}
        </div>

        {/* AI Score Breakdown with Rationale */}
        {Array.isArray(scoreBreakdown) && scoreBreakdown.length > 0 && (
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Score Breakdown
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {scoreBreakdown.map((item: ScoreBreakdownItem, idx: number) => (
                <div key={idx} className="rounded-xl border border-white/80 bg-white/50 p-3 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#141414]">
                      {item.category}
                    </span>
                    <span className="tabular-nums font-extrabold text-[#141414]">
                      {item.score}<span className="text-[#64748B] font-semibold text-[11px]"> / 100</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#036AFF] to-[#6366F1] transition-all duration-500"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  {item.reason && (
                    <p className="text-xs text-[#64748B] leading-relaxed pt-0.5">
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
