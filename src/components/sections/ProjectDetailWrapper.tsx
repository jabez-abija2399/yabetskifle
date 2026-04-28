"use client"

import { useEffect, useState } from "react"
import { PortfolioService } from "@/services/portfolio"
import { Project } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { ExternalLink, ArrowLeft, Star, User, Briefcase, Lightbulb, CheckCircle2, X, Layers, ChevronLeft, ChevronRight } from "lucide-react"
import { FaGithub } from "react-icons/fa"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface Props { id: string }

const ensureArray = (data: any): string[] => {
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
      return data.split(/\n|,/).map(item => item.trim()).filter(Boolean);
    } catch (e) {
      return data.split(/\n|,/).map(item => item.trim()).filter(Boolean);
    }
  }
  return [];
}

export const ProjectDetailWrapper = ({ id }: Props) => {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const fetchProject = async () => {
      const data = await PortfolioService.getProjectById(id)
      if (data) setProject(data)
      setIsLoading(false)
    }
    fetchProject()
  }, [id])

  const nextImage = () => {
    if (!project?.images) return
    setDirection(1)
    setCurrentImage((prev) => (prev + 1) % project.images.length)
  }

  const prevImage = () => {
    if (!project?.images) return
    setDirection(-1)
    setCurrentImage((prev) => (prev - 1 + project.images.length) % project.images.length)
  }

  if (isLoading) return (
    <div className="animate-pulse space-y-0">
      <div className="h-[60vh] bg-muted w-full" />
      <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2, 3].map(i => <div key={i} className="h-4 bg-muted rounded" />)}
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-muted rounded-xl" />)}
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

  const safeFeatures = ensureArray(project.key_features);
  const safeLearned = ensureArray(project.what_i_learned);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  }

  return (
    <div className="pb-24">
      {/* ── FULL VIEW MODAL ── */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-100 bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-10"
          onClick={() => setIsZoomed(false)}
        >
          <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors bg-white/10 p-4 rounded-full backdrop-blur-md border border-white/10">
             <X className="w-8 h-8" />
          </button>
          
          <div className="relative w-full h-full max-w-7xl">
            <Image
              src={project.images[currentImage]}
              alt="Full View"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

      {/* ── HERO SECTION: Static First Image ── */}
      <div className="relative h-[70vh] min-h-[450px] overflow-hidden bg-black/5 flex items-center justify-center">
        {project.images?.[0] ? (
          <>
            <Image
              src={project.images[0]} 
              alt="Backdrop"
              fill
              className="h-full w-full object-cover blur-3xl opacity-20 scale-110"
            />
            <div className="relative w-full h-full p-10 md:p-20">
              <Image
                src={project.images[0]} 
                alt={project.title}
                fill
                priority
                quality={100}
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-linear-to-br from-primary/10 via-background to-primary/5" />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-bold bg-background/50 backdrop-blur-md hover:bg-background border border-border px-6 py-3 rounded-full transition-all text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>

        <div className="absolute bottom-12 left-0 right-0 px-6">
          <div className="max-w-6xl mx-auto space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground px-4 py-1.5 rounded-full">
                  {project.project_type || "Production Project"}
                </span>
                {project.featured && (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold bg-yellow-500/10 text-yellow-600 px-4 py-1.5 rounded-full border border-yellow-500/20">
                    <Star className="w-3 h-3 fill-current" /> Featured Case
                  </span>
                )}
              </div>
              <h1 className="text-heading-section font-bold tracking-tight max-w-2xl italic leading-tight">
                {project.title}
              </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-3 gap-16 pt-16">

        <main className="lg:col-span-2 space-y-20">

          {/* Project Overview */}
          <div className="space-y-6">
            <h2 className="text-heading-card font-bold italic border-l-4 border-primary pl-6">Project Overview</h2>
            <p className="text-muted-foreground text-lg md:text-xl font-medium leading-relaxed italic text-balance">
              {project.description}
            </p>
          </div>

          {/* GALLERY SECTION: Interactive Slider (Where it belongs) */}
          {project.images?.length > 0 && (
            <div className="space-y-10 pt-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <Layers className="w-6 h-6 text-primary" />
                     <h2 className="text-heading-card font-bold italic uppercase tracking-wider">Visual Gallery</h2>
                  </div>
                  {project.images.length > 1 && (
                    <div className="flex gap-2">
                       <button 
                         onClick={prevImage}
                         className="p-3 rounded-xl bg-card border border-border hover:bg-primary hover:text-white transition-all shadow-sm"
                       >
                          <ChevronLeft className="w-5 h-5" />
                       </button>
                       <button 
                         onClick={nextImage}
                         className="p-3 rounded-xl bg-card border border-border hover:bg-primary hover:text-white transition-all shadow-sm"
                       >
                          <ChevronRight className="w-5 h-5" />
                       </button>
                    </div>
                  )}
               </div>

              <div 
                className="relative aspect-video rounded-[3rem] overflow-hidden border border-border bg-muted/20 shadow-2xl group/slider cursor-zoom-in"
                onClick={() => setIsZoomed(true)}
              >
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentImage}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={project.images[currentImage]} 
                      alt={`Slide ${currentImage + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
                
                {/* Click to Zoom Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/slider:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                   <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.3em]">
                      View Full Details
                   </div>
                </div>

                {/* Counter Badge */}
                <div className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] font-bold">
                   {currentImage + 1} / {project.images.length}
                </div>
              </div>

              {/* Thumbnails list */}
              {project.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {project.images.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => setCurrentImage(i)}
                      className={`relative shrink-0 w-32 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                        i === currentImage ? "border-primary scale-105 shadow-md" : "border-transparent opacity-40 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt={`Thumb ${i}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mission/Objective */}
          {project.purpose && (
            <div className="space-y-6 p-10 rounded-[3rem] bg-primary/5 border border-primary/10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Briefcase className="w-32 h-32 text-primary" />
              </div>
              <h3 className="text-heading-card font-bold flex items-center gap-3 italic">
                <Briefcase className="w-6 h-6 text-primary" /> Project Objective
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed relative z-10 italic">
                {project.purpose}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
             {/* Key Features */}
             {safeFeatures.length > 0 && (
               <div className="space-y-8 p-10 rounded-[3rem] bg-card border border-border shadow-sm">
                 <h3 className="text-heading-card font-bold flex items-center gap-3 italic">
                   <CheckCircle2 className="w-6 h-6 text-green-500" /> Key Features
                 </h3>
                 <div className="space-y-4">
                   {safeFeatures.map((feature, i) => (
                     <div key={i} className="flex items-center gap-4 transition-all hover:translate-x-2">
                       <div className="h-2 w-2 rounded-full bg-primary shrink-0 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                       <span className="text-sm font-bold text-zinc-400">{feature}</span>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {/* Lessons Learned */}
             {safeLearned.length > 0 && (
               <div className="space-y-8 p-10 rounded-[3rem] bg-yellow-500/5 border border-yellow-500/10 shadow-sm">
                 <h3 className="text-heading-card font-bold flex items-center gap-3 italic">
                   <Lightbulb className="w-6 h-6 text-yellow-500" /> Key Learnings
                 </h3>
                 <div className="space-y-4">
                   {safeLearned.map((item, i) => (
                     <div key={i} className="flex items-start gap-3">
                       <span className="text-yellow-500 font-black mt-0.5">•</span>
                       <p className="text-sm text-zinc-400 font-bold leading-relaxed italic">
                         {item}
                       </p>
                     </div>
                   ))}
                 </div>
               </div>
             )}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-col gap-4">
            {project.live_url && (
              <Button asChild size="lg" className="rounded-[2rem] h-16 font-bold gap-3 shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
                <a href={project.live_url} target="_blank">Launch Project <ExternalLink className="w-5 h-5" /></a>
              </Button>
            )}
            {project.github_url && (
              <Button asChild variant="outline" size="lg" className="rounded-[2rem] h-16 font-bold border-2 gap-3 hover:-translate-y-1 transition-all">
                <a href={project.github_url} target="_blank">Browse Source <FaGithub className="w-5 h-5" /></a>
              </Button>
            )}
          </div>

          <div className="p-8 rounded-[3rem] border border-border bg-card/30 backdrop-blur-xl relative overflow-hidden">
             {/* Decorative element */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
             
             <div className="space-y-10 relative z-10">
               <div className="flex gap-5">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                   <User className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                   <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Ownership</p>
                   <p className="font-bold text-base tracking-tight italic">{project.my_role || "Designer & Developer"}</p>
                 </div>
               </div>

               <div className="space-y-5">
                 <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest px-1">Technical Stack</p>
                 <div className="flex flex-wrap gap-2">
                   {project.tags.map(tag => (
                     <span key={tag} className="text-[10px] px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-bold border border-border/50 hover:border-primary/50 transition-colors">
                       {tag}
                     </span>
                   ))}
                 </div>
               </div>
             </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
