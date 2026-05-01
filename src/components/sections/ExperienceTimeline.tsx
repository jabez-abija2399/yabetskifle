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
    <section id="experience" className="px-6 md:px-12 scroll-mt-32">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between gap-8 mb-12 md:mb-16 border-b border-border pb-8">
          <div className="space-y-3">
            <p className="eyebrow">{t(copy, "experience.eyebrow", "— 06 / Experience")}</p>
            <h2 className="text-heading-section">
              {renderRichTitle(t(copy, "experience.title", "Where I've *worked*"))}
            </h2>
          </div>
          <p className="hidden md:block text-sm text-muted-foreground max-w-xs text-pretty">
            {t(copy, "experience.subtitle", "Roles, projects, and teams I've contributed to over the years.")}
          </p>
        </div>

        <div className="space-y-1">
          {experiences.map((exp, i) => (
            <div
              key={exp.id}
              className="group grid grid-cols-12 gap-4 md:gap-8 py-8 border-b border-border hover:bg-card transition-colors -mx-6 md:-mx-12 px-6 md:px-12"
            >
              {/* Number */}
              <div className="col-span-12 md:col-span-1">
                <span className="font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Duration */}
              <div className="col-span-12 md:col-span-3 space-y-1">
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {exp.duration}
                </p>
                {exp.is_current && (
                  <span className="inline-flex items-center gap-1.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
                    {t(copy, "experience.current", "Current")}
                  </span>
                )}
              </div>

              {/* Role + company */}
              <div className="col-span-12 md:col-span-4">
                <h3 className="font-display text-2xl md:text-3xl leading-tight">{exp.role}</h3>
                <p className="text-base text-muted-foreground mt-1">{exp.company}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <MapPin className="w-3 h-3" /> {exp.location}
                </p>
              </div>

              {/* Description */}
              <div className="col-span-12 md:col-span-4 space-y-2">
                {exp.description?.map((duty, j) => (
                  <p
                    key={j}
                    className="text-sm text-muted-foreground leading-relaxed text-pretty"
                  >
                    {duty}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
