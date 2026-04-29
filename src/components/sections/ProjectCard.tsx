"use client"

import { Project } from "@/types/portfolio"
import { ArrowUpRight, Sparkles } from "lucide-react"
import { FaGithub } from "react-icons/fa"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ProjectCardProps {
  project: Project
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const router = useRouter()

  // 🖱️ Navigate to detail page (Master Click)
  const handleNavigate = () => {
    router.push(`/projects/${project.id}`)
  }

  return (
    <div 
      onClick={handleNavigate}
      className="group relative flex flex-col rounded-[2.5rem] border border-border/50 bg-card/30 backdrop-blur-xl p-4 gap-6 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(var(--primary),0.1)] transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer"
    >
      {/* 🖼️ IMAGE AREA */}
      <div className="relative overflow-hidden rounded-[2rem] aspect-16/10 bg-muted shadow-inner">
        {project.images && project.images.length > 0 ? (
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out grayscale-20 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex items-center justify-center h-full italic text-muted-foreground text-xs uppercase tracking-widest">
            No Preview Available
          </div>
        )}
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Type Badge */}
        <div className="absolute top-4 left-4 z-10">
           <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-foreground shadow-sm">
              <Sparkles className="w-3 h-3 text-primary" />
              {project.project_type || "Production"}
           </span>
        </div>

        {/* 🚀 QUICK ACTION LINKS (Detached from main link) */}
        <div className="absolute top-4 right-4 z-30 flex gap-2">
           {project.github_url && (
             <a 
               href={project.github_url} 
               target="_blank" 
               rel="noreferrer"
               className="w-10 h-10 rounded-xl bg-background/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all shadow-xl"
               onClick={(e) => e.stopPropagation()} // 🛑 Stops navigation to detail page
             >
               <FaGithub className="w-4 h-4" />
             </a>
           )}
           {project.live_url && (
             <a 
               href={project.live_url} 
               target="_blank" 
               rel="noreferrer"
               className="w-10 h-10 rounded-xl bg-background/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all shadow-xl"
               onClick={(e) => e.stopPropagation()} // 🛑 Stops navigation to detail page
             >
               <ArrowUpRight className="w-4 h-4" />
             </a>
           )}
        </div>

        {/* "View Project" prompt on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-primary/10 backdrop-blur-[2px]">
           <div className="bg-white text-black px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2 -translate-y-4 group-hover:translate-y-0 transition-transform">
              Open Case Study <ArrowUpRight className="w-4 h-4" />
           </div>
        </div>
      </div>

      {/* 🖋️ CONTENT AREA */}
      <div className="flex-1 space-y-4 px-2 pb-2">
        <div className="space-y-2">
           <Link 
             href={`/projects/${project.id}`} 
             onClick={(e) => e.stopPropagation()} // Ensure clean navigation
             className="inline-block"
           >
             <h3 className="text-heading-card font-bold italic tracking-tight group-hover:text-primary transition-colors truncate">
               {project.title}
             </h3>
           </Link>
           <p className="text-muted-foreground text-sm font-medium leading-relaxed italic line-clamp-2">
             {project.description}
           </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-bold px-3 py-1 rounded-lg bg-secondary/50 text-secondary-foreground border border-border/50 group-hover:border-primary/20 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
