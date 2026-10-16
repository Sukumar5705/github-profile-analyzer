import { apiClient } from "./client"

import type {
  ApiEnvelope,
  AnalyzeProfileResponse,
  SingleProfileResponse,
  Profile,
} from "@/types/api"

/**
 * POST /api/github/analyze/:username
 *
 * Runs the complete GitHub analysis pipeline:
 * GitHub fetch → analyzers → database persistence.
 *
 * Use this when the user explicitly analyzes a profile.
 */
export async function analyzeProfile(
  username: string
): Promise<AnalyzeProfileResponse> {
  const { data } =
    await apiClient.post<ApiEnvelope<AnalyzeProfileResponse>>(
      `/github/analyze/${encodeURIComponent(username)}`,
      undefined,
      {
        // No client-side timeout for the analysis pipeline. It involves
        // GitHub pagination, README fetching, Gemini AI, and DB writes
        // which can legitimately take 30-120 s for large profiles.
        timeout: 0,
      }
    )

  return data.data
}

/**
 * GET /api/github/analyze/:username/progress
 *
 * Live backend stage for an in-flight analysis. Polled by AnalyzingPage
 * while the POST above is still pending, so the loading screen reflects
 * what the pipeline is actually doing instead of a fixed client-side timer.
 */
export interface AnalysisProgress {
  stage: "connect" | "fetch" | "analyze" | "intelligence" | "report" | null
  message: string | null
  done: boolean
  error: string | null
}

export async function getAnalysisProgress(
  username: string
): Promise<AnalysisProgress> {
  const { data } =
    await apiClient.get<ApiEnvelope<AnalysisProgress>>(
      `/github/analyze/${encodeURIComponent(username)}/progress`
    )

  return data.data
}

/**
 * GET /api/github/profiles/:username
 *
 * Loads an already analyzed profile from the database.
 *
 * This is what DashboardPage should use.
 */
export async function getProfile(
  username: string
): Promise<SingleProfileResponse> {
  const { data } =
    await apiClient.get<ApiEnvelope<SingleProfileResponse>>(
      `/github/profiles/${encodeURIComponent(username)}`
    )

  return data.data
}

/**
 * GET /api/github/search?username=xxx
 *
 * Searches previously analyzed profiles.
 */
export async function searchProfiles(
  query: string
): Promise<Profile[]> {
  const { data } =
    await apiClient.get<ApiEnvelope<Profile[]>>(
      "/github/search",
      {
        params: {
          username: query,
        },
      }
    )

  return data.data
}

/**
 * GET /api/github/profiles?page=1&limit=10
 *
 * Returns paginated analyzed profiles.
 */
export async function getAllProfiles(
  page = 1,
  limit = 10
) {
  const { data } = await apiClient.get<{
    success: boolean
    currentPage: number
    totalPages: number
    totalProfiles: number
    count: number
    data: Profile[]
  }>("/github/profiles", {
    params: {
      page,
      limit,
    },
  })

  return data
}