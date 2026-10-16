/**
 * HeroHeadline
 *
 * Three-layer hierarchy:
 *   1. Eyebrow badge  — sets context immediately ("what is this")
 *   2. h1 headline    — the value promise ("what you get")
 *   3. Subheadline    — specific capabilities ("how it works")
 *
 * Uses h1 because this is the primary page heading — only one h1 per page.
 * The blue accent is on the most valuable phrase to anchor the eye.
 *
 * No props — this is static copy. If copy needs to be configurable
 * in the future, add a props interface at that point (YAGNI principle).
 */

export function HeroHeadline() {
  return (
    <div className="space-y-5">

      {/* ── Eyebrow badge ─────────────────────────────────────────
          Small pill label above the headline. Tells the user what
          category of tool this is before they read the big text.
          ring-1 ring-inset adds a subtle border inside the badge. */}
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1
                        text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-200">
          {/* Small dot — decorative signal indicator */}
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          GitHub → Career Intelligence
        </span>
      </div>

      {/* ── Main headline ─────────────────────────────────────────
          font-bold + tracking-tight is the standard "product headline"
          combination. Gets heavier at each breakpoint: 4xl → 5xl → 6xl.
          The <br> is hidden on mobile (everything fits on 2 lines already)
          and only appears on sm+ to control the line break on desktop. */}
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
        Your commits already{" "}
        {/* {" "} adds a space before the <br> so text flows correctly
            when the <br> is hidden on mobile */}
        <br className="hidden sm:block" />
        <span className="text-blue-600">wrote your resume</span>
      </h1>

      {/* ── Subheadline ───────────────────────────────────────────
          max-w-xl constrains this to ~512px even inside the wider hero
          container. Long subheadlines are hard to scan — keep them tight.
          text-lg with leading-relaxed (1.625 line height) is comfortable
          for 2–3 line descriptions. */}
      <p className="mx-auto max-w-xl text-lg leading-relaxed text-gray-500">
        Enter your GitHub username and get an instant intelligence report —
        career score, skill gaps, recruiter insights, and a personalized
        growth roadmap.
      </p>

    </div>
  )
}
