import { 
  Sparkles, 
  Binary, 
  FileText, 
  UserCheck 
} from "lucide-react"

function GithubIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

const TRUST_PILLARS = [
  {
    name: "GitHub API",
    subtitle: "REST & GraphQL Ingestion",
    icon: GithubIcon,
  },
  {
    name: "AI Portfolio Analysis",
    subtitle: "Gemini & LLM Reasoning",
    icon: Sparkles,
  },
  {
    name: "Developer Intelligence",
    subtitle: "AST & Signal Extraction",
    icon: Binary,
  },
  {
    name: "Resume Evidence",
    subtitle: "Quantified Accomplishments",
    icon: FileText,
  },
  {
    name: "Recruiter Insights",
    subtitle: "30-Second Technical Verdict",
    icon: UserCheck,
  },
]

export function TrustBar() {
  return (
    <section 
      aria-label="Intelligence engine capabilities" 
      className="border-y border-[#E2E8F0] bg-white py-8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-6">
          Powered by Public Repository Analysis & Multimodal Intelligence
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 items-center justify-center">
          {TRUST_PILLARS.map((pillar) => {
            const Icon = pillar.icon
            return (
              <div
                key={pillar.name}
                className="group flex flex-col items-center justify-center p-3 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50/80 transition-all duration-200"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-[#0F172A] group-hover:bg-[#0F172A] group-hover:text-white transition-colors duration-200">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="mt-2.5 text-xs font-semibold text-[#0F172A]">
                  {pillar.name}
                </span>
                <span className="text-[11px] text-[#64748B] text-center">
                  {pillar.subtitle}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
