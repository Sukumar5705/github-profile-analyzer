import { Card, CardContent } from "@/components/ui/card"
import type { CareerScore, DeveloperType, HireDecision, Seniority } from "@/types/api"
import { CheckCircle2, Target, Users, ArrowRight } from "lucide-react"

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
        label: "Strong Match",
        tagline: "Exceptional technical depth and verified portfolio. High priority hire.",
        interviewRec: "Fast-track to final on-site interview and team alignment",
        hiringLevel: `${level} (Target: ${targetRole})`,
        badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
      }
    case "Hire":
      return {
        label: "Potential Match",
        tagline: "Strong candidate with solid engineering foundation and verified repos.",
        interviewRec: "Proceed to standard technical interview loop",
        hiringLevel: `${level} (Target: ${targetRole})`,
        badgeClass: "bg-blue-50 text-blue-700 border border-blue-200/80",
      }
    case "Leaning Hire":
      return {
        label: "Potential Match",
        tagline: "Positive signals. Verify specific systems depth and test automation.",
        interviewRec: "Focus screen on architecture and real-world system scaling",
        hiringLevel: `${level}`,
        badgeClass: "bg-blue-50 text-blue-700 border border-blue-200/80",
      }
    case "Leaning No Hire":
      return {
        label: "Needs Review",
        tagline: "Portfolio lacks sufficient evidence or production readiness at target level.",
        interviewRec: "Conduct targeted technical phone screen before committing on-site",
        hiringLevel: "Needs Seniority Re-calibration",
        badgeClass: "bg-amber-50 text-amber-700 border border-amber-200/80",
      }
    default:
      return {
        label: decision || "Evaluation Complete",
        tagline: "Comprehensive evaluation compiled from verified GitHub repositories.",
        interviewRec: "Review portfolio showcase and interview questions",
        hiringLevel: level,
        badgeClass: "bg-white/80 text-[#141414] border border-white/80",
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
    <Card className="glass-card shadow-soft transition-all">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Verdict badge */}
          <div className="shrink-0 space-y-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold ${verdict.badgeClass}`}
              role="status"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {verdict.label}
            </span>
            <p className="text-xs text-[#64748B] font-medium">
              Confidence: <strong className="font-extrabold text-[#141414] tabular-nums">{effectiveConfidence}%</strong>
            </p>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 space-y-4">
            <p className="text-sm font-bold text-[#141414] leading-relaxed">
              {verdict.tagline}
            </p>

            {/* Score bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[#64748B]">
                <span className="font-bold uppercase tracking-wider text-[11px]">Career Readiness Score</span>
                <span className="font-extrabold tabular-nums text-[#141414]">
                  {score} / 100
                </span>
              </div>
              <div
                className="h-2 w-full rounded-full bg-slate-200/60 overflow-hidden"
                role="progressbar"
                aria-valuenow={score}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#036AFF] to-[#8B5CF6] transition-all duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            {/* Facts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="rounded-xl border border-white/80 bg-white/50 p-3 space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  <Target className="h-3 w-3 text-[#036AFF]" />
                  <span>Target Role</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#141414] leading-snug">
                  {recommendedRole || verdict.hiringLevel}
                </p>
              </div>

              <div className="rounded-xl border border-white/80 bg-white/50 p-3 space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  <Users className="h-3 w-3 text-[#8B5CF6]" />
                  <span>Target Team</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-[#141414] leading-snug">
                  {recommendedTeam || "Platform Engineering"}
                </p>
              </div>

              <div className="rounded-xl border border-white/80 bg-white/50 p-3 space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  <ArrowRight className="h-3 w-3 text-[#10B981]" />
                  <span>Next Step</span>
                </div>
                <p className="text-xs text-[#141414] leading-snug font-semibold">
                  {verdict.interviewRec}
                </p>
              </div>
            </div>

            {confidenceReason && (
              <p className="text-xs text-[#64748B] leading-relaxed pt-0.5 font-medium">
                {confidenceReason}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}