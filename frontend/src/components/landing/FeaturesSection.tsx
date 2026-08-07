import { 
  Code, 
  Briefcase, 
  CheckCircle2, 
  Award, 
  Cpu, 
  Sparkles, 
  AlertTriangle, 
  FileCheck, 
  Compass,
  Zap,
  FolderGit2,
  ShieldCheck
} from "lucide-react"

interface FeatureItem {
  name: string
  description: string
  icon: typeof Award
}

const DEVELOPER_FEATURES: FeatureItem[] = [
  {
    name: "Career Score",
    description: "Measure portfolio quality across documentation, diversity, deployment, activity, and open-source contribution.",
    icon: Award,
  },
  {
    name: "Developer Type",
    description: "Identify your engineering specialization using repository evidence.",
    icon: Cpu,
  },
  {
    name: "Skill Intelligence",
    description: "Extract technologies with AI confidence scores.",
    icon: Sparkles,
  },
  {
    name: "Portfolio Gap Analysis",
    description: "Identify missing technologies and engineering practices.",
    icon: AlertTriangle,
  },
  {
    name: "Resume Evidence",
    description: "Transform repositories into recruiter-ready resume achievements.",
    icon: FileCheck,
  },
  {
    name: "AI Career Roadmap",
    description: "Receive a personalized learning roadmap based on your portfolio.",
    icon: Compass,
  },
]

const RECRUITER_FEATURES: FeatureItem[] = [
  {
    name: "Hiring Summary",
    description: "Quick technical overview of every candidate.",
    icon: Zap,
  },
  {
    name: "Top Portfolio Projects",
    description: "Automatically identify the strongest repositories.",
    icon: FolderGit2,
  },
  {
    name: "Verified Technical Skills",
    description: "Evidence-backed skills extracted from repositories.",
    icon: ShieldCheck,
  },
  {
    name: "Engineering Strengths",
    description: "Architecture, documentation, deployment, and engineering quality.",
    icon: CheckCircle2,
  },
  {
    name: "Portfolio Concerns",
    description: "Technical weaknesses and missing engineering practices.",
    icon: AlertTriangle,
  },
  {
    name: "Shareable Candidate Report",
    description: "Generate standardized candidate reports.",
    icon: FileCheck,
  },
]

export function FeaturesSection() {
  return (
    <section 
      id="features" 
      aria-label="DevIntel Platform Features" 
      className="py-20 sm:py-28 bg-white border-b border-[#E2E8F0]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20 mb-3">
            <span>Dual-Audience Intelligence</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl">
            Everything You Need to Understand a Developer
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#64748B]">
            One GitHub profile. Multiple AI-powered perspectives for developers and recruiters.
          </p>
        </div>

        {/* Two-Column Audience Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          
          {/* Card 1: For Developers */}
          <div 
            id="for-developers" 
            className="scroll-mt-24 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-8 shadow-card flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-6 mb-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/70 px-3 py-1 text-xs font-semibold text-blue-800">
                    <Code className="h-3.5 w-3.5" />
                    For Developers
                  </span>
                  <h3 className="mt-3 text-2xl font-bold text-[#0F172A]">
                    Understand Your Technical Identity
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                    Discover how your GitHub portfolio reflects your engineering skills, project quality, and career readiness.
                  </p>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-4">
                {DEVELOPER_FEATURES.map((item) => {
                  const Icon = item.icon
                  return (
                    <div 
                      key={item.name}
                      className="flex items-start gap-3.5 p-3 rounded-xl bg-white border border-[#E2E8F0]/70 shadow-subtle"
                    >
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0F172A]">
                          {item.name}
                        </h4>
                        <p className="mt-0.5 text-xs leading-relaxed text-[#64748B]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E2E8F0] text-xs text-[#64748B] flex items-center justify-between">
              <span>Included in Free Public Analysis</span>
              <span className="font-semibold text-blue-600">Explore Developer View →</span>
            </div>
          </div>

          {/* Card 2: For Recruiters */}
          <div 
            id="for-recruiters" 
            className="scroll-mt-24 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-8 shadow-card flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-6 mb-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200/80 px-3 py-1 text-xs font-semibold text-slate-800">
                    <Briefcase className="h-3.5 w-3.5" />
                    For Recruiters
                  </span>
                  <h3 className="mt-3 text-2xl font-bold text-[#0F172A]">
                    Make Better Hiring Decisions Faster
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                    Evaluate engineering candidates using structured AI-powered insights instead of manually reviewing repositories.
                  </p>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-4">
                {RECRUITER_FEATURES.map((item) => {
                  const Icon = item.icon
                  return (
                    <div 
                      key={item.name}
                      className="flex items-start gap-3.5 p-3 rounded-xl bg-white border border-[#E2E8F0]/70 shadow-subtle"
                    >
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0F172A]">
                          {item.name}
                        </h4>
                        <p className="mt-0.5 text-xs leading-relaxed text-[#64748B]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E2E8F0] text-xs text-[#64748B] flex items-center justify-between">
              <span>Standardized Technical Verification</span>
              <span className="font-semibold text-slate-800">Explore Recruiter View →</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

