import { Button } from "@/components/ui/button"
import type { Profile, CareerScore, DeveloperType } from "@/types/api"
import { ExternalLink, Calendar, Sparkles } from "lucide-react"

interface RecruiterHeaderProps {
  profile: Profile
  careerScore: CareerScore
  developerType: DeveloperType
  analyzedAt?: string
}

export function RecruiterHeader({
  profile,
  careerScore,
  developerType,
  analyzedAt,
}: RecruiterHeaderProps) {
  const score = careerScore.score
  const scoreColor = score >= 80
    ? "text-emerald-600"
    : score >= 60
    ? "text-[#036AFF]"
    : "text-amber-600"

  const formattedDate = analyzedAt
    ? new Date(analyzedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null

  return (
    <header className="glass-card shadow-soft p-6 transition-all">
      <div className="flex flex-col sm:flex-row gap-5 sm:items-center justify-between">
        {/* Candidate Identity */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative shrink-0">
            <img
              src={profile.avatar_url}
              alt={`${profile.name ?? profile.username}'s avatar`}
              className="h-16 w-16 rounded-2xl ring-2 ring-white/80 object-cover shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-[#141414] leading-tight">
                {profile.name ?? profile.username}
              </h1>
              <span className="rounded-lg bg-white/80 border border-white/80 px-2 py-0.5 text-xs font-mono font-semibold text-[#036AFF]">
                @{profile.username}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-xl bg-purple-50 border border-purple-100 px-2.5 py-0.5 text-xs font-bold text-[#8B5CF6]">
                <Sparkles className="h-3 w-3" />
                {developerType.developerType}
              </span>
              {formattedDate && (
                <span className="inline-flex items-center gap-1 text-xs text-[#64748B]">
                  <Calendar className="h-3 w-3 text-[#64748B]" />
                  Analyzed {formattedDate}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Score & Actions */}
        <div className="flex items-center gap-4 self-start sm:self-center">
          <div className="text-right">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              Career Score
            </p>
            <p className={`text-3xl font-extrabold tabular-nums leading-tight ${scoreColor}`}>
              {score}
              <span className="text-sm font-semibold text-[#64748B]"> / 100</span>
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(profile.profile_url, "_blank", "noopener,noreferrer")
            }
            aria-label={`View ${profile.username}'s GitHub profile`}
          >
            <span>GitHub</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#64748B]" />
          </Button>
        </div>
      </div>
    </header>
  )
}