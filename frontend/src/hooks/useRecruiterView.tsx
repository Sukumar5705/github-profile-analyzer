import { useQuery } from "@tanstack/react-query"
import { getRecruiterView } from "@/api/recruiter"

export function useRecruiterView(username: string) {
  return useQuery({
    queryKey: ["recruiter", username],
    queryFn: () => getRecruiterView(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}