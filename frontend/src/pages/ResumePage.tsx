import { useState } from "react"
import { useParams } from "react-router-dom"
import { useProfile } from "@/hooks/useProfileData"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ResumePage() {
  const { username } = useParams<{ username: string }>()
  const { data, isLoading, isError, error } = useProfile(username ?? "")
  const [copied, setCopied] = useState(false)

  if (!username) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-base font-medium text-foreground">No candidate selected</p>
        <p className="mt-2 text-sm text-muted-foreground">Select a candidate to view resume intelligence.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse" aria-busy="true">
        <div className="h-32 rounded-xl bg-muted border border-border" />
        <div className="h-64 rounded-xl bg-muted border border-border" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-56 rounded-xl bg-muted border border-border" />
          <div className="h-56 rounded-xl bg-muted border border-border" />
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-base font-medium text-foreground">Unable to load resume intelligence</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Please analyze this profile first."}
        </p>
      </div>
    )
  }

  const {
    profile,
    developerType,
    seniority,
    recommendedRole,
    resumeHighlights,
    resumeEvidence,
    portfolioShowcase,
    strengths
  } = data

  const highlights = (resumeHighlights && resumeHighlights.length > 0)
    ? resumeHighlights
    : (strengths && strengths.length > 0 ? strengths : [
        `Architected and maintained key open-source repositories using ${data.summary?.mostUsedLanguage || 'modern languages'}.`,
        `Demonstrated technical leadership across ${data.summary?.totalStars || 0} GitHub stars and ${data.summary?.totalForks || 0} community forks.`
      ])

  const copyHighlights = () => {
    const text = highlights.map(h => `• ${h}`).join("\n")
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const showcaseEntries = portfolioShowcase ? Object.entries(portfolioShowcase).filter(([, p]) => p && p.repoName) : []

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <header className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-foreground border border-border">
                {seniority || "Senior Engineer"}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-muted-foreground border border-border">
                {developerType?.developerType || "Software Engineer"}
              </span>
            </div>
            <h1 className="text-xl font-semibold text-foreground leading-tight">
              {profile.name || `@${profile.username}`} — Resume Intelligence
            </h1>
            <p className="text-sm text-muted-foreground">
              Target Role: <strong className="font-semibold text-foreground">{recommendedRole || `${seniority} - ${developerType?.developerType}`}</strong>
            </p>
          </div>

          <Button
            onClick={copyHighlights}
            variant="default"
            size="sm"
            className="self-start sm:self-center shrink-0"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Copied Bullet Points!" : "Copy Resume Highlights"}
          </Button>
        </div>
      </header>

      {/* Section 1: AI Resume Highlights (Bullet points for resume) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Impact-Driven Resume Highlights</CardTitle>
          <p className="text-sm text-muted-foreground">
            Citable, metrics-backed bullet points optimized for technical leadership resumes
          </p>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {highlights.map((highlight, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-lg border border-border p-3.5"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground tabular-nums mt-0.5">
                {idx + 1}
              </span>
              <p className="text-sm text-foreground leading-relaxed font-normal">
                {highlight}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section 2: Portfolio Showcase Projects */}
      {showcaseEntries.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Featured Portfolio Showcase
            </h2>
            <p className="text-sm text-muted-foreground">
              Flagship repositories highlighting distinct engineering dimensions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showcaseEntries.map(([categoryKey, project]) => {
              if (!project || !project.repoName) return null

              const categoryLabels: Record<string, string> = {
                resumeProject: "Resume Flagship",
                technicalProject: "Technical Deep-Dive",
                recruiterProject: "Recruiter Spotlight",
                architectureProject: "Systems Architecture"
              }

              const catLabel = categoryLabels[categoryKey] || "Showcase Project"

              return (
                <article
                  key={categoryKey}
                  className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between space-y-3.5"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-md border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground">
                        {catLabel}
                      </span>
                      {project.score > 0 && (
                        <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                          Score: <strong className="text-foreground">{project.score}/100</strong>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-mono text-sm font-semibold text-foreground truncate">
                        {project.repoName}
                      </h3>
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 text-xs"
                          aria-label={`View ${project.repoName} on GitHub`}
                        >
                          <ExternalLinkIcon />
                        </a>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {project.reason}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
                    <span>{project.language || "Multi-language"}</span>
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <StarIcon />
                      {(project.stars || 0).toLocaleString()}
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* Section 3: Verifiable Resume Evidence by Category */}
      {resumeEvidence && Object.keys(resumeEvidence).length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Verifiable Evidence by Domain
            </h2>
            <p className="text-sm text-muted-foreground">
              Direct mapping of claimed technical proficiencies to GitHub repository proof
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(resumeEvidence).map(([domain, dataObj]) => {
              if (!dataObj) return null
              return (
                <div
                  key={domain}
                  className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-sm"
                >
                  <h3 className="text-sm font-semibold text-foreground capitalize">
                    {domain.replace(/([A-Z])/g, " $1")}
                  </h3>

                  {dataObj.claim && (
                    <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-foreground font-medium">
                      {dataObj.claim}
                    </div>
                  )}

                  {Array.isArray(dataObj.evidence) && dataObj.evidence.length > 0 && (
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {dataObj.evidence.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary/70 mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  )
}
