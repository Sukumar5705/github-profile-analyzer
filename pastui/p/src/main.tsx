import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider } from "react-router-dom"
import { router} from "./routes/router"
import "./index.css"

/**
 * One QueryClient for the whole app. Defaults tuned for this product:
 * analysis data doesn't change second-to-second, so a short staleTime
 * avoids redundant refetches when navigating between Dashboard/Recruiter/
 * Resume/Roadmap tabs for the same username.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
)
