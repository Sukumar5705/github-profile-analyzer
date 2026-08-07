import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { RankedProject } from "@/types/api"

interface TopProjectsCardProps {
  projects: RankedProject[]
}

/**
 * Displays one ranked GitHub repository.
 */
function ProjectCard({
  project,
  rank,
}: {
  project: RankedProject
  rank: number
}) {
  return (
    <article className="space-y-4 rounded-lg border border-border p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            #{rank} Project
          </p>

          <h3 className="mt-1 truncate font-mono text-sm font-semibold text-foreground">
            {project.repoName}
          </h3>
        </div>

        {/* Project score */}
        <div className="flex-shrink-0 text-right">
          <p className="text-xs text-muted-foreground">
            Project Score
          </p>

          <p className="text-lg font-semibold text-foreground">
            {project.score}
          </p>
        </div>
      </div>

      {/* Repository metadata */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        {project.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full bg-primary/60"
              aria-hidden="true"
            />

            {project.language}
          </span>
        )}

        <span className="flex items-center gap-1">
          <StarIcon />

          {project.stars}
        </span>
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <ScoreItem
          label="Stars"
          value={project.breakdown.stars}
        />

        <ScoreItem
          label="README"
          value={project.breakdown.readme}
        />

        <ScoreItem
          label="Description"
          value={project.breakdown.description}
        />

        <ScoreItem
          label="Activity"
          value={project.breakdown.activity}
        />

        <ScoreItem
          label="Size"
          value={project.breakdown.size}
        />
      </div>

      {/* Repository link */}
      <div className="border-t border-border pt-3">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`View ${project.repoName} on GitHub`}
        >
          View repository

          <ExternalLinkIcon />
        </a>
      </div>
    </article>
  )
}

/**
 * Small reusable score breakdown item.
 */
function ScoreItem({
  label,
  value,
}: {
  label: string
  value?: string | number
}) {
  return (
    <div className="rounded-md bg-muted/50 px-2 py-2 text-center">
      <p className="text-sm font-semibold text-foreground truncate">
        {value ?? "-"}
      </p>

      <p className="mt-0.5 text-[11px] text-muted-foreground">
        {label}
      </p>
    </div>
  )
}

/**
 * Main Top Projects dashboard card.
 */
export function TopProjectsCard({
  projects,
}: TopProjectsCardProps) {
  /*
   * Defensive handling in case an analyzed profile
   * does not contain any ranked repositories.
   */
  if (!projects || projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Projects</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-sm font-medium text-foreground">
              No ranked projects available
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Repository analysis did not produce any ranked projects.
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
          Repositories ranked using engineering quality,
          documentation, activity, size, and community signals.
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {projects.map((project, index) => (
          <ProjectCard
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
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  )
}