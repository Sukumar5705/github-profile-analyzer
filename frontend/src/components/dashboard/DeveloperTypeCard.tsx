import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { DeveloperType, Seniority } from "@/types/api"
import { Cpu, Target, Users } from "lucide-react"

interface DeveloperTypeCardProps {
  developerType: DeveloperType
  seniority?: Seniority
  recommendedRole?: string
  recommendedTeam?: string
  teamFit?: string[]
}

export function DeveloperTypeCard({
  developerType,
  seniority,
  recommendedRole,
  recommendedTeam,
  teamFit
}: DeveloperTypeCardProps) {
  const { developerType: type, confidence, reasons } = developerType
  const pct = Math.round((confidence ?? 0.85) * 100)
  const effectiveSeniority = seniority || "Senior Engineer"
  const effectiveRole = recommendedRole || `${effectiveSeniority} - ${type}`
  const effectiveTeam = recommendedTeam || "Platform & Infrastructure"
  const effectiveSignals = teamFit && teamFit.length ? teamFit : reasons

  return (
    <Card id="developer-type" className="glass-card shadow-soft transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-[#8B5CF6] border border-purple-100">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Developer Archetype</CardTitle>
            <p className="text-xs text-[#64748B]">
              Domain specialization and engineering role fit
            </p>
          </div>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold bg-white/80 text-[#141414] border border-white/80 shadow-sm">
          {effectiveSeniority}
        </span>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Type + Confidence */}
        <div>
          <p className="text-2xl font-extrabold tracking-tight text-[#141414]">{type}</p>
          <div className="flex items-center gap-3 mt-2.5">
            <div
              className="h-2 flex-1 rounded-full bg-slate-200/60 overflow-hidden"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Confidence: ${pct}%`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#036AFF] to-[#8B5CF6] transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-extrabold tabular-nums text-[#141414]">
              {pct}%
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1 font-medium">Classification Confidence</p>
        </div>

        {/* Recommended Role & Target Team */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/80 bg-white/50 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-bold uppercase tracking-wider">
              <Target className="h-3.5 w-3.5 text-[#036AFF]" />
              <span>Recommended Role</span>
            </div>
            <p className="text-sm font-bold text-[#141414] leading-snug">
              {effectiveRole}
            </p>
          </div>

          <div className="rounded-xl border border-white/80 bg-white/50 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-bold uppercase tracking-wider">
              <Users className="h-3.5 w-3.5 text-[#8B5CF6]" />
              <span>Target Team</span>
            </div>
            <p className="text-sm font-bold text-[#141414] leading-snug">
              {effectiveTeam}
            </p>
          </div>
        </div>

        {/* Supporting Signals & Team Fit */}
        {effectiveSignals && effectiveSignals.length > 0 && (
          <div>
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2.5">
              Supporting Signals & Team Fit
            </p>
            <div className="flex flex-wrap gap-2">
              {effectiveSignals.map((signal) => (
                <span
                  key={signal}
                  className="inline-flex items-center rounded-xl bg-white/70 border border-white/80 px-2.5 py-1 text-xs font-semibold text-[#141414] shadow-sm"
                >
                  {signal}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
