import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../../routes/paths"
import { ArrowRight } from "lucide-react"

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
    <form onSubmit={handleSubmit} noValidate aria-label="Analyze a GitHub profile">
      <label htmlFor="github-username-input" className="sr-only">
        GitHub username
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Field: the fixed prefix and the input read as one URL */}
        <div
          className={`flex h-12 w-full min-w-0 items-center sm:flex-1 rounded-lg border bg-white px-3.5 transition-colors ${
            hasError
              ? "border-red-500 focus-within:ring-4 focus-within:ring-red-100"
              : "border-slate-300 hover:border-slate-400 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15"
          }`}
        >
          <span
            aria-hidden="true"
            className="select-none font-mono text-sm text-slate-500"
          >
            github.com/
          </span>
          <input
            id="github-username-input"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              if (validationError) setValidationError(null)
            }}
            placeholder="username"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-describedby={hasError ? "search-error" : "search-hint"}
            aria-invalid={hasError}
            className="h-full min-w-0 flex-1 bg-transparent pl-0.5 font-mono text-base font-medium text-slate-900 placeholder:font-mono placeholder:font-normal placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={!username.trim()}
          className="inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Analyze profile
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* One line under the field: hint by default, error when invalid */}
      {hasError ? (
        <p
          id="search-error"
          role="alert"
          className="mt-2.5 text-sm font-medium text-red-700"
        >
          {validationError}
        </p>
      ) : (
        <p id="search-hint" className="mt-2.5 text-sm text-slate-500">
          Enter any public GitHub username.
        </p>
      )}

      {/* Examples */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="text-slate-500">Try</span>
        {SUGGESTED_PROFILES.map((profile) => (
          <button
            key={profile.username}
            type="button"
            onClick={() => handleProfileClick(profile.username)}
            title={profile.title}
            className="-mx-1 cursor-pointer rounded px-1 py-1.5 font-mono text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {profile.label}
          </button>
        ))}
      </div>
    </form>
  )
}
