import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { RankedProject } from "@/types/api"
import { GitBranch, Star, ExternalLink } from "lucide-react"

interface TopProjectsCardProps {
  projects: RankedProject[]
}

function ProjectCard({
  project,
  rank,
}: {
  project: RankedProject
  rank: number
}) {
  return (
    <article className="space-y-3.5 rounded-2xl border border-white/80 bg-white/60 p-4 shadow-sm transition-all hover:bg-white/80">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-5.5 w-5.5 items-center justify-center rounded-lg bg-gradient-to-tr from-[#036AFF] to-[#8B5CF6] text-[10px] font-extrabold text-white">
              #{rank}
            </span>
            <h3 className="truncate font-mono text-sm font-bold text-[#141414]">
              {project.repoName}
            </h3>
          </div>
        </div>

        {/* Project score */}
        <div className="shrink-0 text-right">
          <span className="text-[11px] font-semibold text-[#64748B] block">Score</span>
          <span className="text-base font-extrabold text-[#141414] tabular-nums">
            {project.score} <span className="text-[10px] font-medium text-[#64748B]">/ 100</span>
          </span>
        </div>
      </div>

      {/* Repository metadata */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
        {project.language && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/80 px-2.5 py-1 border border-white/80 font-medium text-[#141414]">
            <span
              className="h-2 w-2 rounded-full bg-[#036AFF]"
              aria-hidden="true"
            />
            {project.language}
          </span>
        )}

        <span className="inline-flex items-center gap-1 rounded-lg bg-white/80 px-2.5 py-1 border border-white/80 font-medium text-[#141414]">
          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
          {project.stars.toLocaleString()}
        </span>
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <ScoreItem label="Stars" value={project.breakdown.stars} />
        <ScoreItem label="README" value={project.breakdown.readme} />
        <ScoreItem label="Description" value={project.breakdown.description} />
        <ScoreItem label="Activity" value={project.breakdown.activity} />
        <ScoreItem label="Size" value={project.breakdown.size} />
      </div>

      {/* Repository link */}
      <div className="border-t border-white/80 pt-2.5 flex justify-end">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#036AFF] hover:underline"
          aria-label={`View ${project.repoName} on GitHub`}
        >
          <span>View Repository</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </article>
  )
}

function ScoreItem({
  label,
  value,
}: {
  label: string
  value?: string | number
}) {
  return (
    <div className="rounded-xl bg-white/80 border border-white/80 px-2 py-1.5 text-center">
      <p className="text-xs font-bold text-[#141414] truncate">
        {value ?? "-"}
      </p>
      <p className="text-[10px] font-semibold text-[#64748B]">
        {label}
      </p>
    </div>
  )
}

export function TopProjectsCard({
  projects,
}: TopProjectsCardProps) {
  if (!projects || projects.length === 0) {
    return (
      <Card id="projects" className="glass-card shadow-soft transition-all">
        <CardHeader>
          <CardTitle>Ranked Top Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
            <p className="text-sm font-medium text-[#141414]">
              No ranked projects available
            </p>
            <p className="mt-1 text-xs text-[#64748B]">
              Repository analysis did not produce any ranked projects.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card id="projects" className="glass-card shadow-soft transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#036AFF] border border-blue-100">
            <GitBranch className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Ranked Top Projects</CardTitle>
            <p className="text-xs text-[#64748B]">
              Ranked using engineering quality, activity, and documentation signals
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#64748B] bg-white/70 px-2.5 py-1 rounded-xl border border-white/80">
          {projects.length} Ranked
        </span>
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