import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { RankedProject } from "@/types/api"

interface TopProjectsCardProps {
  projects: RankedProject[]
}

function ProjectRow({
  project,
  rank,
}: {
  project: RankedProject
  rank: number
}) {
  // Derive a recruiter-friendly "why it matters" from available signals.
  const whyItMatters = buildImpactLine(project)

  return (
    <article
      className="rounded-lg border border-border p-4 space-y-3"
      aria-label={`Project ${rank}: ${project.repoName}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            #{rank}
          </p>
          <h3 className="mt-0.5 font-mono text-sm font-semibold text-foreground truncate">
            {project.repoName}
          </h3>
        </div>

        {/* Stars — the one metric recruiters understand */}
        {project.stars > 0 && (
          <div className="flex items-center gap-1 flex-shrink-0 text-xs text-muted-foreground">
            <StarIcon />
            <span className="tabular-nums font-medium text-foreground">
              {project.stars.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Meta: language + why it matters */}
      <div className="space-y-1.5">
        {project.language && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="h-2.5 w-2.5 rounded-full bg-primary/60 flex-shrink-0"
              aria-hidden="true"
            />
            {project.language}
          </div>
        )}
        {whyItMatters && (
          <p className="text-sm text-foreground/80 leading-relaxed">
            {whyItMatters}
          </p>
        )}
      </div>

      {/* GitHub link */}
      <div className="pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            window.open(project.repoUrl, "_blank", "noopener,noreferrer")
          }
          aria-label={`View ${project.repoName} on GitHub`}
        >
          View on GitHub
          <ExternalLinkIcon />
        </Button>
      </div>
    </article>
  )
}

/**
 * Derives a short human-readable impact sentence from project signals.
 * Recruiters want to understand "why does this repo matter?" without
 * reading technical score breakdowns.
 */
function buildImpactLine(project: RankedProject): string {
  const parts: string[] = []

  if (project.stars >= 1000) {
    parts.push(`Community favourite with ${project.stars.toLocaleString()} stars`)
  } else if (project.stars >= 100) {
    parts.push(`Gained traction with ${project.stars.toLocaleString()} stars`)
  } else if (project.stars > 0) {
    parts.push(`${project.stars} community stars`)
  }

  if (project.breakdown?.readme && Number(project.breakdown.readme) >= 20) {
    parts.push("well-documented")
  }

  if (project.breakdown?.activity && Number(project.breakdown.activity) >= 15) {
    parts.push("actively maintained")
  }

  if (project.breakdown?.size && Number(project.breakdown.size) >= 15) {
    parts.push("substantial codebase")
  }

  if (parts.length === 0) return ""

  const [first, ...rest] = parts
  const joined =
    rest.length > 0
      ? `${first.charAt(0).toUpperCase() + first.slice(1)}, ${rest.join(", ")}.`
      : `${first.charAt(0).toUpperCase() + first.slice(1)}.`

  return joined
}

export function TopProjectsCard({ projects }: TopProjectsCardProps) {
  if (!projects || projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No projects available.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Projects</CardTitle>
        <p className="text-sm text-muted-foreground">
          Most impactful public repositories
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {projects.slice(0, 5).map((project, index) => (
          <ProjectRow
            key={project.repoName}
            project={project}
            rank={index + 1}
          />
        ))}
      </CardContent>
    </Card>
  )
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 fill-current"
      aria-hidden="true"
    >
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  )
}