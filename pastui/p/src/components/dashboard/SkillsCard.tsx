import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Skill } from "@/types/api"

interface SkillsCardProps {
  skills: Skill[]
  /** Optional category grouping. Keys are labels, values are skill-name substrings. */
  categories?: Record<string, string[]>
}

const DEFAULT_CATEGORIES: Record<string, string[]> = {
  Languages: ["JavaScript", "TypeScript", "Python", "Go", "Rust", "Java", "C#", "C++", "C", "Ruby", "PHP", "Swift", "Kotlin", "Scala"],
  Frameworks: ["React", "Next.js", "Vue", "Angular", "Svelte", "Express", "Nest", "Django", "FastAPI", "Flask", "Spring", "Rails", "Laravel"],
  Databases: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Prisma", "Supabase", "Firebase", "Dynamo"],
  Tools: ["Docker", "Kubernetes", "Git", "GitHub", "CI/CD", "Terraform", "AWS", "GCP", "Azure", "Linux", "Webpack", "Vite"],
}

function groupSkills(
  skills: Skill[],
  categories: Record<string, string[]>
): { label: string; skills: Skill[] }[] {
  const used = new Set<string>()
  const groups: { label: string; skills: Skill[] }[] = []

  for (const [label, keywords] of Object.entries(categories)) {
    const matched = skills.filter((s) =>
      keywords.some((kw) => s.skill.toLowerCase().includes(kw.toLowerCase()))
    )
    if (matched.length > 0) {
      matched.forEach((s) => used.add(s.skill))
      groups.push({ label, skills: matched })
    }
  }

  const other = skills.filter((s) => !used.has(s.skill))
  if (other.length > 0) {
    groups.push({ label: "Other", skills: other })
  }

  return groups
}

function confidenceColor(confidence: number): string {
  if (confidence >= 0.75) return "bg-primary/10 text-primary border-primary/20"
  if (confidence >= 0.45) return "bg-secondary text-foreground border-border"
  return "bg-secondary text-muted-foreground border-border"
}

export function SkillsCard({ skills, categories = DEFAULT_CATEGORIES }: SkillsCardProps) {
  const groups = groupSkills(skills, categories)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {groups.length === 0 && (
          <p className="text-sm text-muted-foreground">No skills detected.</p>
        )}
        {groups.map(({ label, skills: groupSkills }) => (
          <div key={label}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              {label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {groupSkills.map(({ skill, confidence }) => (
                <span
                  key={skill}
                  title={`${Math.round(confidence * 100)}% confidence`}
                  className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-sm font-medium transition-colors ${confidenceColor(confidence)}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
