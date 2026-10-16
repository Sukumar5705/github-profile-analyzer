import { CheckCircle } from "lucide-react"
import { UsernameSearchForm } from "./UsernameSearchForm"
import { HeroDashboardPreview } from "./HeroDashboardPreview"

export function HeroSection() {
  return (
    <section
      aria-label="GitHub Portfolio Intelligence Hero"
      className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32 bg-subtle-grid"
    >
      {/* Soft ambient lighting highlights */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-100/60 via-blue-50/20 to-transparent blur-3xl opacity-70" 
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Value Proposition & Interactive Search (Span 7) */}
          <div className="flex flex-col items-start text-left lg:col-span-7">
            
            {/* Hero Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-subtle backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span>GitHub Portfolio Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl lg:leading-[1.12]">
              Turn Your GitHub Into{" "}
              <span className="text-[#2563EB]">
                Professional Developer Intelligence
              </span>
            </h1>

            {/* Supporting Subtext */}
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#64748B] max-w-2xl">
              Analyze your GitHub profile to discover your career score, developer specialization, technical strengths, portfolio gaps, recruiter insights, resume evidence, and a personalized AI growth roadmap—all from your public repositories.
            </p>

            {/* Primary GitHub Search Form */}
            <div className="mt-8 w-full max-w-xl">
              <UsernameSearchForm />
            </div>

            {/* Quick Proof Signals */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-200/80 pt-6 text-xs text-[#64748B] w-full max-w-xl">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>100% Public Data</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Zero Login Required</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Instant AI Analysis</span>
              </div>
            </div>

          </div>

          {/* Right Column: Floating Realistic Dashboard Preview (Span 5) */}
          <div className="w-full lg:col-span-5">
            <HeroDashboardPreview />
          </div>

        </div>
      </div>
    </section>
  )
}
