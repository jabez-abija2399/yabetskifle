"use client" 

import { useProjects } from "@/hooks/useProjects"
import { Projects,  } from "./Projects"

export const ProjectsWrapper = () => {
  // All data logic is here, away from page.tsx
  const { projects, isLoading, featuredProjects } = useProjects()

  return <Projects  projects={featuredProjects}  isLoading={isLoading} />
}
