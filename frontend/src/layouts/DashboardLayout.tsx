import { useState, type FormEvent } from "react"
import { NavLink, Outlet, useParams, useNavigate, Link } from "react-router-dom"
import { ROUTES } from "../routes/paths"
import { 
  Terminal, 
  LayoutDashboard, 
  UserCheck, 
  FileText, 
  Compass, 
  Search, 
  ArrowRight,
  ExternalLink
} from "lucide-react"

const TABS = [
  { label: "Overview & Dev Intel", to: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Recruiter Intelligence", to: ROUTES.recruiter, icon: UserCheck },
  { label: "Resume Intelligence", to: ROUTES.resume, icon: FileText },
  { label: "Growth Roadmap", to: ROUTES.roadmap, icon: Compass },
] as const

export function DashboardLayout() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const [newUsername, setNewUsername] = useState("")

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    const clean = newUsername.trim().replace(/^@/, "")
    if (!clean) return
    navigate(ROUTES.dashboard(clean))
    setNewUsername("")
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* ── Top Fixed Navigation Bar ───────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-6">
            <Link
              to={ROUTES.home}
              className="group flex items-center gap-2.5 text-[#0F172A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F172A] text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                <Terminal className="h-4 w-4 text-blue-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-[#0F172A]">
                  DevIntel
                </span>
                <span className="hidden sm:inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                  Platform
                </span>
              </div>
            </Link>

            {/* Candidate Context Pill */}
            {username && (
              <div className="hidden md:flex items-center gap-2 rounded-lg bg-slate-100/80 px-2.5 py-1 text-xs text-[#64748B] border border-slate-200/60">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                <span className="font-medium text-slate-500">Analyzing:</span>
                <span className="font-mono font-semibold text-[#0F172A]">@{username}</span>
                <a
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-700 transition-colors ml-0.5"
                  title="Open GitHub Profile"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>

          {/* Right: Quick Switch Search Bar */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <div className="relative flex items-center">
                <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Analyze another @username..."
                  className="h-8.5 w-48 lg:w-64 rounded-lg border border-[#E2E8F0] bg-slate-50 pl-8 pr-8 text-xs font-mono text-[#0F172A] placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
                {newUsername.trim() && (
                  <button
                    type="submit"
                    className="absolute right-1.5 flex h-5.5 w-5.5 items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </form>

            <Link
              to={ROUTES.home}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A] shadow-subtle hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <span>+ New Search</span>
            </Link>
          </div>

        </div>

        {/* ── Sub-Header: Segmented Tab Bar ─────────────────────────── */}
        <div className="border-t border-[#E2E8F0] bg-white px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-1.5 no-scrollbar" aria-label="Dashboard views">
              {TABS.map((tab) => {
                const Icon = tab.icon
                return (
                  <NavLink
                    key={tab.label}
                    to={tab.to(username)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-blue-50 text-blue-700 shadow-subtle font-semibold border border-blue-200/60"
                          : "text-[#64748B] hover:bg-slate-100/80 hover:text-[#0F172A]"
                      }`
                    }
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{tab.label}</span>
                  </NavLink>
                )
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ───────────────────────────────────────── */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* ── Light Subtle Footer ────────────────────────────────────── */}
      <footer className="border-t border-[#E2E8F0] bg-white py-6 text-center text-xs text-[#94A3B8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">DevIntel</span>
            <span>—</span>
            <span>Developer Intelligence & Recruiter Analytics</span>
          </div>
          <p>© {new Date().getFullYear()} DevIntel Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

