/**
 * Single source of truth for route paths. Import these instead of
 * writing string literals in <Link> or navigate() calls — renaming a
 * route becomes a one-line change instead of a project-wide find/replace.
 */
export const ROUTES = {
  home: "/",
  dashboard: (username = ":username") => `/dashboard/${username}`,
  recruiter: (username = ":username") => `/recruiter/${username}`,
  resume: (username = ":username") => `/resume/${username}`,
  roadmap: (username = ":username") => `/roadmap/${username}`,
} as const
