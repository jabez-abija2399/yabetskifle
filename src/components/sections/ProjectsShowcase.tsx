import { Project } from "@/types/portfolio"
import { ProjectCard } from "./ProjectCard"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"

interface Props {
  projects: Project[]
  copy?: SiteCopy
}

export const ProjectsShowcase = ({ projects, copy }: Props) => {
  const featured = projects[0]
  const rest = projects.slice(1)

  return (
    <section id="work" className="px-6 md:px-12 lg:px-16 xl:px-24 scroll-mt-32">
      <div className="max-w-[1600px] mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between gap-8 mb-12 md:mb-16 border-b border-border pb-8">
          <div className="space-y-3">
            <p className="eyebrow">{t(copy, "projects.eyebrow", "— 04 / Selected Work")}</p>
            <h2 className="text-heading-section">
              {renderRichTitle(t(copy, "projects.title", "Recent *case studies*"))}
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium hover:text-signal transition-colors"
          >
            {t(copy, "projects.archive_link", "View archive")} <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-border rounded-3xl">
            <p className="text-muted-foreground">{t(copy, "projects.empty", "No projects yet — add some via the admin dashboard.")}</p>
          </div>
        ) : (
          <div className="space-y-12 md:space-y-16">
            {/* Featured */}
            {featured && (
              <ProjectCard project={featured} index={0} variant="wide" />
            )}

            {/* Two-column rest */}
            {rest.length > 0 && (
              <div className="grid md:grid-cols-2 gap-10 md:gap-12 pt-4">
                {rest.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i + 1} />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center mt-16">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 border border-border px-6 h-12 rounded-full font-medium text-sm hover:border-foreground transition-colors"
          >
            {t(copy, "projects.see_all_format", "See all {count} projects").replace("{count}", String(projects.length))}
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
