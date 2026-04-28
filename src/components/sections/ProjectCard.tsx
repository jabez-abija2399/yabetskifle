// Pure display component - receives data, displays it beautifully
import { Button } from "@/components/ui/button"
import { Project } from "@/types/portfolio"

// We use ExternalLinkIcon from lucide (comes with Nova preset)
import { ExternalLink, Code2, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { FaGithub } from "react-icons/fa"

interface ProjectCardProps {
  project: Project
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    // The card container with glass effect and hover animation
    // <div className="group relative flex flex-col rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 gap-4 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
    <Link href={`/projects/${project.id}`} className="group relative flex flex-col rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 gap-4 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
      {/* Show first image as thumbnail, with count badge if more exist */}
      {project.images && project.images.length > 0 && (
        <div className="relative overflow-hidden rounded-xl aspect-video bg-muted">
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badge showing total image count */}
          {project.images.length > 1 && (
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              +{project.images.length - 1} more
            </span>
          )}
        </div>
      )}


      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title + Description */}
      <div className="flex-1 space-y-2">
        <h3 className="text-heading-card italic">{project.title}</h3>
        <p className="text-body italic line-clamp-2">
          {project.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 pt-2">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary group-hover:gap-4 transition-all">
          Explore Case Study
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  )
}
