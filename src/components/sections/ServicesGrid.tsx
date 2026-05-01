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
    <section id="services" className="px-6 md:px-12 scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between gap-8 mb-12 md:mb-16 border-b border-border pb-8">
          <div className="space-y-3">
            <p className="eyebrow">{t(copy, "services.eyebrow", "— 03 / Services")}</p>
            <h2 className="text-heading-section">
              {renderRichTitle(t(copy, "services.title", "How I can *help*"))}
            </h2>
          </div>
          <p className="hidden md:block text-sm text-muted-foreground max-w-xs text-pretty">
            {t(copy, "services.subtitle", "Selected service offerings for teams looking to ship beautiful, performant web products.")}
          </p>
        </div>

        {/* Editorial list — numbered rows */}
        <div className="divide-y divide-border border-y border-border">
          {services.map((service, i) => {
            const Icon = IconMap[service.icon_name || "Box"] || Box
            return (
              <div
                key={service.id}
                className="group grid grid-cols-12 gap-6 md:gap-10 py-8 md:py-12 hover:bg-card transition-colors -mx-6 md:-mx-12 px-6 md:px-12"
              >
                <div className="col-span-12 md:col-span-1 flex md:flex-col items-center md:items-start gap-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="col-span-12 md:col-span-4 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl border border-border bg-secondary flex items-center justify-center shrink-0 group-hover:bg-signal group-hover:text-signal-foreground group-hover:border-transparent transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl leading-tight">
                    {service.title.trim()}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-4 text-sm text-muted-foreground leading-relaxed text-pretty">
                  {service.description}
                </div>
                <div className="col-span-12 md:col-span-3">
                  <ul className="space-y-2">
                    {service.features?.map((feature, j) => (
                      <li
                        key={j}
                        className="text-xs font-medium text-foreground/80 flex items-start gap-2"
                      >
                        <span className="text-signal mt-[2px]">→</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
