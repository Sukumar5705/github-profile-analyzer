import { createBrowserRouter } from "react-router-dom"
import { RootLayout } from "../layouts/RootLayout"
import { DashboardLayout } from "../layouts/DashboardLayout"
import { LandingPage } from "../pages/LandingPage"
import { DashboardPage } from "../pages/DashboardPage"
import { RecruiterPage } from "../pages/RecruiterPage"
import { ResumePage } from "../pages/ResumePage"
import { RoadmapPage } from "../pages/RoadmapPage"
import {NotFoundPage} from "../pages/NotFoundPage"

/**
 * Two route families:
 *  - "/" — landing page, no shared chrome (RootLayout is a passthrough)
 *  - "/:view/:username" — four views of one analyzed profile, all nested
 *    under DashboardLayout so they share the tab nav and the username
 *    from the URL without re-fetching navigation state per page.
 */
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard/:username", element: <DashboardPage /> },
          { path: "/recruiter/:username", element: <RecruiterPage /> },
          { path: "/resume/:username", element: <ResumePage /> },
          { path: "/roadmap/:username", element: <RoadmapPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
])
