import { Experience } from "@/types/portfolio"
import { MapPin } from "lucide-react"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"

interface Props {
  experiences: Experience[]
  copy?: SiteCopy
}

export const ExperienceTimeline = ({ experiences, copy }: Props) => {
  if (!experiences || experiences.length === 0) return null

  return (
    <section id="experience" className="px-6 md:px-12 lg:px-16 xl:px-24 scroll-mt-24">
      <div className="max-w-[1600px] mx-auto">
        {/* Section header — Sentence case */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-border">
          <div className="space-y-2">
            <div className="font-mono text-xs text-accent">
              {t(copy, "experience.eyebrow", "04. Engineering experience")}
            </div>
            <h2 className="text-heading-section font-semibold tracking-tight text-foreground">
              {renderRichTitle(t(copy, "experience.title", "Roles, teams & production contributions"), "text-accent")}
            </h2>
          </div>
          <p className="font-mono text-xs text-muted-foreground max-w-sm">
            {t(copy, "experience.subtitle", "Chronological record of shipped software and engineering responsibilities.")}
          </p>
        </div>

        {/* Structured Schematic Log */}
        <div className="border-t border-border divide-y divide-border">
          {experiences.map((exp, i) => (
            <div
              key={exp.id}
              className="group grid grid-cols-12 gap-6 md:gap-8 py-8 hover:bg-card/60 transition-colors"
            >
              {/* Index & Timestamp */}
              <div className="col-span-12 md:col-span-3 space-y-2 font-mono text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-accent font-medium">
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                  <span>{exp.duration}</span>
                </div>
                {exp.is_current && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-signal/30 bg-card rounded-xs text-[11px] text-signal">
                    <span className="w-1.5 h-1.5 rounded-full bg-signal" />
                    <span>{t(copy, "experience.current", "Active role")}</span>
                  </div>
                )}
              </div>

              {/* Role + Company + Location */}
              <div className="col-span-12 md:col-span-4 space-y-1">
                <h3 className="text-lg md:text-xl font-semibold text-foreground tracking-tight group-hover:text-accent transition-colors">
                  {exp.role}
                </h3>
                <p className="font-mono text-xs text-accent font-medium">
                  {exp.company}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground pt-1 font-mono">
                  <MapPin className="w-3 h-3" /> {exp.location}
                </p>
              </div>

              {/* Responsibilities & Achievements */}
              <div className="col-span-12 md:col-span-5 space-y-2 font-sans text-xs sm:text-sm text-muted-foreground">
                {exp.description?.map((duty, j) => (
                  <div key={j} className="flex items-start gap-2.5">
                    <span className="text-accent font-mono text-xs mt-0.5 select-none">
                      →
                    </span>
                    <p className="leading-relaxed text-pretty text-foreground/80">
                      {duty}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
