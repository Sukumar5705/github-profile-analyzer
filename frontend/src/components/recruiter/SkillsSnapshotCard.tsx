import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Skill } from "@/types/api"
import { Sparkles } from "lucide-react"

interface SkillsSnapshotCardProps {
  skills: Skill[]
}

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

  const other = top10.filter((s) => !used.has(s.skill))
  if (other.length > 0) {
    groups.push({ label: "Other", skills: other })
  }

  return groups
}

export function SkillsSnapshotCard({ skills }: SkillsSnapshotCardProps) {
  const groups = groupTopSkills(skills)

  return (
    <Card className="glass-card shadow-soft transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-[#8B5CF6] border border-purple-100">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Skills Snapshot</CardTitle>
            <p className="text-xs text-[#64748B]">
              Top 10 detected technical skills ranked by signal strength
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {groups.length === 0 ? (
          <p className="text-xs text-[#64748B]">No skills detected.</p>
        ) : (
          groups.map(({ label, skills: groupSkills }) => (
            <div key={label} className="space-y-1.5">
              <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                {label}
              </p>
              <div className="flex flex-wrap gap-2" role="list" aria-label={`${label} skills`}>
                {groupSkills.map(({ skill, confidence }) => (
                  <span
                    key={skill}
                    role="listitem"
                    title={`${Math.round(confidence * 100)}% confidence`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/80 bg-white/70 px-3 py-1 text-xs font-semibold text-[#141414] shadow-sm"
                  >
                    <span>{skill}</span>
                    <span className="text-[10px] font-bold text-[#036AFF] opacity-80">
                      {Math.round(confidence * 100)}%
                    </span>
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