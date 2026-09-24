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
  const featured = projects.find((p) => p.featured) ?? projects[0]
  const rest = projects.filter((p) => p.id !== featured?.id)

  return (
    <section id="work" className="px-6 md:px-12 lg:px-16 xl:px-24 scroll-mt-24">
      <div className="max-w-[1600px] mx-auto">
        {/* Section header — Sentence case, technical indexing */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-accent/30">
          <div className="space-y-2">
            <div className="eyebrow-chip">
              {t(copy, "projects.eyebrow", "01. Selected projects")}
            </div>
            <h2 className="text-heading-section font-semibold tracking-tight text-foreground">
              {renderRichTitle(t(copy, "projects.title", "Recent production systems & case studies"), "text-accent")}
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            <span>[ {t(copy, "projects.archive_link", "Complete project index")} ]</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-border rounded-xs font-mono text-xs text-muted-foreground space-y-4">
            <p>{t(copy, "projects.empty", "Case studies are being prepared — check back soon.")}</p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground h-11 px-5 rounded-xs font-mono text-xs font-medium hover:bg-accent-hover transition-colors"
            >
              <span>[ {t(copy, "projects.empty_cta", "Start a conversation")} ]</span>
            </a>
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

        {projects.length > 0 && (
          <div className="flex justify-center mt-12">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 border border-border bg-card px-5 h-11 rounded-xs font-mono text-xs text-foreground hover:border-accent hover:text-accent transition-colors"
            >
              <span>
                [ {t(copy, "projects.see_all_format", "View all {count} cataloged projects").replace("{count}", String(projects.length))} ]
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
