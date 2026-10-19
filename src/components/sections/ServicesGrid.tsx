import { Service } from "@/types/portfolio"
import { Box, Code2, Layout, Database, Smartphone, Palette, Zap, Cpu, ArrowUpRight } from "lucide-react"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"
import { SectionHeader } from "@/components/ui/SectionHeader"

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2, Layout, Database, Smartphone, Palette, Box, Zap, Cpu,
}

interface Props {
  services: Service[]
  copy?: SiteCopy
}

export const ServicesGrid = ({ services, copy }: Props) => {
  if (!services || services.length === 0) return null

  return (
    <section id="services" className="mx-auto max-w-6xl scroll-mt-28 px-6 md:px-10">
      <SectionHeader
        eyebrow={t(copy, "services.eyebrow", "What I do")}
        title={renderRichTitle(t(copy, "services.title", "Services built for *shipping*"), "text-accent")}
        subtitle={t(copy, "services.subtitle", "Focused engagements for teams that want robust, scalable web products.")}
      />

      <div className="grid gap-5 md:grid-cols-2">
        {services.map((service) => {
          const Icon = IconMap[service.icon_name || "Box"] || Box
          return (
            <article
              key={service.id}
              className="spotlight lift-card group relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-border bg-card p-7 md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">{service.title.trim()}</h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground text-pretty">{service.description}</p>
              </div>

              {service.features && service.features.length > 0 && (
                <ul className="mt-auto flex flex-wrap gap-2">
                  {service.features.map((feature, j) => (
                    <li key={j} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          )
        })}
      </div>

      <div className="mt-12 flex justify-center">
        <a
          href="#contact"
          className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-6 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          {t(copy, "services.cta", "Discuss a project")}
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  )
}
