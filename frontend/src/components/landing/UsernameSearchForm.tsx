import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../../routes/paths"
import { Search, ArrowRight } from "lucide-react"

const SUGGESTED_PROFILES = [
  { username: "torvalds", label: "torvalds", title: "Linux & Git Creator" },
  { username: "gaearon", label: "gaearon", title: "Dan Abramov (React)" },
  { username: "sindresorhus", label: "sindresorhus", title: "Open Source Author" },
  { username: "tj", label: "tj", title: "TJ Holowaychuk (Express/Koa)" },
] as const

export function UsernameSearchForm() {
  const [username, setUsername] = useState<string>("")
  const [validationError, setValidationError] = useState<string | null>(null)
  const navigate = useNavigate()

  function handleAnalyze(targetUsername: string) {
    const trimmed = targetUsername.trim().replace(/^@/, "")
    if (!trimmed) {
      setValidationError("Please enter a GitHub username.")
      return
    }
    // Basic character validation (GitHub allows alphanumeric and hyphens)
    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(trimmed)) {
      setValidationError("Invalid GitHub username format.")
      return
    }
    setValidationError(null)
    // Navigate immediately to the loading screen — analysis is kicked off there.
    navigate(ROUTES.analyzing(trimmed))
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    handleAnalyze(username)
  }

  function handleProfileClick(name: string) {
    setUsername(name)
    handleAnalyze(name)
  }

  const hasError = validationError !== null

  return (
    <div className="w-full">
      {/* ── Main Input Card ───────────────────────────────────────── */}
      <form onSubmit={handleSubmit} noValidate className="relative">
        <div
          className={`group relative flex flex-col sm:flex-row items-stretch sm:items-center rounded-2xl border bg-white p-2 transition-all duration-200 shadow-card ${
            hasError
              ? "border-red-300 ring-4 ring-red-50/70"
              : "border-[#E2E8F0] hover:border-slate-300 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100"
          }`}
        >
          {/* Left search icon & prefix */}
          <div className="flex items-center pl-3.5 pr-1 py-2 sm:py-0 text-[#64748B]">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <span className="ml-2 font-mono text-sm text-slate-400 select-none">
              github.com/
            </span>
          </div>

          {/* Text Input */}
          <input
            id="github-username-input"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              if (validationError) setValidationError(null)
            }}
            placeholder="Enter GitHub username..."
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-label="GitHub username to analyze"
            aria-describedby={hasError ? "search-error" : undefined}
            aria-invalid={hasError}
            className="min-w-0 flex-1 bg-transparent px-2 py-2.5 font-mono text-sm sm:text-base font-medium text-[#0F172A] placeholder:text-slate-400 placeholder:font-sans focus:outline-none"
          />

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={!username.trim()}
            aria-label="Analyze Profile"
            className="mt-2 sm:mt-0 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#1D4ED8] hover:shadow active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <span>Analyze Profile</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Inline Validation Error */}
        {hasError && (
          <div
            id="search-error"
            role="alert"
            className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700 border border-red-200"
          >
            <span>{validationError}</span>
          </div>
        )}
      </form>

      {/* Suggested Profiles Pill Row */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
        <span className="font-medium text-slate-500">Explore with:</span>
        <div className="flex flex-wrap items-center gap-1.5">
          {SUGGESTED_PROFILES.map((profile) => (
            <button
              key={profile.username}
              type="button"
              onClick={() => handleProfileClick(profile.username)}
              title={profile.title}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs font-mono text-slate-700 shadow-subtle transition-all hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 active:scale-95 cursor-pointer"
            >
              <span>{profile.label}</span>
              <span className="text-[10px] text-slate-400">↵</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
