import { Project } from "@/types/portfolio"
import { ProjectCard } from "./ProjectCard"
import { Button } from "../ui/button"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

interface ProjectsProps {
  projects: Project[]
  isLoading: boolean
}

export const Projects = ({ projects, isLoading }: ProjectsProps) => {
  return (
    <section id="projects" className="py-32 px-6 max-w-7xl mx-auto space-y-20">

      {/* 🧭 Section Header: Human & Strategic */}
      <div className="text-center space-y-6">
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary italic">
          Featured Portfolio
        </p>
        <h2 className="text-heading-section font-bold tracking-tight italic whitespace-nowrap">
          Selected <span className="text-zinc-600">Creations.</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed italic">
          A curated exhibition of technical projects where consultative architecture meets premium user experiences.
        </p>
      </div>

      {/* ⏳ Loading State */}
      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-[2.5rem] border border-border/50 h-96 animate-pulse bg-muted/50 shadow-inner" />
          ))}
        </div>
      )}

      {/* 🎨 Projects Grid */}
      {!isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* 🔎 Empty state */}
      {!isLoading && projects.length === 0 && (
        <div className="text-center py-20 bg-card/30 rounded-[3rem] border border-dashed border-border/50">
           <p className="text-muted-foreground italic font-medium">The collection is currently being curated. Check back soon.</p>
        </div>
      )}

      {/* 🔗 "See All" Call to Action */}
      {!isLoading && projects.length > 0 && (
        <div className="text-center">
          <Button asChild size="lg" variant="link" className="text-primary hover:text-foreground font-black uppercase tracking-widest text-[10px] gap-2 transition-all group">
            <Link href="/projects">
              Open Full Index Archive
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  )
}
