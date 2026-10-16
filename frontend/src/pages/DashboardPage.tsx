import { useParams, Link } from "react-router-dom"
import { ROUTES } from "@/routes/paths"
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
import {
  Award,
  Cpu,
  Code2,
  GitBranch,
  Sparkles,
  RefreshCw
} from "lucide-react"

export function DashboardPage() {
  const { username } = useParams<{ username: string }>()
  const { data, isLoading, isError, error, refetch } = useProfile(username ?? "")

  if (!username) {
    return (
      <div className="glass-card p-12 text-center max-w-xl mx-auto shadow-soft my-12">
        <h1 className="text-xl font-bold text-[#141414]">Invalid GitHub Username</h1>
        <p className="mt-2 text-sm text-[#64748B]">No username was specified in the route.</p>
        <Link to={ROUTES.home} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#036AFF] to-[#6366F1] px-5 py-2.5 text-xs font-bold text-white shadow-md">
          Return Home
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1440px] mx-auto animate-pulse">
        {/* Header skeleton */}
        <div className="flex justify-between items-center h-16 rounded-2xl bg-white/40 border border-white/60" />

        {/* Metric cards skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-28 rounded-2xl bg-white/40 border border-white/60" />
          <div className="h-28 rounded-2xl bg-white/40 border border-white/60" />
          <div className="h-28 rounded-2xl bg-white/40 border border-white/60" />
          <div className="h-28 rounded-2xl bg-white/40 border border-white/60" />
        </div>

        {/* Profile skeleton */}
        <div className="h-44 rounded-2xl bg-white/40 border border-white/60" />

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-80 rounded-2xl bg-white/40 border border-white/60" />
          <div className="h-80 rounded-2xl bg-white/40 border border-white/60" />
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="glass-card p-12 text-center max-w-xl mx-auto shadow-soft my-12">
        <h1 className="text-xl font-bold text-[#141414]">Unable to Load Intelligence</h1>
        <p className="mt-2 text-sm text-[#64748B]">
          {error instanceof Error ? error.message : "The profile data could not be fetched from GitHub."}
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

  const scoreVal = data.careerScore?.score ?? 85
  const devTypeVal = data.developerType?.developerType ?? "Software Engineer"
  const skillsCount = data.skills?.length ?? 0
  const projectsCount = data.topProjects?.length ?? 0

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141414] tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Analyze your GitHub profile and grow your developer career.
          </p>
        </div>

        <Link
          to={ROUTES.home}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#036AFF] via-[#6366F1] to-[#8B5CF6] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:opacity-95 transition-all self-start sm:self-auto"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Analyze New Profile</span>
        </Link>
      </div>

      {/* ── Quick Metric Cards Row ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Career Score */}
        <div className="glass-card p-4 shadow-soft transition-all hover:bg-white/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B]">Career Score</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 text-[#036AFF]">
              <Award className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#141414]">{scoreVal}</span>
            <span className="text-xs font-bold text-[#64748B]">/ 100</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold text-emerald-600">
              {scoreVal >= 80 ? "Exceptional" : scoreVal >= 65 ? "Strong" : "Good"}
            </span>
          </div>
        </div>

        {/* Metric 2: Developer Type */}
        <div className="glass-card p-4 shadow-soft transition-all hover:bg-white/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B]">Developer Type</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-50 text-[#8B5CF6]">
              <Cpu className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="mt-2.5 text-base sm:text-lg font-extrabold text-[#141414] truncate">
            {devTypeVal}
          </p>
          <div className="mt-2">
            <span className="inline-flex items-center rounded-lg bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-[#8B5CF6] border border-purple-100">
              AI Detected
            </span>
          </div>
        </div>

        {/* Metric 3: Top Skills */}
        <div className="glass-card p-4 shadow-soft transition-all hover:bg-white/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B]">Top Skills</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Code2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="mt-2.5 text-2xl sm:text-3xl font-extrabold text-[#141414]">
            {skillsCount}
          </p>
          <p className="mt-2 text-[11px] font-medium text-[#64748B]">
            Technologies & Frameworks
          </p>
        </div>

        {/* Metric 4: Top Projects */}
        <div className="glass-card p-4 shadow-soft transition-all hover:bg-white/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B]">Top Projects</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
              <GitBranch className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="mt-2.5 text-2xl sm:text-3xl font-extrabold text-[#141414]">
            {projectsCount}
          </p>
          <p className="mt-2 text-[11px] font-medium text-[#64748B]">
            Ranked Repositories
          </p>
        </div>
      </div>

      {/* ── GitHub Identity Header ─────────────────────────────────── */}
      <ProfileHeader profile={data.profile} />

      {/* ── Career Intelligence Grid ────────────────────────────────── */}
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

      {/* ── Role Fit Analysis ───────────────────────────────────────── */}
      {data.roleFit && data.roleFit.length > 0 && (
        <RoleFitCard roleFit={data.roleFit} />
      )}

      {/* ── Technical Skills ────────────────────────────────────────── */}
      <SkillsCard skills={data.skills} />

      {/* ── Strengths & Gaps ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StrengthsCard
          strengths={data.strengths || data.recruiter.strengths}
        />

        <GapAnalysisCard
          gaps={data.portfolioGaps || data.gaps}
        />
      </div>

      {/* ── Recommendations ─────────────────────────────────────────── */}
      <RecommendationCard
        recommendations={data.recommendations}
      />

      {/* ── Projects ────────────────────────────────────────────────── */}
      <TopProjectsCard
        projects={data.topProjects}
      />
    </div>
  )
}