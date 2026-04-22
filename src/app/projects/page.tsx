// Server Component - fast!
import { ProjectsAllWrapper } from "@/components/sections/ProjectsAllWrapper"

export const metadata = {
  title: "All Projects | Yabets Kifle",
  description: "Browse all of Yabets Kifle's projects",
}

export default function ProjectsPage() {
  return (
    <main className="min-h-screen pt-20">
      <ProjectsAllWrapper />
    </main>
  )
}
