import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useProfile } from "@/hooks/useProfileData"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/routes/paths"
import { 
  Copy, 
  Check, 
  Star, 
  ExternalLink, 
  Sparkles, 
  RefreshCw 
} from "lucide-react"

export function ResumePage() {
  const { username } = useParams<{ username: string }>()
  const { data, isLoading, isError, error, refetch } = useProfile(username ?? "")
  const [copied, setCopied] = useState(false)

  if (!username) {
    return (
      <div className="glass-card p-12 text-center max-w-xl mx-auto shadow-soft my-12">
        <h1 className="text-xl font-bold text-[#141414]">No Candidate Selected</h1>
        <p className="mt-2 text-sm text-[#64748B]">Select a candidate to view resume intelligence.</p>
        <Link to={ROUTES.home} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#036AFF] to-[#6366F1] px-5 py-2.5 text-xs font-bold text-white shadow-md">
          Return Home
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1440px] mx-auto animate-pulse">
        <div className="h-32 rounded-2xl bg-white/40 border border-white/60" />
        <div className="h-64 rounded-2xl bg-white/40 border border-white/60" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-56 rounded-2xl bg-white/40 border border-white/60" />
          <div className="h-56 rounded-2xl bg-white/40 border border-white/60" />
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="glass-card p-12 text-center max-w-xl mx-auto shadow-soft my-12">
        <h1 className="text-xl font-bold text-[#141414]">Unable to Load Resume Intelligence</h1>
        <p className="mt-2 text-sm text-[#64748B]">
          {error instanceof Error ? error.message : "Please analyze this profile first."}
        </p>
        <button
          type="button"
          onClick={() => { void refetch() }}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#036AFF] to-[#6366F1] px-5 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>
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
    <div className="space-y-6 max-w-[1440px] mx-auto">
      {/* ── Page Header Banner ──────────────────────────────────────── */}
      <header className="glass-card shadow-soft p-6 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-xl text-xs font-bold bg-white/80 text-[#141414] border border-white/80 shadow-sm">
                {seniority || "Senior Engineer"}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-xl text-xs font-bold bg-purple-50 text-[#8B5CF6] border border-purple-100">
                {developerType?.developerType || "Software Engineer"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#141414] leading-tight">
              {profile.name || `@${profile.username}`} — Resume Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Target Role: <strong className="font-bold text-[#141414]">{recommendedRole || `${seniority || "Senior Engineer"} - ${developerType?.developerType || "Software Engineer"}`}</strong>
            </p>
          </div>

          <Button
            onClick={copyHighlights}
            variant="default"
            size="sm"
            className="self-start sm:self-center shrink-0 shadow-md"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Copied Bullet Points!" : "Copy Resume Highlights"}</span>
          </Button>
        </div>
      </header>

      {/* ── Section 1: AI Resume Highlights ─────────────────────────── */}
      <Card className="glass-card shadow-soft transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#036AFF] border border-blue-100">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Impact-Driven Resume Highlights</CardTitle>
              <p className="text-xs text-[#64748B]">
                Citable, metrics-backed bullet points optimized for technical leadership resumes
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {highlights.map((highlight, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-xl border border-white/80 bg-white/50 p-3.5 shadow-sm"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-[#036AFF] to-[#8B5CF6] text-[11px] font-bold text-white tabular-nums mt-0.5 shadow-sm">
                {idx + 1}
              </span>
              <p className="text-xs sm:text-sm text-[#141414] leading-relaxed font-medium">
                {highlight}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Section 2: Portfolio Showcase Projects ──────────────────── */}
      {showcaseEntries.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#141414]">
              Featured Portfolio Showcase
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
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
                  className="glass-card p-5 shadow-soft flex flex-col justify-between space-y-3.5 transition-all hover:bg-white/80"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-xl bg-purple-50 border border-purple-100 px-2.5 py-0.5 text-xs font-bold text-[#8B5CF6]">
                        {catLabel}
                      </span>
                      {project.score > 0 && (
                        <span className="text-xs font-semibold text-[#64748B] tabular-nums">
                          Score: <strong className="text-[#141414] font-extrabold">{project.score}/100</strong>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-mono text-sm font-bold text-[#141414] truncate">
                        {project.repoName}
                      </h3>
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#64748B] hover:text-[#036AFF] transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                          aria-label={`View ${project.repoName} on GitHub`}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>

                    <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3">
                      {project.reason}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/80 text-xs text-[#64748B]">
                    <span className="font-medium text-[#141414]">{project.language || "Multi-language"}</span>
                    <span className="flex items-center gap-1 font-bold text-[#141414]">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      {(project.stars || 0).toLocaleString()}
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Section 3: Verifiable Resume Evidence by Category ────────── */}
      {resumeEvidence && Object.keys(resumeEvidence).length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#141414]">
              Verifiable Evidence by Domain
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Direct mapping of claimed technical proficiencies to GitHub repository proof
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(resumeEvidence).map(([domain, dataObj]) => {
              if (!dataObj) return null
              return (
                <div
                  key={domain}
                  className="glass-card p-5 space-y-3 shadow-soft"
                >
                  <h3 className="text-sm font-bold text-[#141414] capitalize">
                    {domain.replace(/([A-Z])/g, " $1")}
                  </h3>

                  {dataObj.claim && (
                    <div className="rounded-xl border border-white/80 bg-white/60 p-3 text-xs text-[#141414] font-semibold">
                      {dataObj.claim}
                    </div>
                  )}

                  {Array.isArray(dataObj.evidence) && dataObj.evidence.length > 0 && (
                    <ul className="space-y-1.5 text-xs text-[#64748B]">
                      {dataObj.evidence.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#036AFF] mt-1.5 shrink-0" />
                          <span className="leading-relaxed font-medium">{item}</span>
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
