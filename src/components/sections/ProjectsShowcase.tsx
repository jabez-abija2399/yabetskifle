import { Project } from "@/types/portfolio"
import { ProjectCard } from "./ProjectCard"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { SiteCopy, t } from "@/lib/copy"

interface Props {
  projects: Project[]
  copy?: SiteCopy
}

export const ProjectsShowcase = ({ projects, copy }: Props) => {
  const featured = projects[0]
  const rest = projects.slice(1)

  return (
    <section id="work" className="px-6 md:px-12 lg:px-16 xl:px-24 scroll-mt-24">
      <div className="max-w-[1600px] mx-auto">
        {/* Section header — Sentence case, technical indexing */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-border">
          <div className="space-y-2">
            <div className="font-mono text-xs text-[#2D5F6B] dark:text-[#3E7987]">
              {t(copy, "projects.eyebrow", "01. Selected projects")}
            </div>
            <h2 className="text-heading-section font-semibold tracking-tight text-foreground">
              {t(copy, "projects.title", "Recent production systems & case studies")}
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-[#2D5F6B] transition-colors"
          >
            <span>[ {t(copy, "projects.archive_link", "Complete project index")} ]</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-border rounded-xs font-mono text-xs text-muted-foreground">
            {t(copy, "projects.empty", "[no projects logged in database — configure in admin]")}
          </div>
        ) : (
          <div className="space-y-8 md:space-y-10">
            {/* Featured */}
            {featured && (
              <ProjectCard project={featured} index={0} variant="wide" />
            )}

            {/* Rest */}
            {rest.length > 0 && (
              <div className="grid md:grid-cols-2 gap-8">
                {rest.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i + 1} />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center mt-12">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 border border-border bg-card px-5 h-11 rounded-xs font-mono text-xs text-foreground hover:border-[#2D5F6B] hover:text-[#2D5F6B] transition-colors"
          >
            <span>
              [ {t(copy, "projects.see_all_format", "View all {count} cataloged projects").replace("{count}", String(projects.length))} ]
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
