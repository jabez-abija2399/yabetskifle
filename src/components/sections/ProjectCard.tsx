// Pure display component - receives data, displays it beautifully
import { Button } from "@/components/ui/button"
import { Project } from "@/types/portfolio"

// We use ExternalLinkIcon from lucide (comes with Nova preset)
import { ExternalLink, Code2 } from "lucide-react"
import { FaGithub } from "react-icons/fa"

interface ProjectCardProps {
  project: Project
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    // The card container with glass effect and hover animation
    <div className="group relative flex flex-col rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 gap-4 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">

      {/* Show first image as thumbnail, with count badge if more exist */}
      {project.images && project.images.length > 0 && (
        <div className="relative overflow-hidden rounded-xl aspect-video bg-muted">
          <img
            src={project.images[0]}
            alt={project.title}
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
        <h3 className="text-xl font-bold tracking-tight">{project.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        {project.live_url && (
          <Button asChild size="sm" className="flex-1 rounded-full gap-2">
            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </a>
          </Button>
        )}
        {project.github_url && (
          <Button asChild size="sm" variant="outline" className="flex-1 rounded-full gap-2">
            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
              <FaGithub className="w-4 h-4" />
              Code
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}
