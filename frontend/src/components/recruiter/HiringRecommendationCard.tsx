import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { CareerScore, DeveloperType, Gap } from "@/types/api"

import type {
  Recommendation,
} from "@/types/api"

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

/**
 * Maps the backend's developerType label onto a role/team suggestion.
 * Purely a presentation mapping — every input value still comes from
 * backend data, nothing here is a fabricated score.
 */
function deriveRoleFit(score: number, developerTypeLabel: string): RoleFit {
  const seniority =
    score >= 85
      ? "Senior"
      : score >= 70
      ? "Mid-to-Senior"
      : score >= 50
      ? "Mid-Level"
      : "Junior"
  const label =(developerTypeLabel ?? "Unknown").toLowerCase();

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

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  )
}

function BulletList({
  items,
  emptyLabel,
  dotClassName,
}: {
  items: string[]
  emptyLabel: string
  dotClassName: string
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>
  }
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span
            className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${dotClassName}`}
            aria-hidden="true"
          />
          <span className="text-sm text-foreground leading-relaxed">
            {item}
          </span>
        </li>
      ))}
    </ul>
  )
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
  console.log(developerType);

    const interviewFocus = recommendations.map((r) => r.recommendation)

    const strengthAreas = developerType.reasons ?? []
    const riskAreas = gaps
    .filter((g) => g.severity === "high" || g.severity === "medium")
    .map((g) => (g.advice ? `${g.area} — ${g.advice}` : g.area))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hiring Recommendation</CardTitle>
        <p className="text-sm text-muted-foreground">
          What to do with this candidate next
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Role + team, side by side like a fact grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-border p-3 space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Recommended Role
            </p>
            <p className="text-sm font-medium text-foreground">
              {roleFit.role}
            </p>
          </div>
          <div className="rounded-lg border border-border p-3 space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Suggested Team
            </p>
            <p className="text-sm font-medium text-foreground">
              {roleFit.team}
            </p>
          </div>
        </div>

       <Section title="Interview Focus">
  <BulletList
    items={interviewFocus}
    emptyLabel="No specific interview focus areas identified."
    dotClassName="bg-primary"
  />
</Section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Section title="Strength Areas">
            <BulletList
              items={strengthAreas}
              emptyLabel="No specific strength drivers identified."
              dotClassName="bg-success"
            />
          </Section>

          <Section title="Risk Areas">
            <BulletList
              items={riskAreas}
              emptyLabel="No significant risk areas identified."
              dotClassName="bg-warning"
            />
          </Section>
        </div>

        <Section title="Overall Recommendation">
          <p className="text-sm text-foreground leading-relaxed">{overall}</p>
        </Section>
      </CardContent>
    </Card>
  )
}