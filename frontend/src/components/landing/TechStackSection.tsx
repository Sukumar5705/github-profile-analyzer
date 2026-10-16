import { 
  Sparkles, 
  Database, 
  Layers, 
  Boxes, 
  Cpu, 
  Code2, 
  Palette 
} from "lucide-react"

function GithubIcon({ className = "h-4.5 w-4.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

const TECH_ITEMS = [
  { name: "GitHub API", category: "Data Ingestion", icon: GithubIcon },
  { name: "OpenAI", category: "LLM Reasoning", icon: Sparkles },
  { name: "Gemini", category: "Multimodal AI", icon: Cpu },
  { name: "Node.js", category: "High-Throughput Runtime", icon: Boxes },
  { name: "React", category: "Declarative Frontend", icon: Layers },
  { name: "TypeScript", category: "Type-Safe Architecture", icon: Code2 },
  { name: "PostgreSQL", category: "Relational Persistence", icon: Database },
  { name: "Tailwind CSS", category: "Design System Tokens", icon: Palette },
]

export function TechStackSection() {
  return (
    <section 
      aria-label="Engineered with modern technologies" 
      className="py-16 bg-[#F8FAFC] border-b border-[#E2E8F0]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-8">
          Architected & Powered By Industry Standards
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {TECH_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.name}
                className="flex flex-col items-center justify-center rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-subtle hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-[#0F172A]">
                  <Icon className="h-4.5 w-4.5 text-slate-700" />
                </div>
                <span className="mt-2 text-xs font-bold text-[#0F172A]">
                  {item.name}
                </span>
                <span className="text-[10px] text-[#64748B] truncate max-w-full">
                  {item.category}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
