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
      `/github/analyze/${encodeURIComponent(username)}`
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