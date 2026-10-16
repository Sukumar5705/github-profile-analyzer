import { apiClient } from "./client"
import type { ApiEnvelope, AIReport } from "@/types/api"

/**
 * POST /api/analysis/:username/generate-ai
 * Runs Gemini-backed summary/roadmap/portfolio-review generation.
 * Requires analyzeProfile to have run first (backend returns 400/404
 * otherwise) — call this from the Roadmap View, after the dashboard
 * has already triggered the base analysis.
 */
export async function generateAIReport(username: string) {
  const { data } = await apiClient.post<ApiEnvelope<AIReport>>(
    `/analysis/${encodeURIComponent(username)}/generate-ai`
  )
  return data.data
}
