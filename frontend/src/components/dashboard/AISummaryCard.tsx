import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface AISummaryCardProps {
  summary: string
  /** Shown while the AI summary is being generated */
  isLoading?: boolean
}

export function AISummaryCard({ summary, isLoading = false }: AISummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>AI Summary</CardTitle>
          <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            <SparkleIcon />
            AI Generated
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2 animate-pulse" aria-label="Loading AI summary">
            <div className="h-4 w-full rounded bg-secondary" />
            <div className="h-4 w-5/6 rounded bg-secondary" />
            <div className="h-4 w-4/5 rounded bg-secondary" />
          </div>
        ) : summary ? (
          <blockquote className="border-l-2 border-primary/30 pl-4">
            <p className="text-sm text-foreground leading-relaxed">{summary}</p>
          </blockquote>
        ) : (
          <p className="text-sm text-muted-foreground">
            AI summary not yet available. Run an analysis to generate insights.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function SparkleIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 fill-current"
      aria-hidden="true"
    >
      <path d="M8 1.5a.75.75 0 0 1 .712.513l1.04 3.098 3.098 1.04a.75.75 0 0 1 0 1.424l-3.098 1.04-1.04 3.098a.75.75 0 0 1-1.424 0l-1.04-3.098L2.95 8.625a.75.75 0 0 1 0-1.424l3.098-1.04 1.04-3.098A.75.75 0 0 1 8 1.5z" />
    </svg>
  )
}
