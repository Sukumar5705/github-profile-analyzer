import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface StrengthsCardProps {
  strengths: string[]
}

export function StrengthsCard({ strengths }: StrengthsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Strengths</CardTitle>
        <p className="text-sm text-muted-foreground">
          Positive signals for hiring
        </p>
      </CardHeader>
      <CardContent>
        {strengths.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No specific strengths identified.
          </p>
        ) : (
          <ul className="space-y-2.5" aria-label="Candidate strengths">
            {strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-success/10"
                  aria-hidden="true"
                >
                  <CheckIcon />
                </span>
                <span className="text-sm text-foreground leading-relaxed">
                  {strength}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="h-3 w-3 text-success fill-none stroke-current stroke-2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 6l3 3 5-5" />
    </svg>
  )
}