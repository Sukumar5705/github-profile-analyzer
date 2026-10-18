import { useState } from "react"
import { GitFork, Star } from "lucide-react"

/**
 * Static, illustrative sample of the report. The figures below are demo data
 * for layout purposes — they are not live or verified results, and the UI
 * says so.
 */

interface DemoProfile {
  username: string
  name: string
  avatar: string
  developerType: string
  typeConfidence: number
  careerScore: number
  scoreRank: string
  scoreBreakdown: {
    label: string
    value: number
  }[]
  topSkills: {
    name: string
    confidence: number
    level: string
  }[]
  topProject: {
    name: string
    description: string
    stars: string
    forks: string
    primaryLang: string
    architecture: string
  }
  recruiterVerdict: {
    decision: string
    summary: string
    signal: string
  }
  portfolioHealth: {
    metric: string
    score: number
  }[]
}

const DEMO_PROFILES: Record<string, DemoProfile> = {
  torvalds: {
    username: "torvalds",
    name: "Linus Torvalds",
    avatar: "https://avatars.githubusercontent.com/u/1024025?v=4",
    developerType: "Systems & Kernel Architect",
    typeConfidence: 99,
    careerScore: 98,
    scoreRank: "Top 0.1% Globally",
    scoreBreakdown: [
      { label: "Arch & Code", value: 99 },
      { label: "Deployment", value: 96 },
      { label: "Open Source", value: 100 },
      { label: "Tech Breadth", value: 95 },
    ],
    topSkills: [
      { name: "C / C++", confidence: 99, level: "Expert" },
      { name: "Kernel Architecture", confidence: 98, level: "Expert" },
      { name: "Git Internals", confidence: 99, level: "Expert" },
      { name: "Systems Design", confidence: 97, level: "Expert" },
    ],
    topProject: {
      name: "linux",
      description: "Linux kernel source tree with production-grade modular monolithic architecture.",
      stars: "185k",
      forks: "54k",
      primaryLang: "C",
      architecture: "Kernel Subsystem",
    },
    recruiterVerdict: {
      decision: "Strong Hire · Fellow / VP Eng",
      summary: "Foundational software pioneer with unmatched systems-level engineering rigor and multi-decade open-source leadership.",
      signal: "High Technical Depth",
    },
    portfolioHealth: [
      { metric: "Code Architecture", score: 99 },
      { metric: "Engineering Consistency", score: 98 },
      { metric: "Documentation", score: 92 },
    ],
  },
  gaearon: {
    username: "gaearon",
    name: "Dan Abramov",
    avatar: "https://avatars.githubusercontent.com/u/810438?v=4",
    developerType: "Principal Frontend Architect",
    typeConfidence: 98,
    careerScore: 96,
    scoreRank: "Top 0.5% Globally",
    scoreBreakdown: [
      { label: "Arch & Code", value: 98 },
      { label: "Deployment", value: 94 },
      { label: "Open Source", value: 99 },
      { label: "Tech Breadth", value: 93 },
    ],
    topSkills: [
      { name: "React / RSC", confidence: 99, level: "Expert" },
      { name: "State Architecture", confidence: 98, level: "Expert" },
      { name: "JavaScript / TS", confidence: 97, level: "Expert" },
      { name: "Compiler Tooling", confidence: 92, level: "Advanced" },
    ],
    topProject: {
      name: "redux",
      description: "Predictable state container for JavaScript apps with functional pure reducers.",
      stars: "60.4k",
      forks: "15.3k",
      primaryLang: "TypeScript",
      architecture: "Immutable State",
    },
    recruiterVerdict: {
      decision: "Strong Hire · Principal Frontend",
      summary: "Exceptional frontend systems design, declarative UI state management, and clear technical communication.",
      signal: "Elite Architecture",
    },
    portfolioHealth: [
      { metric: "Documentation Clarity", score: 99 },
      { metric: "Test Suite Health", score: 97 },
      { metric: "Design Simplicity", score: 96 },
    ],
  },
  sindresorhus: {
    username: "sindresorhus",
    name: "Sindre Sorhus",
    avatar: "https://avatars.githubusercontent.com/u/170270?v=4",
    developerType: "Staff Full-Stack & Tooling Engineer",
    typeConfidence: 97,
    careerScore: 95,
    scoreRank: "Top 0.8% Globally",
    scoreBreakdown: [
      { label: "Arch & Code", value: 95 },
      { label: "Deployment", value: 96 },
      { label: "Open Source", value: 100 },
      { label: "Tech Breadth", value: 96 },
    ],
    topSkills: [
      { name: "TypeScript / Node", confidence: 98, level: "Expert" },
      { name: "CLI Automation", confidence: 97, level: "Expert" },
      { name: "Swift / macOS", confidence: 92, level: "Advanced" },
      { name: "API Engineering", confidence: 94, level: "Expert" },
    ],
    topProject: {
      name: "awesome",
      description: "Curated list of delightful topics, software, frameworks, and developer toolkits.",
      stars: "340k",
      forks: "27.8k",
      primaryLang: "Markdown & TS",
      architecture: "Modular Ecosystem",
    },
    recruiterVerdict: {
      decision: "Strong Hire · Staff Tooling Engineer",
      summary: "Massive open-source footprint with hyper-focused micro-package architecture and rock-solid maintenance discipline.",
      signal: "High Velocity",
    },
    portfolioHealth: [
      { metric: "Packaging & CI/CD", score: 99 },
      { metric: "Ecosystem Impact", score: 100 },
      { metric: "API Usability", score: 95 },
    ],
  },
}

