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
    <section className="px-6 md:px-12 py-24 md:py-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between gap-8 mb-16 md:mb-20 border-b border-border pb-10">
          <div className="space-y-4 max-w-2xl">
            <p className="eyebrow">{t(copy, "projects.archive_eyebrow", "Archive")}</p>
            <h1 className="font-display text-heading-hero leading-[0.9]">
              {renderRichTitle(t(copy, "projects.archive_title", "Selected *work*"))}<span className="text-signal">.</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground text-pretty pt-2">
              {t(copy, "projects.archive_subtitle", "A complete index of recent projects — case studies, prototypes, and shipped products across web and product engineering.")}
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="font-mono text-xs text-muted-foreground">
              {isLoading ? "—" : String(projects.length).padStart(2, "0")} projects
            </p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid md:grid-cols-2 gap-10 md:gap-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-5">
                <div className="aspect-4/3 rounded-3xl bg-secondary animate-pulse" />
                <div className="h-6 bg-secondary animate-pulse rounded-full w-2/3" />
                <div className="h-4 bg-secondary animate-pulse rounded-full w-full" />
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
                title="No projects yet"
                description="The archive is empty. Add projects via the admin dashboard."
              />
            ) : (
              <div className="grid md:grid-cols-2 gap-12 md:gap-16">
                {projects.map((project, i) => (
                  <div
                    key={project.id}
                    className="animate-in fade-in slide-in-from-bottom-8 duration-500 fill-mode-both"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <ProjectCard project={project} index={i} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
