import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Skill } from "@/types/api"
import { Sparkles } from "lucide-react"

interface SkillsCardProps {
  skills: Skill[]
  categories?: Record<string, string[]>
}

const DEFAULT_CATEGORIES: Record<string, string[]> = {
  "Languages": ["JavaScript", "TypeScript", "Python", "Go", "Rust", "Java", "C#", "C++", "C", "Ruby", "PHP", "Swift", "Kotlin", "Scala", "HTML", "CSS"],
  "Frameworks & Web": ["React", "Next.js", "Vue", "Angular", "Svelte", "Express", "Nest", "Django", "FastAPI", "Flask", "Spring", "Rails", "Tailwind"],
  "Databases & Storage": ["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Prisma", "Supabase", "Firebase", "DynamoDB"],
  "DevOps & Infrastructure": ["Docker", "Kubernetes", "Git", "GitHub", "CI/CD", "Terraform", "AWS", "GCP", "Azure", "Linux", "Vercel"],
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
    groups.push({ label: "Tools & Ecosystem", skills: other })
  }

  return groups
}

export function SkillsCard({ skills, categories = DEFAULT_CATEGORIES }: SkillsCardProps) {
  const groups = groupSkills(skills, categories)

  return (
    <Card id="skills" className="glass-card shadow-soft transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-[#8B5CF6] border border-purple-100">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Technical Skills & Capabilities</CardTitle>
            <p className="text-xs text-[#64748B]">
              Extracted languages, frameworks, databases, and DevOps competencies
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#64748B] bg-white/70 px-2.5 py-1 rounded-xl border border-white/80">
          {skills.length} Detected
        </span>
      </CardHeader>

      <CardContent className="space-y-4">
        {groups.length === 0 && (
          <p className="text-xs text-[#64748B] py-2">No technical skills detected in the public repositories.</p>
        )}
        {groups.map(({ label, skills: groupSkills }) => (
          <div key={label} className="space-y-1.5">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              {label}
            </p>
            <div className="flex flex-wrap gap-2">
              {groupSkills.map(({ skill, confidence }) => {
                const pct = Math.round(confidence * 100)
                return (
                  <span
                    key={skill}
                    title={`${pct}% confidence`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/80 bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#141414] shadow-sm hover:bg-white transition-colors"
                  >
                    <span>{skill}</span>
                    <span className="text-[10px] font-bold text-[#036AFF] opacity-80">
                      {pct}%
                    </span>
                  </span>
                )
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
