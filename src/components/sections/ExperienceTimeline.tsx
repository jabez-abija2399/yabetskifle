import { Experience } from "@/types/portfolio"
import { MapPin } from "lucide-react"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"
import { SectionHeader } from "@/components/ui/SectionHeader"

interface Props {
  experiences: Experience[]
  copy?: SiteCopy
}

export const ExperienceTimeline = ({ experiences, copy }: Props) => {
  if (!experiences || experiences.length === 0) return null

  return (
    <section id="experience" className="mx-auto max-w-6xl scroll-mt-28 px-6 md:px-10">
      <SectionHeader
        eyebrow={t(copy, "experience.eyebrow", "Experience")}
        title={renderRichTitle(t(copy, "experience.title", "Roles, teams & production *contributions*"), "text-accent")}
        subtitle={t(copy, "experience.subtitle", "A record of shipped software and the teams I shipped it with.")}
      />

      {/* Vertical timeline — a single rail with a node per role */}
      <ol className="relative ml-2 space-y-6 border-l border-border md:ml-4">
        {experiences.map((exp) => (
          <li key={exp.id} className="group relative pl-8 md:pl-12">
            <span
              aria-hidden
              className={`absolute -left-[7px] top-7 h-3.5 w-3.5 rounded-full border-2 border-background ${
                exp.is_current ? "bg-accent shadow-[0_0_0_4px_var(--glow)]" : "bg-muted-foreground/40"
              }`}
            />
            <article className="lift-card rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">{exp.role}</h3>
                    {exp.is_current && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {t(copy, "experience.current", "Current")}
                      </span>
                    )}
                  </div>
                  <p className="text-base font-medium text-foreground/80">{exp.company}</p>
                </div>
                <div className="flex shrink-0 flex-col gap-1 text-sm text-muted-foreground md:items-end">
                  <span className="font-mono text-xs">{exp.duration}</span>
                  {exp.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {exp.location}
                    </span>
                  )}
                </div>
              </div>

              {exp.description && exp.description.length > 0 && (
                <ul className="mt-6 space-y-3 border-t border-border pt-6">
                  {exp.description.map((duty, j) => (
                    <li key={j} className="flex items-start gap-3 text-[15px] leading-relaxed text-muted-foreground text-pretty">
                      <span className="mt-2 h-1 w-3 shrink-0 rounded-full bg-accent" />
                      <span>{duty}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}
