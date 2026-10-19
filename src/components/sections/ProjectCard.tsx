"use client"

import { Project } from "@/types/portfolio"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import { FaGithub } from "react-icons/fa"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { trackEvent } from "@/lib/analytics-client"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  project: Project
  index?: number
  variant?: "default" | "featured"
}

const ensureArray = (data: unknown): string[] => {
  if (Array.isArray(data)) return data as string[]
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) return parsed
      return data.split(/\n|,/).map((s) => s.trim()).filter(Boolean)
    } catch {
      return data.split(/\n|,/).map((s) => s.trim()).filter(Boolean)
    }
  }
  return []
}

export const ProjectCard = ({ project, index = 0, variant = "default" }: ProjectCardProps) => {
  const router = useRouter()
  const featured = variant === "featured"
  const handleNavigate = () => {
    trackEvent("project_open", { id: project.id, title: project.title })
    router.push(`/projects/${project.id}`)
  }
  const num = String(index + 1).padStart(2, "0")
  const year = project.created_at ? new Date(project.created_at).getFullYear() : 2026

  const features = ensureArray(project.key_features)
  const learned = ensureArray(project.what_i_learned)
  const problem = project.purpose || project.description
  const hardestPart = learned.length > 0 ? learned[0] : null
  const tags = (project.tags ?? []).slice(0, featured ? 6 : 4)

  return (
    <article
      onClick={handleNavigate}
      className={cn(
        "group lift-card relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card hover:border-accent/60 focus-within:border-accent",
      )}
    >
      {/* Image — leads the card so the work is seen before it is read */}
      <div
        className={cn(
          "relative w-full overflow-hidden bg-secondary",
          featured ? "aspect-[16/10] md:aspect-auto md:min-h-[300px] md:flex-1" : "aspect-[16/10]",
        )}
      >
        {project.images && project.images.length > 0 ? (
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            className="object-cover saturate-[0.9] transition-transform duration-700 ease-out group-hover:scale-[1.04] group-hover:saturate-100"
            sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs text-muted-foreground">
            [preview unavailable]
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-card/80 to-transparent" />

        <div className="absolute left-3 top-3 border border-border bg-background/90 px-2 py-0.5 font-mono text-[10px] text-muted-foreground backdrop-blur-xs">
          {`fig.${num}`}
        </div>
        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-2xl border border-border bg-background/90 text-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100 backdrop-blur-xs">
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-muted-foreground">
          <span className="font-medium text-accent">{project.project_type || "Production"}</span>
          <span>{year}</span>
        </div>

        <h3 className={cn("font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent", featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl")}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleNavigate()
            }}
            className="text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {project.title}
          </button>
        </h3>

        <p className={cn("text-sm leading-relaxed text-foreground/85", !featured && "line-clamp-3")}>
          {problem}
        </p>

        {(features[0] || hardestPart) && (
          <div className="space-y-2 border-l-2 border-accent/50 pl-3 font-sans text-sm">
            {features[0] && (
              <p className="text-foreground/90">
                <span className="mr-1.5 font-mono text-[11px] text-accent">approach</span>
                {features[0]}
              </p>
            )}
            {hardestPart && (
              <p className="text-muted-foreground">
                <span className="mr-1.5 font-mono text-[11px]">lesson</span>
                {hardestPart}
              </p>
            )}
          </div>
        )}

        <div className="mt-auto space-y-4 pt-2">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              {tags.map((tag) => (
                <span key={tag} className="rounded-2xl border border-accent/25 bg-secondary px-2 py-0.5 text-secondary-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/80 pt-4 font-mono text-xs">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleNavigate()
              }}
              className="inline-flex items-center gap-1 font-medium text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Case study
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </button>

            <div className="flex items-center gap-4">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  data-track-event="github_click"
                  data-track-props={JSON.stringify({ id: project.id, title: project.title })}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <FaGithub className="h-3.5 w-3.5" aria-hidden />
                  <span>Source</span>
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  data-track-event="demo_click"
                  data-track-props={JSON.stringify({ id: project.id, title: project.title })}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-accent transition-colors hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  <span>Live</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
