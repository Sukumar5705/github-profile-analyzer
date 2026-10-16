import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { CareerScore, DeveloperType, Gap, Recommendation } from "@/types/api"
import { CheckCircle2, Target, Users } from "lucide-react"

interface HiringRecommendationCardProps {
  careerScore: CareerScore
  developerType: DeveloperType
  recommendations: Recommendation[]
  gaps: Gap[]
}

interface RoleFit {
  seniority: string
  role: string
  team: string
}

function deriveRoleFit(score: number, developerTypeLabel: string): RoleFit {
  const seniority =
    score >= 85
      ? "Senior"
      : score >= 70
      ? "Mid-to-Senior"
      : score >= 50
      ? "Mid-Level"
      : "Junior"
  const label = (developerTypeLabel ?? "Unknown").toLowerCase()

  if (label.includes("full stack") || label.includes("fullstack")) {
    return { seniority, role: `${seniority} Full Stack Engineer`, team: "Product Engineering Team" }
  }
  if (label.includes("backend")) {
    return { seniority, role: `${seniority} Backend Engineer`, team: "Platform / Backend Team" }
  }
  if (label.includes("frontend") || label.includes("front-end")) {
    return { seniority, role: `${seniority} Frontend Engineer`, team: "Product / Frontend Team" }
  }
  if (label.includes("devops") || label.includes("infra")) {
    return { seniority, role: `${seniority} DevOps Engineer`, team: "Infrastructure / SRE Team" }
  }
  if (label.includes("mobile")) {
    return { seniority, role: `${seniority} Mobile Engineer`, team: "Mobile Team" }
  }
  if (label.includes("ml") || label.includes("machine learning") || label.includes("ai") || label.includes("data")) {
    return { seniority, role: `${seniority} ML / Data Engineer`, team: "AI / ML Team" }
  }

  return { seniority, role: `${seniority} Software Engineer`, team: "General Engineering Team" }
}

function buildOverallRecommendation(
  score: number,
  developerTypeLabel: string,
  confidence: number
): string {
  const confidencePct = Math.round(confidence * 100)

  if (score >= 85) {
    return `With a portfolio score of ${score}/100 and ${confidencePct}% classification confidence as a ${developerTypeLabel}, this candidate ranks among the strongest profiles reviewed and should be prioritized for interviews.`
  }
  if (score >= 70) {
    return `A portfolio score of ${score}/100 places this ${developerTypeLabel} candidate solidly above the hiring bar, with ${confidencePct}% confidence in the role classification. A technical screen is a reasonable next step.`
  }
  if (score >= 50) {
    return `This ${developerTypeLabel} candidate scores ${score}/100 with ${confidencePct}% classification confidence. The portfolio shows potential but would benefit from a closer look before advancing.`
  }
  return `At ${score}/100, this candidate's public portfolio currently falls below the typical hiring bar for a ${developerTypeLabel} role (${confidencePct}% classification confidence). Proceed only with strong signals from elsewhere in the process.`
}

export function HiringRecommendationCard({
  careerScore,
  developerType,
  recommendations,
  gaps,
}: HiringRecommendationCardProps) {
  const score = careerScore.score
  const confidence = developerType.confidence ?? 0
  const roleFit = deriveRoleFit(score, developerType.developerType)
  const overall = buildOverallRecommendation(
    score,
    developerType.developerType,
    confidence
  )

  const interviewFocus = recommendations.map((r) => r.recommendation)
  const strengthAreas = developerType.reasons ?? []
  const riskAreas = gaps
    .filter((g) => g.severity === "high" || g.severity === "medium")
    .map((g) => (g.advice ? `${g.area} — ${g.advice}` : g.area))

  return (
    <Card className="glass-card shadow-soft transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#036AFF] border border-blue-100">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Hiring Recommendation</CardTitle>
            <p className="text-xs text-[#64748B]">
              Recommended action plan for hiring manager
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Role + team fact grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/80 bg-white/50 p-3.5 space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <Target className="h-3.5 w-3.5 text-[#036AFF]" />
              <span>Recommended Role</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#141414]">
              {roleFit.role}
            </p>
          </div>
          <div className="rounded-xl border border-white/80 bg-white/50 p-3.5 space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <Users className="h-3.5 w-3.5 text-[#8B5CF6]" />
              <span>Suggested Team</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#141414]">
              {roleFit.team}
            </p>
          </div>
        </div>

        {/* Interview focus */}
        {interviewFocus.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              Interview Focus
            </h4>
            <ul className="space-y-1.5">
              {interviewFocus.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#141414]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#036AFF]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Strength areas */}
          {strengthAreas.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                Strength Drivers
              </h4>
              <ul className="space-y-1.5">
                {strengthAreas.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#141414]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risk areas */}
          {riskAreas.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                Risk Areas
              </h4>
              <ul className="space-y-1.5">
                {riskAreas.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#141414]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Overall Recommendation */}
        <div className="rounded-xl border border-white/80 bg-white/60 p-4 shadow-sm">
          <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
            Overall Candidate Recommendation
          </p>
          <p className="text-xs sm:text-sm text-[#141414] leading-relaxed font-medium">
            {overall}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}