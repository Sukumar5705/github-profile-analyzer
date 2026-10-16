import { Button } from "@/components/ui/button"
import type { Profile } from "@/types/api"
import { Users, BookOpen, MapPin, ExternalLink } from "lucide-react"

interface ProfileHeaderProps {
  profile: Profile
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="glass-card p-6 shadow-soft transition-all">
      <div className="flex flex-col sm:flex-row gap-5 sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center min-w-0">
          {/* Avatar with subtle gradient ring */}
          <div className="relative shrink-0">
            <img
              src={profile.avatar_url}
              alt={`${profile.name ?? profile.username}'s avatar`}
              className="h-18 w-18 sm:h-20 sm:w-20 rounded-2xl ring-2 ring-white/80 object-cover shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          {/* Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-[#141414] leading-tight">
                {profile.name ?? profile.username}
              </h1>
              <span className="rounded-lg bg-white/80 border border-white/80 px-2 py-0.5 text-xs font-mono font-semibold text-[#036AFF]">
                @{profile.username}
              </span>
            </div>

            {profile.bio && (
              <p className="text-sm text-[#64748B] mt-1.5 max-w-2xl leading-relaxed">
                {profile.bio}
              </p>
            )}

            {/* Quick badges */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-[#64748B]">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/60 px-2.5 py-1 border border-white/60">
                <Users className="h-3.5 w-3.5 text-[#036AFF]" />
                <strong className="text-[#141414]">{profile.followers.toLocaleString()}</strong> followers
              </span>

              {profile.following !== undefined && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/60 px-2.5 py-1 border border-white/60">
                  <strong className="text-[#141414]">{profile.following.toLocaleString()}</strong> following
                </span>
              )}

              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/60 px-2.5 py-1 border border-white/60">
                <BookOpen className="h-3.5 w-3.5 text-[#8B5CF6]" />
                <strong className="text-[#141414]">{profile.public_repos.toLocaleString()}</strong> repositories
              </span>

              {profile.location && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/60 px-2.5 py-1 border border-white/60">
                  <MapPin className="h-3.5 w-3.5 text-[#64748B]" />
                  <span>{profile.location}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <div className="shrink-0 pt-2 sm:pt-0">
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => window.open(profile.profile_url, "_blank", "noopener,noreferrer")}
            aria-label={`View ${profile.username}'s GitHub profile`}
          >
            <span>GitHub Profile</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#64748B]" />
          </Button>
        </div>
      </div>
    </div>
  )
}
