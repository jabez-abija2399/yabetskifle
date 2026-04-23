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
  const [currentImage, setCurrentImage] = useState(0) // Used only for the gallery section

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
      <Link href="/projects" className="text-primary underline mt-2 block">← Back to Projects</Link>
    </div>
  )

  return (
    <div className="pb-24">
      {/* ── HERO SECTION: Static Cover with First Image ── */}
      <div className="relative h-[80vh] min-h-[480px] overflow-hidden bg-black/5">
        {project.images?.length > 0 ? (
          <>
            <Image
              src={project.images[0]} // ✅ Always use first image
              alt="Backdrop"
              fill
              className="h-full w-full object-cover blur-3xl opacity-20 scale-110"
            />
            <div className="relative w-full h-full p-10 md:p-16">
              <Image
                src={project.images[0]} // ✅ Always use first image
                alt={project.title}
                fill
                priority
                quality={100}
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 via-background to-primary/5" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium bg-background/50 backdrop-blur-md hover:bg-background border border-border px-5 py-2.5 rounded-full transition-all text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>

        <div className="absolute bottom-8 left-0 right-0 px-6">
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground px-3 py-1 rounded-full">
                {project.project_type}
              </span>
              {project.featured && (
                <span className="flex items-center gap-1 text-[10px] font-bold bg-yellow-500/10 text-yellow-600 px-3 py-1 rounded-full border border-yellow-500/20">
                  <Star className="w-3 h-3 fill-current" /> Featured
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl">
              {project.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-3 gap-12 pt-8">
        
        <main className="lg:col-span-2 space-y-12">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">The Story</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* ── GALLERY SECTION: Interactive ── */}
          {project.images?.length > 0 && (
            <div className="space-y-4 pt-4">
              <h2 className="text-2xl font-bold">Project Gallery</h2>
              
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-border bg-muted/30 shadow-2xl">
                 <Image
                  src={project.images[currentImage]} // ✅ Interactive with thumbnails
                  fill
                  className="object-cover blur-2xl opacity-10 scale-110"
                  alt=""
                />
                <div className="relative w-full h-full p-4 md:p-8">
                  <Image
                    src={project.images[currentImage]} // ✅ Interactive with thumbnails
                    fill
                    quality={100}
                    className="object-contain drop-shadow-xl transition-all duration-500"
                    alt={`Preview ${currentImage + 1}`}
                  />
                </div>
              </div>

              {/* Thumbnails to change the Gallery Image */}
              {project.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {project.images.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => setCurrentImage(i)}
                      className={`relative shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        i === currentImage ? "border-primary scale-105 shadow-md" : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt={`Thumb ${i}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Purpose, Features, and Lessons Learned */}
          {project.purpose && (
            <div className="space-y-4 p-8 rounded-3xl bg-secondary/30 border border-secondary shadow-sm">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" /> The Mission
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {project.purpose}
              </p>
            </div>
          )}

          {project.key_features && (
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> Key Features
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {project.key_features.split(/\n|,/).map(f => f.trim()).filter(Boolean).map((feature) => (
                  <div key={feature} className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.what_i_learned && (
            <div className="space-y-4 p-8 rounded-3xl bg-yellow-500/5 border border-yellow-500/10 shadow-sm">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" /> What I Learned
              </h3>
              <p className="text-muted-foreground italic leading-relaxed">
                "{project.what_i_learned}"
              </p>
            </div>
          )}
        </main>

        {/* Sidebar and Action Buttons stay same */}
        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="flex gap-3">
            {project.live_url && (
              <Button asChild className="flex-1 rounded-2xl h-14 font-bold gap-2">
                <a href={project.live_url} target="_blank">Live Preview <ExternalLink className="w-4 h-4" /></a>
              </Button>
            )}
            {project.github_url && (
              <Button asChild variant="outline" className="flex-1 rounded-2xl h-14 font-bold border-2 gap-2">
                <a href={project.github_url} target="_blank">Code <FaGithub className="w-4 h-4" /></a>
              </Button>
            )}
          </div>

          <div className="p-6 rounded-3xl border border-border bg-card/50 space-y-6 shadow-sm">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Role</p>
                  <p className="font-bold text-sm tracking-tight">{project.my_role || "Developer"}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Category</p>
                  <p className="font-bold text-sm tracking-tight">{project.project_type}</p>
                </div>
              </div>
            </div>
            <hr className="border-border" />
            <div className="space-y-3">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground font-bold border border-border">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
