import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { RankedProject } from "@/types/api"
import { GitBranch, Star, ExternalLink } from "lucide-react"

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
  const whyItMatters = buildImpactLine(project)

  return (
    <article
      className="rounded-2xl border border-white/80 bg-white/60 p-4 space-y-3 shadow-sm transition-all hover:bg-white/80"
      aria-label={`Project ${rank}: ${project.repoName}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-5.5 w-5.5 items-center justify-center rounded-lg bg-gradient-to-tr from-[#036AFF] to-[#8B5CF6] text-[10px] font-extrabold text-white">
              #{rank}
            </span>
            <h3 className="font-mono text-sm font-bold text-[#141414] truncate">
              {project.repoName}
            </h3>
          </div>
        </div>

        {/* Stars */}
        {project.stars > 0 && (
          <div className="flex items-center gap-1 shrink-0 text-xs font-semibold text-[#141414] bg-white/80 px-2 py-0.5 rounded-lg border border-white/80">
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            <span className="tabular-nums">
              {project.stars.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Meta: language + why it matters */}
      <div className="space-y-1.5">
        {project.language && (
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <span
              className="h-2 w-2 rounded-full bg-[#036AFF] shrink-0"
              aria-hidden="true"
            />
            <span className="font-medium text-[#141414]">{project.language}</span>
          </div>
        )}
        {whyItMatters && (
          <p className="text-xs sm:text-sm text-[#141414] leading-relaxed font-medium">
            {whyItMatters}
          </p>
        )}
      </div>

      {/* GitHub link */}
      <div className="pt-1 border-t border-white/80 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            window.open(project.repoUrl, "_blank", "noopener,noreferrer")
          }
          aria-label={`View ${project.repoName} on GitHub`}
        >
          <span>View on GitHub</span>
          <ExternalLink className="h-3 w-3 text-[#64748B]" />
        </Button>
      </div>
    </article>
  )
}

function buildImpactLine(project: RankedProject): string {
  const parts: string[] = []

  if (project.stars >= 1000) {
    parts.push(`Community favorite with ${project.stars.toLocaleString()} stars`)
  } else if (project.stars >= 100) {
    parts.push(`Gained traction with ${project.stars.toLocaleString()} stars`)
  } else if (project.stars > 0) {
    parts.push(`${project.stars} community stars`)
  }

  if (project.breakdown?.readme && Number(project.breakdown.readme) >= 20) {
    parts.push("well-documented architecture")
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
      <Card className="glass-card shadow-soft transition-all">
        <CardHeader>
          <CardTitle>Top Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
            <p className="text-xs text-[#64748B]">
              No projects available.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card shadow-soft transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#036AFF] border border-blue-100">
            <GitBranch className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Top Projects</CardTitle>
            <p className="text-xs text-[#64748B]">
              Most impactful public repositories for candidate evaluation
            </p>
          </div>
        </div>
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