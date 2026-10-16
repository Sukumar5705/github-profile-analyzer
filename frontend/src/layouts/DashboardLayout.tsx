import { useState, type FormEvent } from "react"
import { NavLink, Outlet, useParams, useNavigate, Link, useLocation } from "react-router-dom"
import { ROUTES } from "../routes/paths"
import {
  BarChart3,
  FileText,
  Compass,
  Briefcase,
  Settings,
  Search,

  ArrowRight,
  ExternalLink,
  ChevronDown
} from "lucide-react"

export function DashboardLayout() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchInput, setSearchInput] = useState("")
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    const clean = searchInput.trim().replace(/^@/, "")
    if (!clean) return
    navigate(ROUTES.dashboard(clean))
    setSearchInput("")
  }

  const navItems = [
    { label: "Dashboard", to: ROUTES.dashboard(username), icon: BarChart3, exact: true },

    { label: "Resume Intelligence", to: ROUTES.resume(username), icon: FileText },
    { label: "Roadmap", to: ROUTES.roadmap(username), icon: Compass },
    { label: "Recruiter View", to: ROUTES.recruiter(username), icon: Briefcase },
  ]

  const isNavActive = (itemTo: string) => {
    if (itemTo.includes("#")) {
      return location.pathname === ROUTES.dashboard(username) && location.hash === itemTo.substring(itemTo.indexOf("#"))
    }
    return location.pathname === itemTo && !location.hash
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F0FF] via-[#F6F0FF] to-[#FFE9F2] text-[#141414] antialiased">
      {/* ── Top Glass Navigation Bar ───────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="mx-auto max-w-[1440px] glass-navbar rounded-2xl px-5 py-3 shadow-soft flex items-center justify-between gap-4">

          {/* Brand Wordmark */}
          <Link to={ROUTES.home} className="flex items-center gap-3 shrink-0 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#036AFF] to-[#8B5CF6] text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#141414]">
              DevIntel
            </span>
          </Link>

          {/* Central Glass Search Input */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto hidden sm:block">
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#64748B]" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search GitHub username..."
                className="glass-input h-10 w-full rounded-xl pl-10 pr-10 text-sm font-medium text-[#141414] placeholder:text-[#64748B] focus:outline-none"
              />
              {searchInput.trim() && (
                <button
                  type="submit"
                  className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-lg bg-[#036AFF] text-white hover:bg-blue-700 transition-colors"
                >
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </form>

          {/* Right Area: Status, Notification & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick stats pills */}
            <div className="hidden lg:flex items-center gap-2">


            </div>

            {/* Active Candidate Pill */}
            {username && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2.5 rounded-xl bg-white/70 hover:bg-white/95 border border-white/80 px-2.5 py-1.5 transition-all shadow-sm"
                >
                  <img
                    src={`https://github.com/${username}.png`}
                    alt={username}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none"
                    }}
                    className="h-7 w-7 rounded-full ring-1 ring-white shrink-0 object-cover"
                  />
                  <div className="hidden md:flex flex-col text-left leading-tight">
                    <span className="text-xs font-bold text-[#141414]">@{username}</span>
                    <span className="text-[11px] text-[#64748B]">Active Analysis</span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-[#64748B] ml-0.5" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/80 p-2 shadow-soft z-50 animate-in fade-in-50 duration-100">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-[#141414]">GitHub Candidate</p>
                      <p className="text-xs font-mono text-[#64748B] truncate">github.com/{username}</p>
                    </div>
                    <a
                      href={`https://github.com/${username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#141414] hover:bg-slate-100 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-[#64748B]" />
                      <span>View GitHub Profile</span>
                    </a>
                    <Link
                      to={ROUTES.home}
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#036AFF] hover:bg-blue-50 transition-colors"
                    >
                      <span>Analyze Different Profile</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </header>

      {/* ── Main Container: Sidebar + Content ─────────────────────── */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-4 flex gap-6 items-start">

        {/* ── Left Glass Sidebar ───────────────────────────────────── */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col glass-sidebar p-4 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar">
          <nav className="flex flex-col space-y-1" aria-label="Sidebar Navigation">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isNavActive(item.to)

              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 ${active
                    ? "bg-gradient-to-r from-[#036AFF] to-[#6366F1] text-white shadow-md shadow-blue-500/25"
                    : "text-[#64748B] hover:text-[#141414] hover:bg-white/60"
                    }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-[#64748B]"}`} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* Bottom Sidebar Action */}
          <div className="mt-8 pt-4 border-t border-white/60">
            <Link
              to={ROUTES.home}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-white/70 hover:bg-white/90 border border-white/80 px-3.5 py-2.5 text-xs font-bold text-[#141414] transition-all shadow-sm"
            >
              <Settings className="h-4 w-4 text-[#64748B]" />
              <span>New Analysis</span>
            </Link>
          </div>
        </aside>

        {/* ── Dynamic Main Content ─────────────────────────────────── */}
        <main className="flex-1 min-w-0 pb-12">
          {/* Mobile sub-tabs */}
          <div className="lg:hidden mb-4 overflow-x-auto no-scrollbar flex gap-2 py-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isNavActive(item.to)
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold ${active
                    ? "bg-gradient-to-r from-[#036AFF] to-[#6366F1] text-white shadow-sm"
                    : "bg-white/60 text-[#64748B] border border-white/70"
                    }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </div>

          <Outlet />
        </main>

      </div>
    </div>
  )
}
