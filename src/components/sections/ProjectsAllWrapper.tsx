"use client"

import { useProjects } from "@/hooks/useProjects"
import { ProjectCard } from "./ProjectCard"
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton"
import { EmptyState } from "@/components/ui/EmptyState"
import { Code2 } from "lucide-react"

export const ProjectsAllWrapper = () => {
  const { projects, isLoading } = useProjects()

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto space-y-12">

      {/* Page Header */}
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Portfolio Archive</p>
        <h1 className="text-display">Project <span className="text-zinc-600">Archive.</span></h1>
        <p className="text-muted-foreground max-w-xl text-lg font-medium italic">
          A comprehensive view of my technical contributions across {projects.length} curated works.
        </p>
      </div>

      {/* Loading */}
      {isLoading && <LoadingSkeleton rows={3} height="h-48" />}

      {/* Grid */}
      {!isLoading && (
        <>
          {projects.length === 0 ? (
            <EmptyState icon={Code2} title="No projects yet" description="Check back soon!" />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
