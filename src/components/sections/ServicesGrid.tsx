import { Service } from "@/types/portfolio"
import { Box, Code2, Layout, Database, Smartphone, Palette, Zap, Cpu } from "lucide-react"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"

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
    <section id="services" className="px-6 md:px-12 lg:px-16 xl:px-24 scroll-mt-24">
      <div className="max-w-[1600px] mx-auto">
        {/* Section header — Sentence case */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-accent/30">
          <div className="space-y-2">
            <div className="eyebrow-chip">
              {t(copy, "services.eyebrow", "05. Capabilities & domains")}
            </div>
            <h2 className="text-heading-section font-semibold tracking-tight text-foreground">
              {renderRichTitle(t(copy, "services.title", "Technical services & scope of work"), "text-accent")}
            </h2>
          </div>
          <p className="font-mono text-xs text-muted-foreground max-w-sm">
            {t(copy, "services.subtitle", "Selected service engagements for teams looking to build robust, scalable web products.")}
          </p>
        </div>

        {/* Structured Schematic Capabilities List */}
        <div className="divide-y divide-border border-y border-border">
          {services.map((service, i) => {
            const Icon = IconMap[service.icon_name || "Box"] || Box
            return (
              <div
                key={service.id}
                className="group grid grid-cols-12 gap-6 md:gap-10 py-8 hover:bg-accent/5 transition-colors"
              >
                <div className="col-span-12 md:col-span-1 flex items-center md:items-start">
                  <span className="font-mono text-xs text-accent font-medium">
                    [srv.{String(i + 1).padStart(2, "0")}]
                  </span>
                </div>

                <div className="col-span-12 md:col-span-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xs border border-border bg-card flex items-center justify-center shrink-0 group-hover:border-accent group-hover:text-accent transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground tracking-tight group-hover:text-accent transition-colors">
                      {service.title.trim()}
                    </h3>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-4 text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty font-sans">
                  {service.description}
                </div>

                <div className="col-span-12 md:col-span-3">
                  <ul className="space-y-1.5 font-mono text-xs text-muted-foreground">
                    {service.features?.map((feature, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2"
                      >
                        <span className="text-accent select-none">→</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-10 flex justify-end">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 border border-border bg-card px-5 h-11 rounded-xs font-mono text-xs text-foreground hover:border-accent hover:text-accent transition-colors"
          >
            <span>[ {t(copy, "services.cta", "Discuss a project")} ]</span>
          </a>
        </div>
      </div>
    </section>
  )
}
