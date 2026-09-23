import { cn } from "@/lib/utils"

type Variant = "live" | "hidden" | "draft"

const VARIANTS: Record<Variant, { label: string; className: string }> = {
  live: { label: "Live", className: "border-accent/40 text-accent" },
  hidden: { label: "Hidden", className: "border-signal/40 text-signal" },
  draft: { label: "Draft", className: "border-border text-muted-foreground" },
}

export function StatusBadge({
  variant = "live",
  label,
  className,
}: {
  variant?: Variant
  label?: string
  className?: string
}) {
  const v = VARIANTS[variant]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xs border px-1.5 py-0.5 label-mono leading-none",
        v.className,
        className
      )}
    >
      <span className="size-1 rounded-full bg-current" aria-hidden />
      {label ?? v.label}
    </span>
  )
}
