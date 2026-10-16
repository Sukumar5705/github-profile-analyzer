import { useState } from "react"
import { 
  Award, 
  GitFork, 
  Star, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Code2,
  Cpu
} from "lucide-react"

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
    ]
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
    ]
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
    ]
  }
}

export function HeroDashboardPreview() {
  const [selectedKey, setSelectedKey] = useState<string>("torvalds")
  const current = DEMO_PROFILES[selectedKey]

  return (
    <div className="relative w-full max-w-2xl mx-auto lg:max-w-none">
      {/* Decorative ambient background blur behind the floating card */}
      <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-blue-500/10 via-slate-200/50 to-indigo-500/10 blur-xl opacity-80" />

      {/* Main Glass/SaaS Frame */}
      <div className="relative rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-floating transition-all duration-300">
        
        {/* Top Control Bar: Tab selector simulating real profile switching */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Live Intelligence Engine
            </span>
          </div>

          {/* Interactive Profile Switcher Tabs */}
          <div className="flex items-center rounded-lg bg-slate-100 p-1">
            {Object.keys(DEMO_PROFILES).map((key) => {
              const profile = DEMO_PROFILES[key]
              const isActive = selectedKey === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedKey(key)}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-[#0F172A] shadow-sm font-semibold"
                      : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  <img
                    src={profile.avatar}
                    alt={profile.username}
                    className="h-3.5 w-3.5 rounded-full object-cover"
                  />
                  <span>@{profile.username}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Profile Header Row */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={current.avatar}
              alt={current.name}
              className="h-12 w-12 rounded-xl border border-[#E2E8F0] object-cover shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0F172A]">
                  {current.name}
                </h3>
                <span className="text-xs text-[#64748B] font-mono">
                  @{current.username}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                  <Cpu className="h-3 w-3" />
                  {current.developerType}
                </span>
                <span className="text-[11px] font-medium text-emerald-600">
                  {current.typeConfidence}% confidence
                </span>
              </div>
            </div>
          </div>

          {/* Recruiter Verdict Badge */}
          <div className="flex flex-col items-end">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              {current.recruiterVerdict.decision}
            </span>
            <span className="mt-1 text-[11px] text-[#64748B]">
              Signal: {current.recruiterVerdict.signal}
            </span>
          </div>
        </div>

        {/* Grid of Intelligence Widgets */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Card 1: Career Score */}
          <div className="rounded-xl border border-[#E2E8F0] bg-slate-50/70 p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#64748B]">Career Score</span>
              <Award className="h-4 w-4 text-blue-600" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
                {current.careerScore}
              </span>
              <span className="text-xs font-medium text-[#64748B]">/100</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-[#64748B]">
                <span>Percentile</span>
                <span className="font-semibold text-blue-600">{current.scoreRank}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${current.careerScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Skill Confidence Extract */}
          <div className="sm:col-span-2 rounded-xl border border-[#E2E8F0] bg-slate-50/70 p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#64748B]">Technical Skill Confidence</span>
              <Code2 className="h-4 w-4 text-slate-500" />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {current.topSkills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5 border border-slate-200/80 shadow-subtle"
                >
                  <span className="text-xs font-medium text-[#0F172A] truncate">
                    {skill.name}
                  </span>
                  <span className="text-[11px] font-semibold text-blue-600 font-mono">
                    {skill.confidence}%
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Card 3: Top Portfolio Project & Architecture Evidence */}
        <div className="mt-3 rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-bold text-[#0F172A]">
                Top Repository: {current.topProject.name}
              </span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-[#64748B]">
                {current.topProject.primaryLang}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#64748B]">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-500 fill-amber-400" />
                {current.topProject.stars}
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="h-3 w-3 text-slate-400" />
                {current.topProject.forks}
              </span>
            </div>
          </div>

          <p className="mt-1.5 text-xs text-[#64748B] line-clamp-2 leading-relaxed">
            {current.topProject.description}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-[#64748B]">
            <span className="font-semibold text-slate-700">Architecture:</span>
            <span className="rounded bg-blue-50 px-2 py-0.5 font-medium text-blue-700">
              {current.topProject.architecture}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="h-3 w-3" />
              Verified Public Code
            </span>
          </div>
        </div>

        {/* Bottom AI Executive Summary Strip */}
        <div className="mt-3 rounded-xl bg-slate-900 p-3.5 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Recruiter & Engineering Insight</span>
          </div>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
            "{current.recruiterVerdict.summary}"
          </p>
        </div>

      </div>
    </div>
  )
}
