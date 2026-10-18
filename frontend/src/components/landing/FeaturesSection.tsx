
import { Briefcase, Code, Check } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface FeatureItem {
  name: string
  description: string
}

type Accent = "blue" | "indigo"

interface AudienceConfig {
  id: string
  label: string
  title: string
  description: string
  footer: string
  icon: LucideIcon
  accent: Accent
  features: FeatureItem[]
}

const DEVELOPER_FEATURES: FeatureItem[] = [
  {
    name: "Career Score",
    description:
      "Measure portfolio quality across documentation, diversity, deployment, activity, and open-source contribution.",
  },
  {
    name: "Developer Type",
    description:
      "Identify your engineering specialization using repository evidence.",
  },
  {
    name: "Skill Intelligence",
    description: "Extract technologies with AI confidence scores.",
  },
  {
    name: "Portfolio Gap Analysis",
    description:
      "Identify missing technologies and engineering practices.",
  },
  {
    name: "Resume Evidence",
    description:
      "Transform repositories into recruiter-ready resume achievements.",
  },
  {
    name: "AI Career Roadmap",
    description:
      "Receive a personalized learning roadmap based on your portfolio.",
  },
]

const RECRUITER_FEATURES: FeatureItem[] = [
  {
    name: "Hiring Summary",
    description: "Quick technical overview of every candidate.",
  },
  {
    name: "Top Portfolio Projects",
    description:
      "Automatically identify the strongest repositories.",
  },
  {
    name: "Verified Technical Skills",
    description:
      "Evidence-backed skills extracted from repositories.",
  },
  {
    name: "Engineering Strengths",
    description:
      "Architecture, documentation, deployment, and engineering quality.",
  },
  {
    name: "Portfolio Concerns",
    description:
      "Technical weaknesses and missing engineering practices.",
  },
  {
    name: "Shareable Candidate Report",
    description: "Generate standardized candidate reports.",
  },
]

const AUDIENCES: AudienceConfig[] = [
  {
    id: "for-developers",
    label: "Developer view",
    title: "Build a stronger portfolio",
    description:
      "Discover how your GitHub portfolio reflects your engineering skills, project quality, and career readiness.",
    footer: "Included in free public analysis",
    icon: Code,
    accent: "blue",
    features: DEVELOPER_FEATURES,
  },
  {
    id: "for-recruiters",
    label: "Recruiter view",
    title: "Evaluate with confidence",
    description:
      "Review technical candidates through structured insights grounded in their public repositories.",
    footer: "Standardized technical verification",
    icon: Briefcase,
    accent: "indigo",
    features: RECRUITER_FEATURES,
  },
]

const ACCENT_STYLES: Record<
  Accent,
  { border: string; icon: string; label: string; check: string }
> = {
  blue: {
    border: "border-t-blue-500",
    icon: "bg-blue-50 text-blue-700",
    label: "text-blue-700",
    check: "text-blue-600",
  },
  indigo: {
    border: "border-t-indigo-500",
    icon: "bg-indigo-50 text-indigo-700",
    label: "text-indigo-700",
    check: "text-indigo-600",
  },
}

function AudienceCard({
  audience,
}: {
  audience: AudienceConfig
}) {
  const Icon = audience.icon
  const accent = ACCENT_STYLES[audience.accent]

  return (
    <article
      id={audience.id}
      className={`flex h-full flex-col rounded-2xl border border-t-[3px] border-slate-200 ${accent.border} bg-white p-5 shadow-sm shadow-slate-900/[0.02] transition-shadow duration-200 hover:shadow-md hover:shadow-slate-900/[0.04] sm:p-7 lg:p-8`}
    >
      {/* Audience identity */}
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent.icon}`}
        >
          <Icon
            aria-hidden="true"
            className="h-5 w-5"
            strokeWidth={1.8}
          />
        </span>

        <span
          className={`text-xs font-semibold uppercase tracking-[0.12em] ${accent.label}`}
        >
          {audience.label}
        </span>
      </div>

      {/* Card introduction */}
      <div className="mt-5">
        <h3 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          {audience.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-[15px]">
          {audience.description}
        </p>
      </div>

      {/* Feature list */}
      <dl className="mt-6 border-y border-slate-200">
        {audience.features.map((item, index) => (
          <div
            key={item.name}
            className={`grid gap-1.5 py-3.5 sm:grid-cols-[minmax(8.5rem,0.85fr)_minmax(0,1.15fr)] sm:gap-4 ${index !== 0 ? "border-t border-slate-100" : ""
              }`}
          >
            <dt className="text-sm font-semibold leading-5 text-slate-900">
              {item.name}
            </dt>

            <dd className="text-sm leading-[1.65] text-slate-600">
              {item.description}
            </dd>
          </div>
        ))}
      </dl>

      {/* Supporting detail */}
      <div className="mt-auto flex items-center gap-2 pt-5 text-xs font-medium text-slate-500">
        <Check
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 ${accent.check}`}
        />
        <span>{audience.footer}</span>
      </div>
    </article>
  )
}

export function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="scroll-mt-20 border-b border-slate-200 bg-slate-50/70 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            One platform, two perspectives
          </p>

          <h2
            id="features-heading"
            className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl lg:leading-tight"
          >
            Everything you need to understand a developer
          </h2>

          <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
            One GitHub profile, two perspectives: what developers can
            improve and what recruiters need to decide.
          </p>
        </div>

        {/* Equal visual weight for both audiences */}
        <div className="mt-10 grid items-stretch gap-5 lg:mt-12 lg:grid-cols-2 lg:gap-6">
          {AUDIENCES.map((audience) => (
            <AudienceCard
              key={audience.id}
              audience={audience}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
