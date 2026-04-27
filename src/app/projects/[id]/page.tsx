import { Metadata } from "next"
import { PortfolioService } from "@/services/portfolio"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Layers, Calendar, Globe, Target, Lightbulb, Zap, CheckCircle2, User, BookOpen, Tag, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FaGithub } from "react-icons/fa"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const project = await PortfolioService.getProjectById(id)
  
  if (!project) return { title: "Project Not Found" }

  return {
    title: project.title,
    description: project.purpose || project.description.slice(0, 160),
    openGraph: {
      title: project.title,
      description: project.purpose || project.description.slice(0, 160),
      images: project.images?.[0] ? [{ url: project.images[0] }] : [],
    },
  }
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await PortfolioService.getProjectById(id)

  if (!project) return notFound()

  return (
    <main className="min-h-screen bg-background text-foreground pb-32 selection:bg-primary/30">
      
      {/* 🧭 UNIFIED NAVIGATION */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-3xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] hover:text-primary transition-all"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <div className="flex items-center gap-4">
            {project.github_url && (
              <a href={project.github_url} target="_blank" className="p-3 hover:text-primary transition-all">
                <FaGithub className="w-5 h-5" />
              </a>
            ) }
            {project.live_url && (
              <Button asChild className="rounded-xl px-8 h-11 bg-primary text-primary-foreground hover:opacity-90 font-black italic gap-2 transition-all">
                <a href={project.live_url} target="_blank">
                  Launch App <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* 🎬 THE "STARK" HERO COVER */}
      <section className="relative w-full aspect-[21/9] md:aspect-[3/1] bg-card overflow-hidden">
        {project.images?.[0] ? (
          <Image src={project.images[0]} alt={project.title} fill priority className="object-cover transition-transform duration-[4s] hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center opacity-10 font-black italic text-5xl">Display Placeholder</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </section>

      {/* 🖋️ THE UNIFIED IDENTITY SECTION */}
      <section className="container mx-auto px-6 -mt-32 relative z-10">
        <div className="max-w-5xl space-y-8">
           <div className="space-y-4">
              <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                 {project.project_type || "Production System"} Case Study
              </span>
              <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none">
                 {project.title}
              </h1>
           </div>
           
           <div className="grid lg:grid-cols-12 gap-12 pt-10">
              
              {/* Left Column: Narrative (8/12) */}
              <div className="lg:col-span-8 space-y-16">
                 
                 <div className="space-y-6">
                    <div className="flex items-center gap-3 text-primary">
                       <Target className="w-6 h-6" />
                       <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">The Problem & Purpose</h3>
                    </div>
                    <p className="text-2xl font-bold italic leading-relaxed text-muted-foreground border-l-4 border-primary pl-10 py-2">
                       {project.purpose}
                    </p>
                 </div>

                 <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <div className="flex items-center gap-3 text-primary mb-6">
                       <Lightbulb className="w-6 h-6" />
                       <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Concept & Architecture</h3>
                    </div>
                    <div className="text-lg leading-relaxed text-zinc-400 whitespace-pre-wrap font-medium">
                       {project.description}
                    </div>
                 </div>

                 {/* Unified Learnings Grid */}
                 {project.what_i_learned && project.what_i_learned.length > 0 && (
                   <div className="space-y-8">
                      <div className="flex items-center gap-3 text-primary">
                         <BookOpen className="w-6 h-6" />
                         <h3 className="text-sm font-black uppercase tracking-[0.2em] italic">Growth & Technical Insights</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                         {project.what_i_learned.map((point, i) => (
                           <div key={i} className="p-8 bg-card border border-border rounded-[2rem] hover:border-primary/30 transition-all group">
                              <span className="text-[10px] font-black text-primary/40 uppercase mb-3 block">Perspective {i+1}</span>
                              <p className="text-sm font-bold text-zinc-300 leading-relaxed group-hover:text-foreground transition-colors">{point}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
              </div>

              {/* Right Column: Uniform Meta Sidebar (4/12) */}
              <div className="lg:col-span-4 space-y-8">
                 <div className="p-10 bg-card/50 backdrop-blur-xl border border-border rounded-[3rem] space-y-12 shadow-2xl">
                    
                    <div className="space-y-3">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Technical Ownership</p>
                       <p className="flex items-center gap-3 text-lg font-black italic">
                          <User className="w-5 h-5 text-primary" /> {project.my_role || "Lead Architect"}
                       </p>
                    </div>

                    <div className="space-y-4">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Core Ecosystem</p>
                       <div className="flex flex-wrap gap-2">
                          {project.tags?.map((tag) => (
                             <span key={tag} className="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/20 rounded-xl text-[10px] font-black uppercase text-primary">
                                <Tag className="w-3 h-3" /> {tag}
                             </span>
                          ))}
                       </div>
                    </div>

                    <div className="pt-10 border-t border-border space-y-6">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Operational Features</p>
                       <ul className="space-y-4">
                          {project.key_features?.map((feat, i) => (
                             <li key={i} className="flex items-start gap-4">
                                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                <span className="text-sm font-bold text-zinc-400 mt-0.5">{feat}</span>
                             </li>
                          ))}
                       </ul>
                    </div>
                 </div>

                 <div className="px-10 py-6 bg-primary/5 border border-primary/10 rounded-3xl flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Status</p>
                    <span className="flex items-center gap-2 text-xs font-black italic">
                       <Zap className="w-4 h-4 text-primary" /> LIVE SYSTEM
                    </span>
                 </div>
              </div>

           </div>
        </div>
      </section>

      {/* 🖼️ UNIFIED VISUAL EXHIBITION */}
      {project.images && project.images.length > 1 && (
        <section className="container mx-auto px-6 mt-32 space-y-12">
           <div className="flex items-center gap-4 border-b border-border pb-8">
              <Layers className="w-8 h-8 text-primary" />
              <h3 className="text-3xl font-black italic tracking-tighter uppercase">Visual Interface</h3>
           </div>
           <div className="grid md:grid-cols-2 gap-8">
              {project.images.slice(1).map((img, i) => (
                <div key={i} className="group relative rounded-[2rem] md:rounded-[4rem] overflow-hidden border border-border shadow-2xl hover:border-primary/50 transition-all bg-card">
                   <div className="aspect-video relative overflow-hidden">
                      <Image src={img} alt="Showcase" fill className="object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                   </div>
                </div>
              ))}
           </div>
        </section>
      )}

    </main>
  )
}
