/**
 * Domain types for the AI Recruiter & Hiring Intelligence Platform.
 */

// ─────────────────────────────────────────────────────────────
// Profile
// ─────────────────────────────────────────────────────────────

export interface Profile {
  id?: number
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
// Career Score & AI Score Breakdown
// ─────────────────────────────────────────────────────────────

export interface CareerScoreBreakdown {
  documentation: number
  diversity: number
  deployment: number
  techBreadth: number
  activity: number
  openSource: number
}

export interface ScoreBreakdownItem {
  category: string
  score: number
  reason: string
}

export interface CareerScore {
  score: number
  confidence?: number
  confidenceReason?: string
  breakdown?: CareerScoreBreakdown
  scoreBreakdown?: ScoreBreakdownItem[]
  label?: string
}

// ─────────────────────────────────────────────────────────────
// Developer Type & Specialization
// ─────────────────────────────────────────────────────────────

export interface DeveloperType {
  developerType: string
  confidence: number
  reasons: string[]
}

export type Seniority =
  | "Principal Engineer"
  | "Staff Engineer"
  | "Senior Engineer"
  | "Mid-Level Engineer"
  | "Junior Engineer"
  | string

export type HireDecision =
  | "Strong Hire"
  | "Hire"
  | "Leaning Hire"
  | "Leaning No Hire"
  | "No Hire"

export interface RoleFit {
  role: string
  fit: number
  reason?: string
}

// ─────────────────────────────────────────────────────────────
// Gaps & Recommendations
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
  stars?: number
  readme?: string | number
  description?: number
  activity?: number
  size?: number
  complexity?: string
  communityImpact?: string
  architecture?: string[]
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
  resumeProject?: ShowcaseProject
  technicalProject?: ShowcaseProject
  recruiterProject?: ShowcaseProject
  architectureProject?: ShowcaseProject
}

// ─────────────────────────────────────────────────────────────
// Recruiter Analysis & Interview Intelligence
// ─────────────────────────────────────────────────────────────

export interface RecruiterAnalysis {
  strengths: string[]
  concerns: string[]
  highlights: string[]
}

export interface InterviewPlanItem {
  topic: string
  reason: string
  sampleQuestion?: string
}

export interface InterviewQuestion {
  question: string
  category: string
  difficulty: "hard" | "medium" | "easy" | string
  rationale?: string
}

// ─────────────────────────────────────────────────────────────
// Resume Evidence & Highlights
// ─────────────────────────────────────────────────────────────

export interface ResumeEvidenceEntry {
  claim: string
  evidence: string[]
}

export interface ResumeEvidence {
  [key: string]: ResumeEvidenceEntry | undefined
}

// ─────────────────────────────────────────────────────────────
// Candidate Roadmap
// ─────────────────────────────────────────────────────────────

export interface RoadmapMonth {
  focus: string
  tasks: string[]
}

export interface CandidateRoadmap {
  nextCareerStep: string
  skillsToExpand: string[]
  timeline?: {
    month1: RoadmapMonth
    month2: RoadmapMonth
    month3: RoadmapMonth
    goal?: string
  }
  month1?: RoadmapMonth
  month2?: RoadmapMonth
  month3?: RoadmapMonth
  goal?: string
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
// AI Report
// ─────────────────────────────────────────────────────────────

export interface AIReport {
  username: string
  careerScore?: CareerScore
  confidence?: number
  confidenceReason?: string
  hireDecision?: HireDecision
  seniority?: Seniority
  recommendedRole?: string
  recommendedTeam?: string
  aiSummary: {
    summary: string
    technicalSummary?: string
    hiringRecommendation?: string
    strengths: string[]
    improvements: string[]
  }
  roadmap: CandidateRoadmap
  candidateRoadmap?: CandidateRoadmap
  portfolioReview: {
    verdict: string
    seniority?: string
    recommendedRole?: string
    recommendedTeam?: string
    strengths: string[]
    weaknesses: string[]
    recruiterImpression: string
    scoreBreakdown?: ScoreBreakdownItem[]
    roleFit?: RoleFit[]
    teamFit?: string[]
    interviewPlan?: InterviewPlanItem[]
  }
  resumeHighlights?: string[]
  resumeEvidence?: ResumeEvidence
  portfolioShowcase?: PortfolioShowcase
  interviewPlan?: InterviewPlanItem[]
  roleFit?: RoleFit[]
  teamFit?: string[]
}

// ─────────────────────────────────────────────────────────────
// Full Profiles & Responses
// ─────────────────────────────────────────────────────────────

export interface AnalyzeProfileResponse {
  profile: Profile
  skills: Skill[]
  topProjects: RankedProject[]
  careerScore: CareerScore
  confidence: number
  confidenceReason: string
  developerType: DeveloperType
  seniority: Seniority
  recommendedRole: string
  recommendedTeam: string
  hireDecision: HireDecision
  scoreBreakdown: ScoreBreakdownItem[]
  roleFit: RoleFit[]
  teamFit: string[]
  executiveSummary: string
  technicalSummary: string
  hiringRecommendation: string
  interviewFocus?: string
  riskAreas?: string
  gaps: Gap[]
  portfolioGaps: Gap[]
  gapSeverity?: GapSeverity | "none"
  recruiter: RecruiterAnalysis
  strengths: string[]
  concerns: string[]
  recommendations: Recommendation[]
  interviewPlan: InterviewPlanItem[]
  interviewQuestions?: InterviewQuestion[]
  resumeHighlights: string[]
  portfolioShowcase: PortfolioShowcase
  resumeEvidence: ResumeEvidence
  candidateRoadmap: CandidateRoadmap
  learningRoadmap?: CandidateRoadmap
  summary: AnalysisSummary
  analyzedAt?: string
}

export interface SingleProfileResponse extends AnalyzeProfileResponse {
  repositories: unknown[]
}

export type RecruiterViewResponse = AnalyzeProfileResponse

export interface ScoreHistoryPoint {
  career_score: number
  analyzed_at: string
}

export interface ApiEnvelope<T> {
  success: boolean
  message?: string
  data: T
  cached?: boolean
}

export interface ApiError {
  success: false
  message: string
  errors?: unknown
}