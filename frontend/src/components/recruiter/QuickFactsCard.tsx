import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type {
  Profile,
  AnalysisSummary,
  DeveloperType,
  CareerScore,
} from "@/types/api"
import { Layers } from "lucide-react"

interface QuickFactsCardProps {
  profile: Profile
  summary: AnalysisSummary
  developerType: DeveloperType
  careerScore: CareerScore
}

interface FactDefinition {
  label: string
  value: string | null
}

function buildFacts(
  profile: Profile,
  summary: AnalysisSummary,
  developerType: DeveloperType,
  careerScore: CareerScore
): FactDefinition[] {
  const repos = summary.totalRepos ?? profile.public_repos

  return [
    { label: "Repositories", value: repos != null ? repos.toLocaleString() : null },
    {
      label: "Followers",
      value: profile.followers != null ? profile.followers.toLocaleString() : null,
    },
    { label: "Top Language", value: summary.mostUsedLanguage ?? null },
    {
      label: "Total Stars",
      value: summary.totalStars != null ? summary.totalStars.toLocaleString() : null,
    },
    {
      label: "Total Forks",
      value: summary.totalForks != null ? summary.totalForks.toLocaleString() : null,
    },
    { label: "Developer Type", value: developerType.developerType ?? null },
    {
      label: "Career Score",
      value: careerScore.score != null ? `${careerScore.score}/100` : null,
    },
    {
      label: "Confidence",
      value:
        developerType.confidence != null
          ? `${Math.round(developerType.confidence * 100)}%`
          : null,
    },
    { label: "Location", value: profile.location ?? null },
    { label: "Company", value: profile.company ?? null },
  ]
}

export function QuickFactsCard({
  profile,
  summary,
  developerType,
  careerScore,
}: QuickFactsCardProps) {
  const facts = buildFacts(profile, summary, developerType, careerScore).filter(
    (fact) => fact.value !== null && fact.value !== ""
  )

  return (
    <Card className="glass-card shadow-soft transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-[#8B5CF6] border border-purple-100">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Quick Facts Matrix</CardTitle>
            <p className="text-xs text-[#64748B]">At-a-glance technical metrics summary</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {facts.length === 0 ? (
          <p className="text-xs text-[#64748B]">No data available.</p>
        ) : (
          <dl
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
            aria-label="Quick facts"
          >
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-xl border border-white/80 bg-white/50 p-3 space-y-0.5 shadow-sm"
              >
                <dt className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider truncate">
                  {fact.label}
                </dt>
                <dd className="text-sm font-extrabold text-[#141414] truncate tabular-nums">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </CardContent>
    </Card>
  )
}