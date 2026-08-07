import { Link } from "react-router-dom"
import { ROUTES } from "../../routes/paths"

export function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6"
      >
        {/* Wordmark */}
        <Link
          to={ROUTES.home}
          className="text-base font-semibold tracking-tight text-gray-900 hover:text-gray-700 transition-colors"
        >
          devintel
        </Link>

        {/* Ghost-style anchor link — no shadcn needed */}
        <a
          href="#for-recruiters"
          className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600
                     hover:bg-gray-100 hover:text-gray-900 transition-colors
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          For recruiters
        </a>
      </nav>
    </header>
  )
}
