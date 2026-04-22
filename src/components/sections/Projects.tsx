// Pure display component - receives an array of projects
import { Project } from "@/types/portfolio"
import { ProjectCard } from "./ProjectCard"
import { Button } from "../ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface ProjectsProps {
  projects: Project[]
  isLoading: boolean
}

export const Projects = ({ projects, isLoading }: ProjectsProps) => {
  return (
    <section id="projects" className="py-24 px-6 max-w-6xl mx-auto">

      {/* Section Header */}
      <div className="text-center space-y-4 mb-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          My Work
        </p>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Featured Projects
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          A selection of things I&apos;ve built that I&apos;m proud of.
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Show 3 skeleton placeholders while loading */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-border/50 h-80 animate-pulse bg-muted/50" />
          ))}
        </div>
      )}

      {/* Projects Grid */}
      {!isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && projects.length === 0 && (
        <p className="text-center text-muted-foreground py-20">
          No projects yet. Add some from the Admin panel!
        </p>
      )}
      {/* "See All" Button */}
      {!isLoading && projects.length > 0 && (
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="rounded-full px-8 gap-2">
            <Link href="/projects">
              View All Projects
              <ArrowRight className="w-4 h-4" />
              
            </Link>
          </Button>
        </div>
      )}
    </section>
  )
}
