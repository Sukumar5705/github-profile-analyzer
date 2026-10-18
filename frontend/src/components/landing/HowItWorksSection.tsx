/**
 * HowItWorksSection — the one place the workflow is explained.
 *
 * HowItWorksStrip reuses HOW_IT_WORKS_STEPS so the two can never drift apart.
 * Detail lines describe what the pipeline actually does (repository metadata,
 * READMEs, language/topic signals, LLM evaluation).
 */
export const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Enter a GitHub username",
    shortLabel: "Paste your GitHub username",
    description:
      "Analyze any public GitHub profile without signing in or granting permissions.",
    details: ["Public repositories only", "No credentials required"],
  },
  {
    number: "02",
    title: "AI reviews your portfolio",
    shortLabel: "We analyze your public repos",
    description:
      "Repositories, technologies, documentation and project quality are scored, and the strongest projects are evaluated in depth.",
    details: [
      "Language and topic signals",
      "README and documentation review",
      "Project selection and scoring",
    ],
  },
  {
    number: "03",
    title: "Receive your report",
    shortLabel: "Get your full intelligence report",
    description:
      "Get recruiter insights, a career score, portfolio analysis, resume evidence and an AI-generated career roadmap.",
    details: ["Career score", "Developer type and skills", "Roadmap and recommendations"],
  },
] as const

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="scroll-mt-20 bg-slate-50 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2
            id="how-it-works-heading"
            className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
          >
            How DevIntel analyzes your code
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            From public repositories to a structured report in three steps.
          </p>
        </div>

        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <li key={step.number} className="border-t-2 border-slate-900 pt-5">
              <span className="font-mono text-sm font-semibold text-primary">
                {step.number}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-slate-600">
                {step.description}
              </p>
              <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
                {step.details.map((detail) => (
                  <li key={detail} className="flex gap-2">
                    <span aria-hidden="true" className="select-none text-slate-400">
                      –
                    </span>
                    {detail}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
