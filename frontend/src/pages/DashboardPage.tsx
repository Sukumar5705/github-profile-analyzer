import { useParams } from "react-router-dom"

import { ProfileHeader } from "@/components/dashboard/ProfileHeader"
import { CareerScoreCard } from "@/components/dashboard/CareerScoreCard"
import { DeveloperTypeCard } from "@/components/dashboard/DeveloperTypeCard"
import { RoleFitCard } from "@/components/dashboard/RoleFitCard"
import { SkillsCard } from "@/components/dashboard/SkillsCard"
import { StrengthsCard } from "@/components/dashboard/StrengthsCard"
import { GapAnalysisCard } from "@/components/dashboard/GapAnalysisCard"
import { RecommendationCard } from "@/components/dashboard/RecommendationCard"
import { TopProjectsCard } from "@/components/dashboard/TopProjectsCard"

import { useProfile } from "@/hooks/useProfileData"

export function DashboardPage() {
  const { username } =
    useParams<{
      username: string
    }>()

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useProfile(
    username ?? ""
  )

  // ─────────────────────────────────────────────
  // Invalid route
  // ─────────────────────────────────────────────

  if (!username) {
    return (
      <section className="py-16 text-center">
        <h1 className="text-xl font-semibold">
          Invalid GitHub username
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          No GitHub username was provided in the URL.
        </p>
      </section>
    )
  }

  // ─────────────────────────────────────────────
  // Loading state
  // ─────────────────────────────────────────────

  if (isLoading) {
    return (
      <div
        className="space-y-6 max-w-6xl mx-auto"
        aria-busy="true"
        aria-label="Loading developer analysis"
      >
        {/* Profile skeleton */}
        <div className="h-52 animate-pulse rounded-xl border bg-muted" />

        {/* Primary intelligence skeleton */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-xl border bg-muted" />
          <div className="h-80 animate-pulse rounded-xl border bg-muted" />
        </div>

        {/* Role fit skeleton */}
        <div className="h-64 animate-pulse rounded-xl border bg-muted" />

        {/* Skills skeleton */}
        <div className="h-64 animate-pulse rounded-xl border bg-muted" />

        {/* Secondary intelligence skeleton */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-xl border bg-muted" />
          <div className="h-64 animate-pulse rounded-xl border bg-muted" />
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────
  // Error state
  // ─────────────────────────────────────────────

  if (isError || !data) {
    return (
      <section className="py-16 text-center">
        <h1 className="text-xl font-semibold">
          Unable to load profile
        </h1>

        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "The developer analysis could not be loaded."}
        </p>

        <button
          type="button"
          onClick={() => {
            void refetch()
          }}
          className="mt-5 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Try again
        </button>
      </section>
    )
  }

  // ─────────────────────────────────────────────
  // Dashboard
  // ─────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* GitHub identity */}
      <ProfileHeader
        profile={data.profile}
      />

      {/* Career intelligence */}
      {data.careerScore && data.developerType && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CareerScoreCard
            careerScore={data.careerScore}
            hireDecision={data.hireDecision}
            confidence={data.confidence}
            confidenceReason={data.confidenceReason}
          />

          <DeveloperTypeCard
            developerType={data.developerType}
            seniority={data.seniority}
            recommendedRole={data.recommendedRole}
            recommendedTeam={data.recommendedTeam}
            teamFit={data.teamFit}
          />
        </div>
      )}

      {/* Role Fit Analysis */}
      {data.roleFit && data.roleFit.length > 0 && (
        <RoleFitCard roleFit={data.roleFit} />
      )}

      {/* Skills */}
      <SkillsCard
        skills={data.skills}
      />

      {/* Strengths + gaps */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StrengthsCard
          strengths={data.strengths || data.recruiter.strengths}
        />

        <GapAnalysisCard
          gaps={data.portfolioGaps || data.gaps}
        />
      </div>

      {/* Recommendations */}
      <RecommendationCard
        recommendations={data.recommendations}
      />

      {/* Projects */}
      <TopProjectsCard
        projects={data.topProjects}
      />
    </div>
  )
}