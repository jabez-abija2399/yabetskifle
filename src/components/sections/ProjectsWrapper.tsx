"use client" 

import { useProjects } from "@/hooks/useProjects"
import { Projects } from "./Projects"

export const ProjectsWrapper = () => {
  // All data logic is here, away from page.tsx
  const { projects, isLoading } = useProjects()

  return <Projects projects={projects} isLoading={isLoading} />
}
