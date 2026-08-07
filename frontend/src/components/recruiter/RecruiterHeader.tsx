import { Button } from "@/components/ui/button"
import type { Profile, CareerScore, DeveloperType } from "@/types/api"

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
    ? "text-success"
    : score >= 60
    ? "text-warning"
    : "text-destructive"

  const formattedDate = analyzedAt
    ? new Date(analyzedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null

  return (
    <header className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
        {/* Avatar */}
        <img
          src={profile.avatar_url}
          alt={`${profile.name ?? profile.username}'s avatar`}
          className="h-16 w-16 rounded-full ring-2 ring-border flex-shrink-0"
        />

        {/* Identity */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-foreground leading-tight">
                {profile.name ?? profile.username}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                @{profile.username}
              </p>

              {/* Developer type badge */}
              <span className="mt-2 inline-flex items-center rounded-md border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground">
                {developerType.developerType}
              </span>
            </div>

            {/* Right side: score + actions */}
            <div className="flex items-center gap-4 sm:flex-shrink-0">
              {/* Career score */}
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Career Score
                </p>
                <p className={`text-3xl font-bold tabular-nums leading-tight ${scoreColor}`}>
                  {score}
                  <span className="text-base font-normal text-muted-foreground">/100</span>
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
                <GitHubIcon />
                GitHub
              </Button>
            </div>
          </div>

          {/* Last analyzed */}
          {formattedDate && (
            <p className="mt-3 text-xs text-muted-foreground">
              Last analyzed{" "}
              <time dateTime={analyzedAt}>{formattedDate}</time>
            </p>
          )}
        </div>
      </div>
    </header>
  )
}

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4 fill-current"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}