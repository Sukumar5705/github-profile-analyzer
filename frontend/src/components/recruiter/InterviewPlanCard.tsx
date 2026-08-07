import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { InterviewPlanItem, InterviewQuestion } from "@/types/api"

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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Interview Plan & Question Bank</CardTitle>
        <p className="text-sm text-muted-foreground">
          Curated evaluation guide tailored for hiring managers and technical interviewers
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Interview Focus & Risk Focus */}
        {(interviewFocus || riskAreas) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {interviewFocus && (
              <div className="rounded-lg border border-border bg-muted/40 p-3.5 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Primary Interview Focus
                </p>
                <p className="text-sm text-foreground leading-relaxed">{interviewFocus}</p>
              </div>
            )}

            {riskAreas && (
              <div className="rounded-lg border border-border bg-muted/40 p-3.5 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Risk Areas to Probe
                </p>
                <p className="text-sm text-foreground leading-relaxed">{riskAreas}</p>
              </div>
            )}
          </div>
        )}

        {/* Structured Interview Plan */}
        {hasPlan && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Recommended Interview Modules
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {interviewPlan.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border bg-muted/20 p-3.5 space-y-2"
                >
                  <p className="text-sm font-semibold text-foreground">{item.topic}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-medium text-foreground">Rationale: </span>
                    {item.reason}
                  </p>
                  {item.sampleQuestion && (
                    <div className="rounded-md border border-border bg-card p-2.5 text-xs text-foreground font-mono leading-relaxed">
                      <span className="font-semibold text-muted-foreground not-mono">Sample Question: </span>
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
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Technical Question Bank
            </h4>
            <div className="space-y-2.5">
              {interviewQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border bg-muted/20 p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{q.category}</span>
                    <span className="inline-flex items-center rounded-md bg-secondary border border-border px-2 py-0.5 text-xs font-medium text-foreground capitalize">
                      {q.difficulty}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{q.question}</p>
                  {q.rationale && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{q.rationale}</p>
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
