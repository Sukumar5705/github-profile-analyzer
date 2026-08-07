import { useParams } from "react-router-dom"
import { useRecruiterView } from "@/hooks/useRecruiterView.tsx"

import { RecruiterHeader } from "@/components/recruiter/RecruiterHeader"
import { HiringDecisionCard } from "@/components/recruiter/HiringDecisionCard"
import { RecruiterSummaryCard } from "@/components/recruiter/RecruiterSummaryCard"
import { RoleFitCard } from "@/components/dashboard/RoleFitCard"
import { InterviewPlanCard } from "@/components/recruiter/InterviewPlanCard"
import { StrengthsCard } from "@/components/recruiter/StrengthsCard"
import { ConcernsCard } from "@/components/recruiter/ConcernsCard"
import { SkillsSnapshotCard } from "@/components/recruiter/SkillsSnapshotCard"
import { TopProjectsCard } from "@/components/recruiter/TopProjectsCard"
import { HiringRecommendationCard } from "@/components/recruiter/HiringRecommendationCard"
import { QuickFactsCard } from "@/components/recruiter/QuickFactsCard"

function PageState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div
      className="mx-auto max-w-3xl px-4 py-24 text-center"
      role="status"
      aria-live="polite"
    >
      <p className="text-base font-medium text-foreground">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div
      className="mx-auto max-w-5xl px-4 py-8 space-y-6"
      aria-label="Loading recruiter view"
      aria-busy="true"
    >
      {[220, 140, 120, 200, 200, 260, 220, 180, 160].map((h, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-border bg-secondary/50"
          style={{ height: h }}
        />
      ))}
    </div>
  )
}

export function RecruiterPage() {
  const { username } = useParams<{ username: string }>()

  const { data, isLoading, isError, error } = useRecruiterView(username ?? "")

  if (!username) {
    return (
      <PageState
        title="No candidate selected"
        description="Choose a candidate to view their recruiter summary."
      />
    )
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (isError) {
    return (
      <PageState
        title="Couldn't load this candidate"
        description={
          error instanceof Error
            ? error.message
            : "Something went wrong while analyzing this profile. Try again shortly."
        }
      />
    )
  }

  if (!data) {
    return (
      <PageState
        title="No data available"
        description="We don't have an analysis for this candidate yet."
      />
    )
  }

  const {
    profile,
    careerScore,
    developerType,
    summary,
    strengths,
    concerns,
    gaps,
    skills,
    topProjects,
    recommendations,
    analyzedAt,
    hireDecision,
    seniority,
    recommendedRole,
    recommendedTeam,
    confidence,
    confidenceReason,
    roleFit,
    executiveSummary,
    technicalSummary,
    hiringRecommendation,
    interviewFocus,
    riskAreas,
    interviewPlan,
    interviewQuestions
  } = data

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <RecruiterHeader
        profile={profile}
        careerScore={careerScore}
        developerType={developerType}
        analyzedAt={analyzedAt}
      />

      <HiringDecisionCard
        careerScore={careerScore}
        developerType={developerType}
        hireDecision={hireDecision}
        seniority={seniority}
        recommendedRole={recommendedRole}
        recommendedTeam={recommendedTeam}
        confidence={confidence}
        confidenceReason={confidenceReason}
      />

      <RecruiterSummaryCard
        profile={profile}
        developerType={developerType}
        executiveSummary={executiveSummary}
        technicalSummary={technicalSummary}
        hiringRecommendation={hiringRecommendation}
      />

      {roleFit && roleFit.length > 0 && (
        <RoleFitCard roleFit={roleFit} />
      )}

      <InterviewPlanCard
        interviewPlan={interviewPlan}
        interviewQuestions={interviewQuestions}
        interviewFocus={interviewFocus}
        riskAreas={riskAreas}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrengthsCard strengths={strengths} />
        <ConcernsCard concerns={concerns} gaps={gaps} />
      </div>

      <SkillsSnapshotCard skills={skills} />

      <TopProjectsCard projects={topProjects} />

      <HiringRecommendationCard
        careerScore={careerScore}
        developerType={developerType}
        recommendations={recommendations}
        gaps={gaps}
      />

      <QuickFactsCard
        profile={profile}
        summary={summary}
        developerType={developerType}
        careerScore={careerScore}
      />
    </main>
  )
}