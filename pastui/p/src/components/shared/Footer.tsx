/**
 * Footer
 *
 * Minimal three-item row:
 *   Left   → wordmark (brand)
 *   Center → privacy tagline
 *   Right  → copyright year
 *
 * new Date().getFullYear() computes the year at runtime — the copyright
 * year stays accurate without manual updates each January.
 *
 * Uses <footer> semantic element — landmark for assistive technology,
 * same as <header> for the Navbar.
 */

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">

          {/* Wordmark */}
          <p className="text-sm font-semibold text-gray-900">devintel</p>

          {/* Privacy tagline — sets expectations, not a legal document */}
          <p className="text-xs text-gray-400">
            Built from public GitHub data — nothing more.
          </p>

          {/* Dynamic copyright year */}
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} devintel
          </p>

        </div>
      </div>
    </footer>
  )
}
