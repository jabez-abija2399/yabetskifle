import { Project } from "@/types/portfolio"
import { ProjectCard } from "./ProjectCard"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"
import { SectionHeader } from "@/components/ui/SectionHeader"

interface Props {
  projects: Project[]
  copy?: SiteCopy
}

export const ProjectsShowcase = ({ projects, copy }: Props) => {
  const featured = projects.find((p) => p.featured) ?? projects[0]
  const rest = projects.filter((p) => p.id !== featured?.id)

  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-28 px-6 md:px-10">
      <SectionHeader
        eyebrow={t(copy, "projects.eyebrow", "Selected work")}
        title={renderRichTitle(t(copy, "projects.title", "Products I've *shipped*"), "text-accent")}
        subtitle={t(copy, "projects.subtitle", "Case studies on real systems: the problem, the approach, and what I learned.")}
      />

      {projects.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border py-20 text-center">
          <p className="text-muted-foreground">{t(copy, "projects.empty", "Case studies are being prepared — check back soon.")}</p>
          <a
            href="#contact"
            className="mt-6 inline-flex h-12 items-center rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            {t(copy, "projects.empty_cta", "Start a conversation")}
          </a>
        </div>
      ) : (
        /* Bento: the featured case study takes a 2×2 tile, the rest fill the grid */
        <div className="grid auto-rows-fr gap-5 md:grid-cols-3 md:gap-6">
          {featured && (
            <div className="md:col-span-2 md:row-span-2">
              <ProjectCard project={featured} index={0} variant="featured" />
            </div>
          )}
          {rest.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i + 1} />
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div className="mt-12 flex justify-center">
          <Link
            href="/projects"
            className="group inline-flex h-12 items-center gap-2 rounded-full border border-border px-6 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            {t(copy, "projects.see_all_format", "View all {count} projects").replace("{count}", String(projects.length))}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      )}
    </section>
  )
}
