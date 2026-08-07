import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Skill } from "@/types/api"

interface SkillsSnapshotCardProps {
  skills: Skill[]
}

/** Maps category labels to matching skill-name substrings. */
const SKILL_CATEGORIES: Record<string, string[]> = {
  Backend: ["Node", "Express", "Nest", "Django", "FastAPI", "Flask", "Spring", "Rails", "Laravel", "Go", "Rust", "Elixir", "Java", "Python", "PHP", "C#", "GraphQL", "REST", "API"],
  Frontend: ["React", "Next", "Vue", "Angular", "Svelte", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind", "Vite", "Webpack"],
  Database: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Prisma", "Supabase", "Firebase", "DynamoDB", "Elasticsearch"],
  DevOps: ["Docker", "Kubernetes", "CI/CD", "GitHub Actions", "Terraform", "AWS", "GCP", "Azure", "Linux", "Nginx"],
  AI: ["Machine Learning", "TensorFlow", "PyTorch", "LangChain", "OpenAI", "Hugging Face", "NLP", "LLM", "AI", "ML"],
  Mobile: ["React Native", "Flutter", "Swift", "Kotlin", "iOS", "Android", "Expo"],
}

interface SkillGroup {
  label: string
  skills: Skill[]
}

function groupTopSkills(skills: Skill[]): SkillGroup[] {
  // Take top 10 by confidence
  const top10 = [...skills]
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 10)

  const used = new Set<string>()
  const groups: SkillGroup[] = []

  for (const [label, keywords] of Object.entries(SKILL_CATEGORIES)) {
    const matched = top10.filter(
      (s) =>
        !used.has(s.skill) &&
        keywords.some((kw) =>
          s.skill.toLowerCase().includes(kw.toLowerCase())
        )
    )
    if (matched.length > 0) {
      matched.forEach((s) => used.add(s.skill))
      groups.push({ label, skills: matched })
    }
  }

  // Anything uncategorised
  const other = top10.filter((s) => !used.has(s.skill))
  if (other.length > 0) {
    groups.push({ label: "Other", skills: other })
  }

  return groups
}

function confidenceBadgeClass(confidence: number): string {
  if (confidence >= 0.75) return "bg-primary/10 text-primary border-primary/20"
  if (confidence >= 0.45) return "bg-secondary text-foreground border-border"
  return "bg-secondary text-muted-foreground border-border"
}

export function SkillsSnapshotCard({ skills }: SkillsSnapshotCardProps) {
  const groups = groupTopSkills(skills)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills Snapshot</CardTitle>
        <p className="text-sm text-muted-foreground">
          Top 10 detected skills by confidence
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {groups.length === 0 ? (
          <p className="text-sm text-muted-foreground">No skills detected.</p>
        ) : (
          groups.map(({ label, skills: groupSkills }) => (
            <div key={label}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                {label}
              </p>
              <div className="flex flex-wrap gap-1.5" role="list" aria-label={`${label} skills`}>
                {groupSkills.map(({ skill, confidence }) => (
                  <span
                    key={skill}
                    role="listitem"
                    title={`${Math.round(confidence * 100)}% confidence`}
                    className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-sm font-medium transition-colors ${confidenceBadgeClass(confidence)}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}