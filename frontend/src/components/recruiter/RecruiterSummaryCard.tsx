import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Profile, DeveloperType } from "@/types/api"
import { FileText, Cpu, CheckCircle } from "lucide-react"

interface RecruiterSummaryCardProps {
  profile: Profile
  developerType: DeveloperType
  executiveSummary?: string
  technicalSummary?: string
  hiringRecommendation?: string
}

export function RecruiterSummaryCard({
  profile,
  developerType,
  executiveSummary,
  technicalSummary,
  hiringRecommendation
}: RecruiterSummaryCardProps) {
  const name = profile.name ?? `@${profile.username}`
  const effectiveExec = executiveSummary || `${name} is identified as a ${developerType.developerType} with strong technical depth across verified repositories.`

  return (
    <Card className="glass-card shadow-soft transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#036AFF] border border-blue-100">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Executive & Technical Summary</CardTitle>
            <p className="text-xs text-[#64748B]">
              Synthesized technical evaluation and hiring committee briefing
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Executive Summary */}
        <div className="rounded-xl border border-white/80 bg-white/50 p-4 space-y-1.5 shadow-sm">
          <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            Executive Brief
          </p>
          <p className="text-xs sm:text-sm font-medium text-[#141414] leading-relaxed">
            {effectiveExec}
          </p>
        </div>

        {/* Technical Summary */}
        {technicalSummary && (
          <div className="rounded-xl border border-white/80 bg-white/50 p-4 space-y-1.5 shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <Cpu className="h-3.5 w-3.5 text-[#8B5CF6]" />
              <span>Technical Architecture & Depth</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#141414] leading-relaxed">
              {technicalSummary}
            </p>
          </div>
        )}

        {/* Hiring Recommendation */}
        {hiringRecommendation && (
          <div className="rounded-xl border border-white/80 bg-white/50 p-4 space-y-1.5 shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span>Hiring Committee Recommendation</span>
            </div>
            <p className="text-xs sm:text-sm text-[#141414] leading-relaxed font-semibold">
              {hiringRecommendation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}