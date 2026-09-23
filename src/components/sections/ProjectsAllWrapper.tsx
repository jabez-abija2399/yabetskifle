"use client"

import { useEffect, useState } from "react"
import { useProjects } from "@/hooks/useProjects"
import { ProjectCard } from "./ProjectCard"
import { EmptyState } from "@/components/ui/EmptyState"
import { FolderGit2 } from "lucide-react"
import { PortfolioService } from "@/services/portfolio"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"

export const ProjectsAllWrapper = () => {
  const { projects, isLoading } = useProjects()
  const [copy, setCopy] = useState<SiteCopy>({})
  useEffect(() => {
    PortfolioService.getSiteCopy().then(setCopy).catch(() => setCopy({}))
  }, [])

  return (
    <section className="px-6 md:px-12 lg:px-16 xl:px-24 py-20 md:py-28">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-accent/30">
          <div className="space-y-3 max-w-2xl">
            <div className="eyebrow-chip">
              {t(copy, "projects.archive_eyebrow", "System archive // Index")}
            </div>
            <h1 className="text-heading-hero font-semibold tracking-tight text-foreground">
              {renderRichTitle(t(copy, "projects.archive_title", "Selected production projects"), "text-accent")}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t(copy, "projects.archive_subtitle", "A structured index of deployed applications, architectural case studies, and frontend experiments.")}
            </p>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            <span>[total: {isLoading ? "—" : String(projects.length).padStart(2, "0")} cataloged systems]</span>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4 border border-accent/30 p-6 rounded-xs bg-card">
                <div className="aspect-16/10 rounded-xs bg-secondary animate-pulse" />
                <div className="h-5 bg-secondary animate-pulse rounded-xs w-2/3" />
                <div className="h-4 bg-secondary animate-pulse rounded-xs w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!isLoading && (
          <>
            {projects.length === 0 ? (
              <EmptyState
                icon={FolderGit2}
                title="Archive empty"
                description="No projects currently logged in the catalog."
              />
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {projects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
