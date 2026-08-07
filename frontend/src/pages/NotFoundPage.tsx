import { Link } from "react-router-dom"
import { ROUTES } from "../routes/paths"

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Link to={ROUTES.home} className="text-primary underline">
        Back to home
      </Link>
    </div>
  )
}
