import { ReactNode } from "react"

interface Props {
  eyebrow: string
  title: ReactNode
  subtitle?: string
  align?: "split" | "stack"
}

// One header for every section: a pill eyebrow, a large title, and a short
// supporting line. Split puts the subtitle beside the title on wide screens.
export const SectionHeader = ({ eyebrow, title, subtitle, align = "split" }: Props) => (
  <div
    className={
      align === "split"
        ? "mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end"
        : "mb-12 flex flex-col gap-6 md:mb-16"
    }
  >
    <div className="max-w-3xl space-y-5">
      <span className="eyebrow-chip">{eyebrow}</span>
      <h2 className="text-heading-section font-semibold text-foreground text-balance">{title}</h2>
    </div>
    {subtitle && <p className="max-w-sm text-base leading-relaxed text-muted-foreground text-pretty">{subtitle}</p>}
  </div>
)
