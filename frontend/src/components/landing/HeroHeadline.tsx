/**
 * HeroHeadline
 *
 * The single source of hero copy: one h1 (the only h1 on the page) and one
 * supporting paragraph. Rendered by HeroSection, left-aligned with the form.
 *
 * Copy is static on purpose; add props only when it needs to vary.
 */
export function HeroHeadline() {
  return (
    <div>
      <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
        Turn your GitHub into{" "}
        <span className="text-primary">developer intelligence</span>
      </h1>

      <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
        Get a career score, developer type, skill gaps, recruiter insights,
        resume evidence and a growth roadmap, generated from your public
        repositories.
      </p>
    </div>
  )
}
