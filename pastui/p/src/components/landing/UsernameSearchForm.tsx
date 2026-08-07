/**
 * UsernameSearchForm
 *
 * The only interactive element on the landing page.
 * Owns the full search → analyze → navigate flow.
 *
 * State:
 *   username (string)  — controlled input value
 *
 * Side effects:
 *   mutate(username)   — POST /api/github/analyze/:username
 *   navigate(...)      — React Router programmatic navigation on success
 *
 * Three render states:
 *   Idle     → normal input + "Analyze →" button
 *   Pending  → input disabled + spinner + "Analyzing…" button
 *   Error    → inline error message below form
 */

import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useAnalyzeProfile } from "../../hooks/useAnalyzeProfile"
import { ROUTES } from "../../routes/paths"

// ── Example usernames shown below the input ──────────────────────────────────
// Real GitHub accounts with interesting profiles for demo purposes.
const EXAMPLE_USERNAMES = ["torvalds", "gaearon", "sindresorhus"] as const

export function UsernameSearchForm() {
  // ── Local state ────────────────────────────────────────────────────────────
  // useState<string> — controlled input. The type annotation is explicit
  // so TypeScript knows this is always a string, never undefined/null.
  const [username, setUsername] = useState<string>("")

  // ── React Router navigation ────────────────────────────────────────────────
  // useNavigate() returns a function. Calling navigate("/path") pushes a new
  // route onto the browser history stack without a full page reload.
  const navigate = useNavigate()

  // ── TanStack Query mutation ────────────────────────────────────────────────
  // Destructure exactly what we need from the mutation object.
  // isPending  → true while the API request is in flight
  // isError    → true if the request failed
  // error      → the Error object (message comes from our axios interceptor)
  const { mutate, isPending, isError, error } = useAnalyzeProfile()

  // ── Submit handler ─────────────────────────────────────────────────────────
  // FormEvent<HTMLFormElement> is the correct type for an HTML form's
  // onSubmit event. We call e.preventDefault() to stop the browser from
  // doing a full page reload (the default form behavior).
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const trimmed = username.trim()
    if (!trimmed) return // Guard: don't submit whitespace-only

    // mutate() fires the API call.
    // The second argument is a callbacks object — onSuccess fires when the
    // POST /api/github/analyze/:username call completes successfully.
    mutate(trimmed, {
      onSuccess: () => {
        // ROUTES.dashboard(trimmed) returns "/dashboard/torvalds" etc.
        // navigate() uses React Router — no page reload, cache is preserved.
        navigate(ROUTES.dashboard(trimmed))
      },
    })
  }

  // ── Click handler for example username pills ───────────────────────────────
  function handleExampleClick(name: string) {
    setUsername(name)
  }

  return (
    <div className="mx-auto max-w-xl">

      {/* ── Form ──────────────────────────────────────────────────────────────
          noValidate disables the browser's built-in HTML5 validation UI
          (the yellow tooltip popup). We handle validation ourselves inline. */}
      <form onSubmit={handleSubmit} noValidate>

        {/* ── CLI-styled input group ──────────────────────────────────────────
            overflow-hidden on the container clips the button's rounded corners
            so the whole group feels like one connected element.
            focus-within: styles apply when ANY child is focused — so the
            entire container gets the blue ring when the input is active. */}
        <div
          className="flex items-center overflow-hidden rounded-xl
                     border-2 border-gray-200 bg-white shadow-md
                     transition-all duration-200
                     focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50"
        >
          {/* CLI prefix — decorative, hidden from screen readers */}
          <span
            aria-hidden="true"
            className="shrink-0 select-none pl-4 font-mono text-sm text-gray-400"
          >
            analyze /
          </span>

          {/* Username text input */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your-github-username"
            disabled={isPending}
            autoComplete="off"
            autoCapitalize="none"    // Don't capitalize on mobile
            autoCorrect="off"        // Don't autocorrect usernames
            spellCheck={false}       // No red squiggles on usernames
            aria-label="GitHub username"
            // aria-describedby links this input to the error message below,
            // so screen readers announce the error when the input is focused.
            aria-describedby={isError ? "search-error" : undefined}
            className="min-w-0 flex-1 bg-transparent px-3 py-4 font-mono text-sm
                       text-gray-900 placeholder:text-gray-400
                       focus:outline-none disabled:opacity-60"
          />

          {/* Submit button */}
          <button
            type="submit"
            disabled={isPending || !username.trim()}
            aria-label="Analyze GitHub profile"
            className="m-1.5 inline-flex shrink-0 items-center gap-2 rounded-lg
                       bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white
                       transition-colors
                       hover:bg-blue-700 active:bg-blue-800
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                       disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                {/* CSS-only spinner — no library needed.
                    border-t-white makes one "gap" in the ring that spins. */}
                <span
                  aria-hidden="true"
                  className="h-3.5 w-3.5 animate-spin rounded-full
                             border-2 border-white/30 border-t-white"
                />
                Analyzing…
              </>
            ) : (
              "Analyze →"
            )}
          </button>
        </div>

        {/* ── Inline error ───────────────────────────────────────────────────
            role="alert" causes screen readers to announce this immediately
            when it appears, without the user having to navigate to it.
            id="search-error" matches aria-describedby on the input above. */}
        {isError && (
          <p
            id="search-error"
            role="alert"
            className="mt-3 text-left text-sm text-red-500"
          >
            {error instanceof Error
              ? error.message
              : "Analysis failed. Check the username and try again."}
          </p>
        )}
      </form>

      {/* ── Example username pills ─────────────────────────────────────────────
          New visitors can click a real username to see the product in action.
          These are <button type="button"> — not submit buttons — so clicking
          them only fills the input, it doesn't submit the form. */}
      <p className="mt-3 text-xs text-gray-400">
        Try:{" "}
        {EXAMPLE_USERNAMES.map((name, index) => (
          <span key={name}>
            <button
              type="button"
              onClick={() => handleExampleClick(name)}
              className="text-gray-500 transition-colors
                         hover:text-blue-600 hover:underline"
            >
              {name}
            </button>
            {/* Separator dot between names, not after the last one */}
            {index < EXAMPLE_USERNAMES.length - 1 && (
              <span aria-hidden="true" className="mx-1 text-gray-300">·</span>
            )}
          </span>
        ))}
      </p>

    </div>
  )
}
