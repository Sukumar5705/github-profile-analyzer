import { apiClient } from "./client"
import type { ApiEnvelope, RecruiterViewResponse, ScoreHistoryPoint } from "@/types/api"

/**
 * GET /api/recruiter/:username
 * Recruiter-shaped snapshot. Auto-triggers analysis server-side if the
 * profile has never been analyzed — so this alone is safe to call from
 * a cold /recruiter/:username deep link, no separate analyze step needed.
 */
export async function getRecruiterView(username: string) {
  const { data } = await apiClient.get<ApiEnvelope<RecruiterViewResponse>>(
    `/recruiter/${encodeURIComponent(username)}`
  )
  return data.data
}

/**
 * GET /api/recruiter/:username/history
 * Career score over time — feeds the trend chart on the Recruiter View.
 */
export async function getScoreHistory(username: string) {
  const { data } = await apiClient.get<ApiEnvelope<ScoreHistoryPoint[]>>(
    `/recruiter/${encodeURIComponent(username)}/history`
  )
  return data.data
}