const PROFILE_KEYS = Object.keys(DEMO_PROFILES)

function SectionLabel({ children }: { children: string }) {
  return (
    <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </h4>
  )
}

export function HeroDashboardPreview() {
  const [selectedKey, setSelectedKey] = useState<string>("torvalds")
  const current = DEMO_PROFILES[selectedKey]

  return (
    <figure className="w-full" aria-label="Sample report preview">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
        {/* Header: what this is + profile switcher */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-slate-200 bg-slate-50 px-5 py-3">
          <p className="text-xs font-medium text-slate-600">
            Sample report <span className="text-slate-400">·</span>{" "}
            <span className="text-slate-500">illustrative data</span>
          </p>

          <div role="tablist" aria-label="Sample profiles" className="flex gap-1">
            {PROFILE_KEYS.map((key) => {
              const isActive = selectedKey === key
              return (
                <button
                  key={key}
                  id={`sample-tab-${key}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="sample-report-panel"
                  onClick={() => setSelectedKey(key)}
                  className={`cursor-pointer rounded-md px-2.5 py-1.5 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isActive
                      ? "bg-white font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  @{key}
                </button>
              )
            })}
          </div>
        </div>

        <div
          id="sample-report-panel"
          role="tabpanel"
          aria-labelledby={`sample-tab-${selectedKey}`}
        >
          {/* Identity + verdict */}
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-5">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={current.avatar}
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 shrink-0 rounded-full bg-slate-100 object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-slate-900">
                  {current.name}
                </p>
                <p className="truncate text-sm text-slate-600">
                  {current.developerType}
                  <span className="text-slate-400"> · </span>
                  <span className="font-mono text-xs text-slate-500">
                    {current.typeConfidence}% match
                  </span>
                </p>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-xs text-slate-500">Recruiter verdict</p>
              <p className="text-sm font-semibold text-slate-900">
                {current.recruiterVerdict.decision}
              </p>
            </div>
          </div>

          {/* Score + breakdown */}
          <div className="grid gap-6 border-t border-slate-200 px-5 py-5 sm:grid-cols-[9rem_1fr] sm:gap-8">
            <div>
              <SectionLabel>Career score</SectionLabel>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-5xl font-bold tabular-nums tracking-tight text-slate-900">
                  {current.careerScore}
                </span>
                <span className="text-sm text-slate-500">/ 100</span>
              </p>
            </div>

            <dl className="space-y-2.5 self-center">
              {current.scoreBreakdown.map((item) => (
                <div key={item.label} className="grid grid-cols-[6.5rem_1fr_2rem] items-center gap-3">
                  <dt className="text-sm text-slate-600">{item.label}</dt>
                  <dd className="contents">
                    <span className="h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                      <span
                        className="block h-full rounded-full bg-primary transition-[width] duration-500 motion-reduce:transition-none"
                        style={{ width: `${item.value}%` }}
                      />
                    </span>
                    <span className="text-right font-mono text-sm tabular-nums text-slate-900">
                      {item.value}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Skills */}
          <div className="border-t border-slate-200 px-5 py-5">
            <SectionLabel>Skills · confidence</SectionLabel>
            <ul className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {current.topSkills.map((skill) => (
                <li key={skill.name} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate text-slate-900">{skill.name}</span>
                  <span className="shrink-0 font-mono text-sm tabular-nums text-slate-600">
                    {skill.confidence}%
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Repository evidence */}
          <div className="border-t border-slate-200 px-5 py-5">
            <SectionLabel>Top repository</SectionLabel>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-sm text-slate-900">
                <span className="font-mono font-semibold">{current.topProject.name}</span>
                <span className="text-slate-400"> · </span>
                <span className="text-slate-600">{current.topProject.primaryLang}</span>
              </p>
              <p className="flex items-center gap-4 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only">Stars:</span>
                  {current.topProject.stars}
                </span>
                <span className="inline-flex items-center gap-1">
                  <GitFork className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only">Forks:</span>
                  {current.topProject.forks}
                </span>
              </p>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              {current.topProject.description}
            </p>
            <p className="mt-1.5 text-xs text-slate-500">
              Architecture: {current.topProject.architecture}
            </p>
          </div>

          {/* Summary */}
          <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
            <p className="text-sm leading-relaxed text-slate-700">
              {current.recruiterVerdict.summary}
            </p>
            <p className="mt-1.5 text-xs text-slate-500">
              Signal: {current.recruiterVerdict.signal}
            </p>
          </div>
        </div>
      </div>

      <figcaption className="mt-3 text-xs text-slate-500">
        Example output for well-known public profiles. Your report is generated
        from your own repositories.
      </figcaption>
    </figure>
  )
}
