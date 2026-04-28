"use client"

import { useProjects } from "@/hooks/useProjects"
import { ProjectCard } from "./ProjectCard"
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton"
import { EmptyState } from "@/components/ui/EmptyState"
import { FolderGit2 } from "lucide-react"

export const ProjectsAllWrapper = () => {
  const { projects, isLoading } = useProjects()

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto space-y-16">

      {/* 🧭 Page Header: Human & Professional */}
      <div className="space-y-6 text-center md:text-left">
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary italic px-1">Selected Works</p>
        <h1 className="text-heading-hero font-bold tracking-tight italic whitespace-nowrap">
          Design & Code <span className="text-zinc-600">Index.</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg md:text-xl font-medium italic leading-relaxed">
          Explore a comprehensive collection of my professional contributions and technical reflections.
        </p>
      </div>

      {/* ⏳ Loading State */}
      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[1, 2, 3, 4, 5, 6].map(i => (
             <div key={i} className="h-96 bg-muted animate-pulse rounded-[2.5rem]" />
           ))}
        </div>
      )}

      {/* 🎨 Project Grid */}
      {!isLoading && (
        <>
          {projects.length === 0 ? (
            <EmptyState icon={FolderGit2} title="No projects yet" description="The library is currently being updated. Check back soon for new insights!" />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, i) => (
                <div 
                  key={project.id} 
                  className="animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
