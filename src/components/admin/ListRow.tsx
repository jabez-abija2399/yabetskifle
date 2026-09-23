import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface Props {
  icon?: ReactNode
  title: ReactNode
  meta?: ReactNode
  badge?: ReactNode
  dimmed?: boolean
  actions?: ReactNode
  className?: string
}

export function ListRow({
  icon,
  title,
  meta,
  badge,
  dimmed,
  actions,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 sm:gap-4 rounded-xs border border-border bg-card px-3 py-3 sm:px-4 transition-colors hover:border-accent/50",
        dimmed && "opacity-60",
        className
      )}
    >
      {icon && (
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-xs bg-secondary text-muted-foreground"
          aria-hidden
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">{title}</p>
          {badge}
        </div>
        {meta && (
          <div className="mt-0.5 truncate text-xs text-muted-foreground">{meta}</div>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-1">{actions}</div>
      )}
    </div>
  )
}
