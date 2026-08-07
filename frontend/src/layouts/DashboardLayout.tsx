import { NavLink, Outlet, useParams } from "react-router-dom"
import { cn } from "../lib/utils"
import { ROUTES } from "../routes/paths"

/**
 * Once a profile is analyzed, the person moves between four views of the
 * same data (Dashboard / Recruiter / Resume / Roadmap) without re-entering
 * a username. This layout owns that persistent tab nav so individual pages
 * don't each reimplement it, and so the username in the URL is read once
 * here and threaded down via route params (each page reads it independently
 * via useParams — no prop drilling needed since react-router params are
 * available at any depth).
 */
const TABS = [
  { label: "Dashboard", to: ROUTES.dashboard },
  { label: "Recruiter View", to: ROUTES.recruiter },
  { label: "Resume View", to: ROUTES.resume },
  { label: "Roadmap", to: ROUTES.roadmap },
] as const

export function DashboardLayout() {
  const { username } = useParams<{ username: string }>()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-semibold">{username}</span>
          <nav className="flex gap-1">
            {TABS.map((tab) => (
              <NavLink
                key={tab.label}
                to={tab.to(username)}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-secondary/60"
                  )
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
