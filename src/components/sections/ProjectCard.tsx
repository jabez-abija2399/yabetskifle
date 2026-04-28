import { Project } from "@/types/portfolio"
import { ArrowUpRight, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProjectCardProps {
  project: Project
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link 
      href={`/projects/${project.id}`} 
      className="group relative flex flex-col rounded-[2.5rem] border border-border/50 bg-card/30 backdrop-blur-xl p-4 gap-6 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(var(--primary),0.1)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
    >
      {/* 🖼️ IMAGE AREA: Large, immersive with hover effects */}
      {project.images && project.images.length > 0 ? (
        <div className="relative overflow-hidden rounded-[2rem] aspect-[16/10] bg-muted shadow-inner">
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out grayscale-[20%] group-hover:grayscale-0"
          />
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Type Badge */}
          <div className="absolute top-4 left-4 z-10">
             <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-foreground shadow-sm">
                <Sparkles className="w-3 h-3 text-primary" />
                {project.project_type || "Production"}
             </span>
          </div>

          {/* "View Project" prompt on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-primary/10 backdrop-blur-[2px]">
             <div className="bg-white text-black px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2 -translate-y-4 group-hover:translate-y-0 transition-transform">
                Open Case Study <ArrowUpRight className="w-4 h-4" />
             </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-[2rem] aspect-[16/10] bg-muted/30 flex items-center justify-center italic text-muted-foreground text-xs uppercase tracking-widest">
           No Preview Available
        </div>
      )}


      {/* 🖋️ CONTENT AREA */}
      <div className="flex-1 space-y-4 px-2 pb-2">
        <div className="space-y-2">
           <h3 className="text-heading-card font-bold italic tracking-tight group-hover:text-primary transition-colors truncate">
             {project.title}
           </h3>
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
          {project.tags.length > 3 && (
            <span className="text-[10px] font-medium text-muted-foreground/50 px-1 py-1">
               +{project.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
