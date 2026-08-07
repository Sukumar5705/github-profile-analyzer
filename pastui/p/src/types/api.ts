/**
 * Domain types for the Developer Intelligence Platform.
 *
 * Keep these types aligned with the normalized API responses
 * returned by the backend.
 */

// ─────────────────────────────────────────────────────────────
// Profile
// ─────────────────────────────────────────────────────────────

export interface Profile {
  username: string

  name: string | null

  bio: string | null

  location?: string | null

  email?: string | null

  blog?: string | null

  company?: string | null

  public_repos: number

  followers: number

  following?: number

  account_age_days?: number

  profile_url: string

  avatar_url: string
}

// ─────────────────────────────────────────────────────────────
// Skills
// ─────────────────────────────────────────────────────────────

export interface Skill {
  skill: string
  confidence: number
}

// ─────────────────────────────────────────────────────────────
// Career Score
// ─────────────────────────────────────────────────────────────

export interface CareerScoreBreakdown {
  documentation: number

  diversity: number

  deployment: number

  techBreadth: number

  activity: number

  openSource: number
}

export interface CareerScore {
  score: number

  breakdown: CareerScoreBreakdown
}

// ─────────────────────────────────────────────────────────────
// Developer Type
// ─────────────────────────────────────────────────────────────

export interface DeveloperType {
  developerType: string

  confidence: number

  reasons: string[]
}

// ─────────────────────────────────────────────────────────────
// Gaps
// ─────────────────────────────────────────────────────────────

export type GapSeverity =
  | "high"
  | "medium"
  | "low"

export interface Gap {
  area: string

  severity: GapSeverity

  advice: string
}

// ─────────────────────────────────────────────────────────────
// Recommendations
// ─────────────────────────────────────────────────────────────

export type RecommendationPriority =
  | "high"
  | "medium"
  | "low"

export interface Recommendation {
  priority: RecommendationPriority

  recommendation: string
}

// ─────────────────────────────────────────────────────────────
// Ranked Projects
// ─────────────────────────────────────────────────────────────

export interface RankedProjectBreakdown {
  stars: number

  readme: number

  description: number

  activity: number

  size: number
}

export interface RankedProject {
  repoName: string

  score: number

  breakdown: RankedProjectBreakdown

  language: string | null

  stars: number

  repoUrl: string
}

// ─────────────────────────────────────────────────────────────
// Portfolio Showcase
//
// Used by POST /analyze response.
// The GET profile endpoint currently returns persisted
// topProjects instead.
// ─────────────────────────────────────────────────────────────

export interface ShowcaseProject {
  repoName: string | null

  repoUrl: string | null

  language: string | null

  stars: number

  reason: string

  score: number
}

export interface PortfolioShowcase {
  resumeProject: ShowcaseProject

  technicalProject: ShowcaseProject

  recruiterProject: ShowcaseProject

  architectureProject: ShowcaseProject
}

// ─────────────────────────────────────────────────────────────
// Recruiter Analysis
// ─────────────────────────────────────────────────────────────

export interface RecruiterAnalysis {
  strengths: string[]

  concerns: string[]

  highlights: string[]
}

// ─────────────────────────────────────────────────────────────
// Resume Evidence
// ─────────────────────────────────────────────────────────────

export interface ResumeEvidenceEntry {
  claim: string

  evidence: string[]
}

export interface ResumeEvidence {
  backend?: ResumeEvidenceEntry

  frontend?: ResumeEvidenceEntry

  databases?: ResumeEvidenceEntry

  devops?: ResumeEvidenceEntry

  aiml?: ResumeEvidenceEntry

  mobile?: ResumeEvidenceEntry

  openSource?: ResumeEvidenceEntry
}

// ─────────────────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────────────────

export interface AnalysisSummary {
  totalStars: number

  totalForks: number

  mostUsedLanguage: string

  totalRepos?: number
}

// ─────────────────────────────────────────────────────────────
// AI
// ─────────────────────────────────────────────────────────────

export interface AIReport {
  username: string

  aiSummary: unknown

  roadmap: unknown

  portfolioReview: unknown
}

// ─────────────────────────────────────────────────────────────
// POST /api/github/analyze/:username
// ─────────────────────────────────────────────────────────────

export interface AnalyzeProfileResponse {
  profile: Profile

  skills: Skill[]

  topProjects: RankedProject[]

  careerScore: CareerScore

  developerType: DeveloperType

  gaps: Gap[]

  gapSeverity:
    | "high"
    | "medium"
    | "low"
    | "none"

  recruiter: RecruiterAnalysis

  recommendations: Recommendation[]

  portfolioShowcase: PortfolioShowcase

  resumeEvidence: ResumeEvidence

  summary: AnalysisSummary
}

// ─────────────────────────────────────────────────────────────
// GET /api/github/profiles/:username
// ─────────────────────────────────────────────────────────────

export interface SingleProfileResponse {
  profile: Profile

  skills: Skill[]

  careerScore: CareerScore | null

  developerType: DeveloperType | null

  recruiter: RecruiterAnalysis

  gaps: Gap[]

  recommendations: Recommendation[]

  topProjects: RankedProject[]

  /*
   * Repository rows are not currently needed by the
   * Dashboard UI.
   *
   * Replace unknown[] with a Repository interface when
   * repository-level UI is introduced.
   */
  repositories: unknown[]
}

// ─────────────────────────────────────────────────────────────
// GET /api/recruiter/:username
// ─────────────────────────────────────────────────────────────

export interface RecruiterViewResponse {
  profile: Profile

  developerType: DeveloperType

  careerScore: CareerScore

  skills: Skill[]

  topProjects: RankedProject[]

  strengths: string[]

  concerns: string[]

  gaps: Gap[]

  recommendations: Recommendation[]

  summary: AnalysisSummary

  analyzedAt?: string
}

// ─────────────────────────────────────────────────────────────
// Score History
// ─────────────────────────────────────────────────────────────

export interface ScoreHistoryPoint {
  career_score: number

  analyzed_at: string
}

// ─────────────────────────────────────────────────────────────
// API Envelope
// ─────────────────────────────────────────────────────────────

export interface ApiEnvelope<T> {
  success: boolean

  message?: string

  data: T
}

// ─────────────────────────────────────────────────────────────
// API Error
// ─────────────────────────────────────────────────────────────

export interface ApiError {
  success: false

  message: string

  errors?: unknown
}