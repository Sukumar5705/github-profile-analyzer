import { useParams, Link } from "react-router-dom"
import { useRecruiterView } from "@/hooks/useRecruiterView.tsx"
import { ROUTES } from "@/routes/paths"

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
import { Briefcase, Sparkles, RefreshCw } from "lucide-react"

export function RecruiterPage() {
  const { username } = useParams<{ username: string }>()

  const { data, isLoading, isError, error, refetch } = useRecruiterView(username ?? "")

  if (!username) {
    return (
      <div className="glass-card p-12 text-center max-w-xl mx-auto shadow-soft my-12">
        <h1 className="text-xl font-bold text-[#141414]">No Candidate Selected</h1>
        <p className="mt-2 text-sm text-[#64748B]">Choose a candidate from the search to view recruiter intelligence.</p>
        <Link to={ROUTES.home} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#036AFF] to-[#6366F1] px-5 py-2.5 text-xs font-bold text-white shadow-md">
          Return Home
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1440px] mx-auto animate-pulse">
        <div className="h-16 rounded-2xl bg-white/40 border border-white/60" />
        <div className="h-44 rounded-2xl bg-white/40 border border-white/60" />
        <div className="h-64 rounded-2xl bg-white/40 border border-white/60" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 rounded-2xl bg-white/40 border border-white/60" />
          <div className="h-64 rounded-2xl bg-white/40 border border-white/60" />
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="glass-card p-12 text-center max-w-xl mx-auto shadow-soft my-12">
        <h1 className="text-xl font-bold text-[#141414]">Couldn't Load Candidate Intelligence</h1>
        <p className="mt-2 text-sm text-[#64748B]">
          {error instanceof Error ? error.message : "Something went wrong while analyzing this profile."}
        </p>
        <button
          type="button"
          onClick={() => { void refetch() }}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#036AFF] to-[#6366F1] px-5 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>
      </div>
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
    <div className="space-y-6 max-w-[1440px] mx-auto">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141414] tracking-tight">
              Recruiter Intelligence
            </h1>
            <span className="inline-flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-xs font-bold text-[#036AFF]">
              <Briefcase className="h-3.5 w-3.5" />
              Talent View
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Engineering assessment, candidate scorecard, and interview playbooks.
          </p>
        </div>

        <Link
          to={ROUTES.home}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#036AFF] via-[#6366F1] to-[#8B5CF6] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:opacity-95 transition-all self-start sm:self-auto"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Evaluate Another Candidate</span>
        </Link>
      </div>

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
    </div>
  )
}