import { HeroHeadline } from "./HeroHeadline"
import { UsernameSearchForm } from "./UsernameSearchForm"
import { HeroDashboardPreview } from "./HeroDashboardPreview"

export function HeroSection() {
  return (
    <section
      aria-label="GitHub portfolio intelligence"
      className="border-b border-slate-200 bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left: value proposition → action */}
          <div className="lg:col-span-6">
            <HeroHeadline />

            <div className="mt-8 max-w-xl">
              <UsernameSearchForm />
            </div>

            <p className="mt-6 text-sm text-slate-500">
              Uses public repositories only. No sign-in required.
            </p>
          </div>

          {/* Right: what the result looks like */}
          <div className="min-w-0 lg:col-span-6">
            <HeroDashboardPreview />
          </div>
        </div>
      </div>
    </section>
  )
}
