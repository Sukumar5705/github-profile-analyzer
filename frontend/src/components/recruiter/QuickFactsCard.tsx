import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type {
  Profile,
  AnalysisSummary,
  DeveloperType,
  CareerScore,
} from "@/types/api"

/**
 * `Profile` as already defined in `@/types/api` only exposes the fields the
 * existing cards use (name, username, avatar_url, profile_url, bio,
 * public_repos). QuickFacts wants a few more raw GitHub fields — if
 * `Profile` already has them, this intersection is a harmless no-op;
 * otherwise it lets this file compile without editing the shared type.
 */


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
    { label: "Most Used Language", value: summary.mostUsedLanguage ?? null },
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
    <Card>
      <CardHeader>
        <CardTitle>Quick Facts</CardTitle>
        <p className="text-sm text-muted-foreground">At-a-glance cheat sheet</p>
      </CardHeader>
      <CardContent>
        {facts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data available.</p>
        ) : (
          <dl
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
            aria-label="Quick facts"
          >
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-lg border border-border p-2.5 space-y-0.5"
              >
                <dt className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide truncate">
                  {fact.label}
                </dt>
                <dd className="text-sm font-semibold text-foreground truncate tabular-nums">
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