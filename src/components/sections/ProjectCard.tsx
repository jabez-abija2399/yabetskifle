"use client"

import { Project } from "@/types/portfolio"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import { FaGithub } from "react-icons/fa"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { trackEvent } from "@/lib/analytics-client"

interface ProjectCardProps {
  project: Project
  index?: number
  variant?: "default" | "wide"
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
  const handleNavigate = () => {
    trackEvent("project_open", { id: project.id, title: project.title })
    router.push(`/projects/${project.id}`)
  }
  const num = String(index + 1).padStart(2, "0")
  const year = project.created_at ? new Date(project.created_at).getFullYear() : 2026

  const features = ensureArray(project.key_features)
  const learned = ensureArray(project.what_i_learned)
  const problem = project.purpose || project.description
  const approach = features.length > 0 ? features[0] : null
  const hardestPart = learned.length > 0 ? learned[0] : null

  return (
    <article
      onClick={handleNavigate}
      className={`group cursor-pointer border border-accent/30 hover:border-accent focus-within:border-accent bg-card rounded-xs transition-all duration-200 flex flex-col justify-between p-5 md:p-6 corner-ticks ${
        variant === "wide" ? "md:grid md:grid-cols-12 md:gap-8 items-stretch" : ""
      }`}
    >
      {/* Content Side */}
      <div className={`flex flex-col justify-between space-y-5 ${variant === "wide" ? "md:col-span-7" : ""}`}>
        <div>
          {/* Monospace metadata header: stack, year, type */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/80 font-mono text-xs text-muted-foreground">
            <span className="text-accent font-medium">
              {`[prj.${num} // ${year}]`}
            </span>
            <span className="text-muted-foreground/80 lowercase">
              sys.{project.project_type?.toLowerCase() || "production"}
            </span>
          </div>

          {/* Title — real link for keyboard/AT; whole card still clickable for mouse */}
          <h3 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight mt-3 group-hover:text-accent transition-colors">
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

          {/* Structured problem -> approach -> hardest-part breakdown */}
          <div className="mt-4 space-y-3 font-mono text-xs">
            {/* Problem */}
            <div className="border-l-2 border-border pl-3 space-y-0.5">
              <span className="text-[11px] text-muted-foreground block font-normal">
                01. Problem & scope:
              </span>
              <p className="font-sans text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
                {problem}
              </p>
            </div>

            {/* Approach */}
            {approach && (
              <div className="border-l-2 border-accent/40 pl-3 space-y-0.5">
                <span className="text-[11px] text-accent block font-normal">
                  02. Architecture & approach:
                </span>
                <p className="font-sans text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
                  {approach}
                </p>
              </div>
            )}

            {/* Hardest Part */}
            {hardestPart && (
              <div className="border-l-2 border-border pl-3 space-y-0.5">
                <span className="text-[11px] text-muted-foreground block font-normal">
                  03. Technical challenge / Hardest part:
                </span>
                <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                  {hardestPart}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stack chips & Links */}
        <div className="pt-4 border-t border-border/80 space-y-3">
          {/* Tech stack metadata */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              {project.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-xs border border-accent/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Direct action links */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs font-mono">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleNavigate()
              }}
              className="inline-flex items-center gap-1 text-accent font-medium group-hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              [ Case study specs <ArrowUpRight className="w-3.5 h-3.5" aria-hidden /> ]
            </button>

            <div className="flex items-center gap-3">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  data-track-event="github_click"
                  data-track-props={JSON.stringify({ id: project.id, title: project.title })}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FaGithub className="w-3.5 h-3.5" />
                  <span>source ↗</span>
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
                  className="inline-flex items-center gap-1 text-accent hover:underline transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>live demo ↗</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual / Screenshot Side */}
      <div
        className={`relative mt-4 md:mt-0 overflow-hidden border border-border bg-secondary rounded-xs ${
          variant === "wide" ? "md:col-span-5 aspect-16/10 md:aspect-auto md:h-full" : "aspect-16/10"
        }`}
      >
        {project.images && project.images.length > 0 ? (
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            className="object-cover grayscale contrast-105 group-hover:grayscale-0 transition-all duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground font-mono text-xs">
            [schematic preview unavailable]
          </div>
        )}

        <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-xs border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
          {`fig.${num} // interface`}
        </div>
      </div>
    </article>
  )
}
