import { Project } from "@/types/portfolio"
import { ProjectCard } from "./ProjectCard"

interface Props {
  projects: Project[]
}

export const ProjectsShowcase = ({ projects }: Props) => {
  return (
    <section id="work" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-12">
        <div className="space-y-4">
           <p className="text-primary font-black uppercase tracking-[0.3em] text-xs">
              Selected Projects
           </p>
           <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none italic">
              Case Studies
           </h2>
        </div>
        
        <div className="max-w-xs">
           <p className="text-muted-foreground text-sm leading-relaxed">
              Explorations in full-stack architecture, interactive design, and performance optimization across multiple platforms.
           </p>
        </div>
      </div>

      {/* Responsive Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-[3rem] bg-muted/20">
             <p className="text-muted-foreground font-medium italic">No projects found. Use your dashboard to add some work!</p>
          </div>
        )}
      </div>

      {/* Bottom Call to Action */}
      <div className="flex justify-center pt-8">
         <div className="px-6 py-3 rounded-full bg-muted border border-border text-xs font-bold text-zinc-500 flex items-center gap-2">
            Currently displaying <span className="text-foreground">{projects.length}</span> curated works
         </div>
      </div>
    </section>
  )
}
