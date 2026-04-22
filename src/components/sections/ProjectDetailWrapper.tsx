"use client"

import { useEffect, useState } from "react"
import { Project } from "@/types/portfolio"
import { createSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { ExternalLink, ArrowLeft, Star } from "lucide-react"
import { FaGithub } from "react-icons/fa"
import Link from "next/link"

interface Props {
  id: string
}

export const ProjectDetailWrapper = ({ id }: Props) => {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)  // Image gallery state

  useEffect(() => {
    const fetchProject = async () => {
      const supabase = createSupabaseClient()
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single()

      if (data) setProject(data)
      setIsLoading(false)
    }
    fetchProject()
  }, [id])

  if (isLoading) return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      <div className="aspect-video bg-muted animate-pulse rounded-2xl" />
      <div className="h-4 w-full bg-muted animate-pulse rounded" />
    </div>
  )

  if (!project) return (
    <div className="text-center py-32 text-muted-foreground">
      <p className="text-xl">Project not found.</p>
      <Link href="/projects" className="text-primary underline mt-2 block">← Back to projects</Link>
    </div>
  )

  return (
    <article className="max-w-4xl mx-auto px-6 py-16 space-y-12">

      {/* Back button */}
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">{project.project_type}</span>
          {project.featured && (
            <span className="flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded-full border border-yellow-500/20">
              <Star className="w-3 h-3 fill-current" /> Featured
            </span>
          )}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{project.title}</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">{project.description}</p>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          {project.live_url && (
            <Button asChild size="lg" className="rounded-full gap-2">
              <a href={project.live_url} target="_blank"><ExternalLink className="w-4 h-4" /> Live Demo</a>
            </Button>
          )}
          {project.github_url && (
            <Button asChild size="lg" variant="outline" className="rounded-full gap-2">
              <a href={project.github_url} target="_blank"><FaGithub className="w-4 h-4" /> View Code</a>
            </Button>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      {project.images?.length > 0 && (
        <div className="space-y-3">
          {/* Main image */}
          <div className="aspect-video rounded-2xl overflow-hidden border border-border bg-muted">
            <img src={project.images[currentImage]} alt={project.title}
              className="w-full h-full object-cover" />
          </div>
          {/* Thumbnail strip */}
          {project.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {project.images.map((img, i) => (
                <button key={i} onClick={() => setCurrentImage(i)}
                  className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === currentImage ? "border-primary" : "border-transparent"
                  }`}>
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            {tag}
          </span>
        ))}
      </div>

      {/* Detail sections — only show if data exists */}
      <div className="grid md:grid-cols-2 gap-8">
        {project.my_role && (
          <div className="space-y-2">
            <h2 className="font-bold text-lg">My Role</h2>
            <p className="text-muted-foreground">{project.my_role}</p>
          </div>
        )}
        {project.purpose && (
          <div className="space-y-2">
            <h2 className="font-bold text-lg">Purpose</h2>
            <p className="text-muted-foreground">{project.purpose}</p>
          </div>
        )}
      </div>

      {project.key_features && (
        <div className="space-y-2">
          <h2 className="font-bold text-xl">Key Features</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{project.key_features}</p>
        </div>
      )}

      {project.what_i_learned && (
        <div className="space-y-2 p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <h2 className="font-bold text-xl">What I Learned</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{project.what_i_learned}</p>
        </div>
      )}
    </article>
  )
}
