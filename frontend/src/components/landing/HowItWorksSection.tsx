import { GitBranch, BrainCircuit, LineChart } from "lucide-react"

const STEPS = [
  {
    step: "Step 01",
    title: "Connect GitHub",
    description: "Analyze any public GitHub profile instantly without auth or permissions.",
    icon: GitBranch,
    details: ["Public repos ingestion", "Zero credentials required", "Instant fetch"],
  },
  {
    step: "Step 02",
    title: "AI Understands Your Portfolio",
    description: "Evaluate repositories, technologies, documentation, project quality, architecture, deployment, and engineering patterns.",
    icon: BrainCircuit,
    details: ["AST & Language parsing", "Commit & PR pattern scoring", "Architectural depth check"],
  },
  {
    step: "Step 03",
    title: "Receive Developer Intelligence",
    description: "Generate recruiter insights, career score, portfolio analysis, resume evidence, and an AI-powered career roadmap.",
    icon: LineChart,
    details: ["Quantified Career Score", "Archetype & Skill extraction", "Personalized 3-month roadmap"],
  },
]

export function HowItWorksSection() {
  return (
    <section 
      id="how-it-works" 
      aria-label="How DevIntel Works" 
      className="py-20 sm:py-28 bg-[#F8FAFC] border-b border-[#E2E8F0]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20 mb-3">
            <span>Execution Pipeline</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl">
            How DevIntel Analyzes Your Code
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#64748B]">
            From raw commits to structured developer intelligence in three streamlined stages.
          </p>
        </div>

        {/* 3-Step Horizontal Timeline Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 relative">
          
          {STEPS.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.step}
                className="relative flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-7 shadow-card hover:shadow-card-hover transition-all duration-200"
              >
                {/* Step pill + Icon */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      {item.step}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                      <Icon className="h-5 w-5 text-blue-400" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#0F172A]">
                    {item.title}
                  </h3>
                  
                  <p className="mt-2.5 text-sm leading-relaxed text-[#64748B]">
                    {item.description}
                  </p>
                </div>

                {/* Micro tags */}
                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {item.details.map((detail) => (
                    <span
                      key={detail}
                      className="rounded bg-slate-50 border border-slate-200/60 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                    >
                      {detail}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}

        </div>

      </div>
    </section>
  )
}
