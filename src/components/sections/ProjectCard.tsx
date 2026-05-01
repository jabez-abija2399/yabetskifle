"use client"

import { Project } from "@/types/portfolio"
import { ArrowUpRight } from "lucide-react"
import { FaGithub } from "react-icons/fa"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface ProjectCardProps {
  project: Project
  index?: number
  variant?: "default" | "wide"
}

export const ProjectCard = ({ project, index = 0, variant = "default" }: ProjectCardProps) => {
  const router = useRouter()
  const handleNavigate = () => router.push(`/projects/${project.id}`)
  const num = String(index + 1).padStart(2, "0")

  return (
    <article
      onClick={handleNavigate}
      className="group cursor-pointer flex flex-col gap-5"
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden rounded-3xl bg-secondary border border-border ${
          variant === "wide" ? "aspect-21/10" : "aspect-4/3"
        }`}
      >
        {project.images && project.images.length > 0 ? (
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-xs uppercase tracking-widest">
            No preview
          </div>
        )}

        {/* Hover overlay with action */}
        <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-background text-foreground px-6 h-12 inline-flex items-center gap-2 rounded-full text-sm font-medium shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform">
            View case study <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>

        {/* Top corner: external links */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 rounded-full bg-background/90 backdrop-blur border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="w-4 h-4" />
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 rounded-full bg-background/90 backdrop-blur border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors"
              aria-label="Live site"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-start justify-between gap-6 px-1">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="font-mono text-xs">{num}</span>
            <span className="h-px flex-1 bg-border" />
            <span className="eyebrow text-[10px]">{project.project_type || "Project"}</span>
          </div>
          <h3 className="font-display text-3xl md:text-4xl leading-tight group-hover:text-signal transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 text-pretty">
            {project.description}
          </p>
        </div>
      </div>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
