import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { InterviewPlanItem, InterviewQuestion } from "@/types/api"
import { HelpCircle, AlertTriangle, Target } from "lucide-react"

interface InterviewPlanCardProps {
  interviewPlan?: InterviewPlanItem[]
  interviewQuestions?: InterviewQuestion[]
  interviewFocus?: string
  riskAreas?: string
}

export function InterviewPlanCard({
  interviewPlan,
  interviewQuestions,
  interviewFocus,
  riskAreas
}: InterviewPlanCardProps) {
  const hasPlan = interviewPlan && interviewPlan.length > 0
  const hasQuestions = interviewQuestions && interviewQuestions.length > 0

  if (!hasPlan && !hasQuestions && !interviewFocus && !riskAreas) return null

  return (
    <Card className="glass-card shadow-soft transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-[#8B5CF6] border border-purple-100">
            <HelpCircle className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Interview Plan & Question Bank</CardTitle>
            <p className="text-xs text-[#64748B]">
              Curated evaluation guide tailored for hiring managers and technical interviewers
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Interview Focus & Risk Focus */}
        {(interviewFocus || riskAreas) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {interviewFocus && (
              <div className="rounded-xl border border-white/80 bg-white/50 p-3.5 space-y-1 shadow-sm">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  <Target className="h-3.5 w-3.5 text-[#036AFF]" />
                  <span>Primary Interview Focus</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-[#141414] leading-relaxed">{interviewFocus}</p>
              </div>
            )}

            {riskAreas && (
              <div className="rounded-xl border border-white/80 bg-white/50 p-3.5 space-y-1 shadow-sm">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  <span>Risk Areas to Probe</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-[#141414] leading-relaxed">{riskAreas}</p>
              </div>
            )}
          </div>
        )}

        {/* Structured Interview Plan */}
        {hasPlan && (
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              Recommended Interview Modules
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {interviewPlan.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/80 bg-white/50 p-3.5 space-y-2 shadow-sm"
                >
                  <p className="text-sm font-bold text-[#141414]">{item.topic}</p>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    <span className="font-semibold text-[#141414]">Rationale: </span>
                    {item.reason}
                  </p>
                  {item.sampleQuestion && (
                    <div className="rounded-xl border border-white/80 bg-white/70 p-2.5 text-xs text-[#141414] font-mono leading-relaxed">
                      <span className="font-bold text-[#036AFF] not-mono">Sample Question: </span>
                      "{item.sampleQuestion}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Question Bank */}
        {hasQuestions && (
          <div className="space-y-3 pt-1">
            <h4 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              Technical Question Bank
            </h4>
            <div className="space-y-2.5">
              {interviewQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/80 bg-white/50 p-3.5 space-y-1.5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#141414]">{q.category}</span>
                    <span className="inline-flex items-center rounded-lg bg-white/80 border border-white/80 px-2 py-0.5 text-[10px] font-bold text-[#64748B] capitalize">
                      {q.difficulty}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#141414] leading-relaxed">{q.question}</p>
                  {q.rationale && (
                    <p className="text-xs text-[#64748B] leading-relaxed">{q.rationale}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
