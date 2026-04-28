import { fetchGithubStats } from "@/services/github"
import { GithubMetricsUI } from "./GithubMetricsUI"

export async function GithubMetrics({ username }: { username: string }) {
  // Awaits the external API call securely on the server
  const stats = await fetchGithubStats(username)

  if (!stats) return null;

  return <GithubMetricsUI stats={stats} />
}
