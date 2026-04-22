// One row in the admin project list
// Knows nothing about modals or hooks — just displays and calls callbacks
import { Project } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FaGithub } from "react-icons/fa"
import { Trash2, ExternalLink, Pencil, Star } from "lucide-react"

interface ProjectListItemProps {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
  onToggleFeatured: (id: string, featured: boolean) => void
}

export const ProjectListItem = ({ project, onEdit, onDelete, onToggleFeatured }: ProjectListItemProps) => {
  return (
    <Card className="flex flex-row items-center justify-between p-4 gap-4 hover:border-primary/20 transition-colors">

      {/* Thumbnail */}
      {project.images?.[0] && (
        <img src={project.images[0]} alt={project.title}
          className="w-14 h-14 rounded-lg object-cover shrink-0 border border-border" />
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold truncate">{project.title}</p>
        <p className="text-sm text-muted-foreground truncate">{project.description}</p>
        <div className="flex gap-1 mt-1 flex-wrap">
          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
            {project.project_type}
          </span>
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 shrink-0">
        {project.live_url && (
          <Button asChild size="icon" variant="ghost">
            <a href={project.live_url} target="_blank"><ExternalLink className="w-4 h-4" /></a>
          </Button>
        )}
        {project.github_url && (
          <Button asChild size="icon" variant="ghost">
            <a href={project.github_url} target="_blank"><FaGithub className="w-4 h-4" /></a>
          </Button>
        )}
        <Button
          size="icon"
          variant={project.featured ? "default" : "ghost"}
          title={project.featured ? "Remove from homepage" : "Feature on homepage"}
          onClick={() => onToggleFeatured(project.id, !project.featured)}
        >
          <Star className={`w-4 h-4 ${project.featured ? "fill-current" : ""}`} />
        </Button>
        <Button size="icon" variant="outline" onClick={() => onEdit(project)}>
          <Pencil className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="destructive" onClick={() => onDelete(project.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
