
import {
  GitBranch,
  BrainCircuit,
  Binary,
  FileText,
  Users,
} from "lucide-react"

const ANALYSIS_STAGES = [
  {
    number: "01",
    category: "SOURCE",
    title: "Public GitHub data",
    description:
      "Repositories, READMEs and programming languages via the GitHub API.",
    icon: GitBranch,
    emphasis: true,
  },
  {
    number: "02",
    category: "ANALYSIS",
    title: "AI portfolio analysis",
    description:
      "LLM-based evaluation of your selected projects and engineering practices.",
    icon: BrainCircuit,
    emphasis: true,
  },
  {
    number: "03",
    category: "INTELLIGENCE",
    title: "Developer intelligence",
    description:
      "Technology and skill signals grounded in repository evidence.",
    icon: Binary,
    emphasis: true,
  },
  {
    number: "04",
    category: "CAREER",
    title: "Resume evidence",
    description:
      "Resume-ready achievements based on what your repositories demonstrate.",
    icon: FileText,
    emphasis: true,
  },
  {
    number: "05",
    category: "RECRUITING",
    title: "Recruiter insights",
    description:
      "A concise technical summary and hiring recommendation.",
    icon: Users,
    emphasis: true,
  },
]

export function TrustBar() {
  return (
    <section
      aria-labelledby="analysis-pipeline-heading"
      className="border-y border-slate-200 bg-slate-50/70 py-14 sm:py-18 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Editorial section header */}
        <div className="mb-10 max-w-2xl sm:mb-12">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">
            How DevIntel works
          </p>

          <h2
            id="analysis-pipeline-heading"
            className="max-w-xl text-2xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-3xl lg:text-[34px] lg:leading-[1.2]"
          >
            From repositories to meaningful insights.
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Understand the signals behind your GitHub portfolio
            and how they translate into actionable career and hiring insights.
          </p>
        </div>

        {/* Five-stage analysis pipeline */}
        <ol className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-7">
          {ANALYSIS_STAGES.map((stage) => {
            const Icon = stage.icon

            return (
              <li
                key={stage.number}
                className={`min-w-0 border-t-2 pt-4 ${stage.emphasis
                  ? "border-blue-300"
                  : "border-slate-200"
                  }`}
              >
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${stage.emphasis
                      ? "bg-blue-50 text-blue-700"
                      : "bg-slate-100 text-slate-600"
                      }`}
                  >
                    <Icon
                      aria-hidden="true"
                      className="h-[18px] w-[18px]"
                      strokeWidth={1.8}
                    />
                  </span>

                  <span className="text-[10px] font-semibold tracking-[0.12em] text-slate-500">
                    {stage.category}
                  </span>

                  <span className="ml-auto font-mono text-[11px] text-slate-400">
                    {stage.number}
                  </span>
                </div>

                <h3 className="text-[15px] font-semibold leading-5 tracking-[-0.02em] text-slate-900">
                  {stage.title}
                </h3>

                <p className="mt-2 text-[13px] leading-[1.7] text-slate-600">
                  {stage.description}
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
