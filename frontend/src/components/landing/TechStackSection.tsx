import {
  SiGithub,
  SiGooglegemini,
  SiNodedotjs,
  SiReact,
  SiTypescript,
  SiPostgresql,
  SiTailwindcss,
} from "react-icons/si"

const TECH_ITEMS = [
  { name: "GitHub API", category: "Data ingestion", icon: SiGithub },
  { name: "Gemini", category: "Multimodal AI", icon: SiGooglegemini },
  { name: "Node.js", category: "High-throughput runtime", icon: SiNodedotjs },
  { name: "React", category: "Declarative frontend", icon: SiReact },
  { name: "TypeScript", category: "Type-safe architecture", icon: SiTypescript },
  { name: "PostgreSQL", category: "Relational persistence", icon: SiPostgresql },
  { name: "Tailwind CSS", category: "Design system tokens", icon: SiTailwindcss },
]

export function TechStackSection() {
  return (
    <section
      id="tech-stack"
      aria-labelledby="tech-stack-heading"
      className="bg-slate-50 py-16 sm:py-20"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
        <div className="lg:col-span-4">
          <h2
            id="tech-stack-heading"
            className="text-2xl font-semibold tracking-tight text-slate-900"
          >
            Built with
          </h2>

          <p className="mt-3 max-w-sm text-base leading-relaxed text-slate-600">
            Public data from the GitHub API, evaluated with Gemini, stored in
            PostgreSQL and served through a Node.js and React stack.
          </p>
        </div>

        <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
          {TECH_ITEMS.map((item) => {
            const Icon = item.icon

            return (
              <li
                key={item.name}
                className="flex items-baseline justify-between gap-4 border-t border-slate-200 py-3.5"
              >
                <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-900">
                  <Icon
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-slate-500"
                  />
                  {item.name}
                </span>

                <span className="text-right text-sm text-slate-500">
                  {item.category}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}