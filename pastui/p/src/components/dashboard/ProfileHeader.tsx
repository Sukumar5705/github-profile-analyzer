import { Button } from "@/components/ui/button"
import type { Profile } from "@/types/api"

interface ProfileHeaderProps {
  profile: Profile
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="rounded-xl border border-border bg-white shadow-sm p-6">
      <div className="flex flex-col sm:flex-row gap-5 sm:items-start">
        {/* Avatar */}
        <img
          src={profile.avatar_url}
          alt={`${profile.name ?? profile.username}'s avatar`}
          className="h-20 w-20 rounded-full ring-2 ring-border flex-shrink-0"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-foreground leading-tight">
                {profile.name ?? profile.username}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">@{profile.username}</p>
              {profile.bio && (
                <p className="text-sm text-foreground/80 mt-2 max-w-prose leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="sm:flex-shrink-0 self-start"
              onClick={() => window.open(profile.profile_url, "_blank", "noopener,noreferrer")}
              aria-label={`View ${profile.username}'s GitHub profile`}
            >
              <GitHubIcon />
              GitHub
            </Button>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4">
            <Stat label="Followers" value={profile.followers} />
            {profile.following !== undefined && (
              <Stat label="Following" value={profile.following} />
            )}
            <Stat label="Repositories" value={profile.public_repos} />
            {profile.location && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <LocationIcon />
                {profile.location}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span className="text-sm text-muted-foreground">
      <span className="font-semibold text-foreground tabular-nums">
        {value.toLocaleString()}
      </span>{" "}
      {label}
    </span>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
      <path d="M8 0C5.24 0 3 2.24 3 5c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5zm0 6.5C7.17 6.5 6.5 5.83 6.5 5S7.17 3.5 8 3.5 9.5 4.17 9.5 5 8.83 6.5 8 6.5z" />
    </svg>
  )
}
