"use client"

import { useEffect, useState } from "react"
import { Project } from "@/types/portfolio"
import { createSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { ExternalLink, ArrowLeft, Star, User, Briefcase, Lightbulb, CheckCircle2 } from "lucide-react"
import { FaGithub } from "react-icons/fa"
import Link from "next/link"
import Image from "next/image"

interface Props { id: string }

export const ProjectDetailWrapper = ({ id }: Props) => {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const fetchProject = async () => {
      const supabase = createSupabaseClient()
      const { data } = await supabase
        .from("projects").select("*").eq("id", id).single()
      if (data) setProject(data)
      setIsLoading(false)
    }
    fetchProject()
  }, [id])

  // ── Loading State ──────────────────────────────────
  if (isLoading) return (
    <div className="animate-pulse space-y-0">
      <div className="h-[60vh] bg-muted w-full" />
      <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {[1,2,3].map(i => <div key={i} className="h-4 bg-muted rounded" />)}
        </div>
        <div className="space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-12 bg-muted rounded-xl" />)}
        </div>
      </div>
    </div>
  )

  if (!project) return (
    <div className="text-center py-32">
      <p className="text-xl text-muted-foreground">Project not found.</p>
      <Link href="/projects" className="text-primary underline mt-2 block">← Back</Link>
    </div>
  )

  // ── Main Render ────────────────────────────────────
  return (
    <div>

      {/* ── HERO SECTION: Full-width image with overlay ── */}
      <div className="relative h-[65vh] min-h-[420px] overflow-hidden bg-muted">
        {project.images?.[0] ? (
          <Image
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          // Gradient fallback if no image
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-background to-primary/5" />
        )}

        {/* Dark gradient overlay — text readable on any image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back button — top left */}
        <div className="absolute top-6 left-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Projects
          </Link>
        </div>

        {/* Title content — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-6xl mx-auto space-y-3">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-widest bg-primary/80 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                {project.project_type}
              </span>
              {project.featured && (
                <span className="flex items-center gap-1 text-xs bg-yellow-500/80 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                  <Star className="w-3 h-3 fill-current" /> Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">
              {project.title}
            </h1>

            {/* Tags row */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="text-xs text-white/80 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY: Two-column layout ── */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-12">

        {/* ── LEFT: Main Content (2/3 width) ── */}
        <main className="lg:col-span-2 space-y-12">

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">About This Project</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {project.description}
            </p>
          </div>

          {/* Image Gallery (if more than 1 image) */}
          {project.images?.length > 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Gallery</h2>

              {/* Main selected image */}
              <div className="aspect-video rounded-2xl overflow-hidden border border-border bg-muted shadow-xl">
                <Image
                  src={project.images[currentImage]}
                  alt={`Screenshot ${currentImage + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              </div>

              {/* Thumbnail strip */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {project.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                      i === currentImage
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Image counter */}
              <p className="text-xs text-muted-foreground text-center">
                {currentImage + 1} / {project.images.length}
              </p>
            </div>
          )}

          {/* Purpose */}
          {project.purpose && (
            <div className="space-y-3">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Purpose
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.purpose}
              </p>
            </div>
          )}

          {/* Key Features — displayed as a visual list */}
          {project.key_features && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Key Features
              </h2>
              {/* Split by newline or comma and display as items */}
              <ul className="space-y-3">
                {project.key_features
                  .split(/\n|,/)
                  .map(f => f.trim())
                  .filter(Boolean)
                  .map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* What I Learned — highlighted box */}
          {project.what_i_learned && (
            <div className="relative p-8 rounded-2xl overflow-hidden border border-primary/20">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 pointer-events-none" />

              <div className="relative space-y-3">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  What I Learned
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {project.what_i_learned}
                </p>
              </div>
            </div>
          )}
        </main>

        {/* ── RIGHT: Sticky Sidebar (1/3 width) ── */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">

          {/* Action Buttons */}
          <div className="space-y-3">
            {project.live_url && (
              <Button asChild size="lg" className="w-full rounded-xl gap-2">
                <a href={project.live_url} target="_blank">
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </a>
              </Button>
            )}
            {project.github_url && (
              <Button asChild size="lg" variant="outline" className="w-full rounded-xl gap-2">
                <a href={project.github_url} target="_blank">
                  <FaGithub className="w-4 h-4" /> View Code
                </a>
              </Button>
            )}
          </div>

          {/* Info Card */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
              Project Info
            </h3>

            {project.my_role && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">My Role</p>
                  <p className="text-sm font-semibold">{project.my_role}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Project Type</p>
                <p className="text-sm font-semibold">{project.project_type}</p>
              </div>
            </div>
          </div>

          {/* Tech Stack Card */}
          {project.tags.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
