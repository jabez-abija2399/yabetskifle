"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface Props {
  /** "compact" = small pill (~80px) for navbar; "full" = wider for admin */
  size?: "compact" | "full"
}

const OPTIONS = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "system", icon: Monitor, label: "System" },
  { value: "dark", icon: Moon, label: "Dark" },
] as const

export function ThemeToggle({ size = "compact" }: Props) {
  const { theme, setTheme } = useTheme()
  // Hydration-safe mounted detection without setState-in-effect
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  // Avoid SSR/CSR hydration mismatch — placeholder until mounted
  if (!mounted) {
    return (
      <div
        aria-hidden
        className={cn(
          "inline-flex items-center rounded-sm border border-border bg-card",
          size === "compact" ? "h-9 w-[88px]" : "h-10 w-full"
        )}
      />
    )
  }

  const current = theme || "system"
  const isCompact = size === "compact"

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cn(
        "relative inline-flex items-center rounded-sm border border-border bg-card p-0.5",
        isCompact ? "h-9" : "h-10 w-full"
      )}
    >
      {OPTIONS.map((opt) => {
        const Icon = opt.icon
        const active = current === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={opt.label}
            onClick={() => setTheme(opt.value)}
            title={opt.label}
            className={cn(
              "relative inline-flex items-center justify-center rounded-xs transition-colors duration-200",
              isCompact ? "w-7 h-7" : "flex-1 h-9 gap-2",
              active
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn(isCompact ? "w-3.5 h-3.5" : "w-4 h-4")} />
            {!isCompact && <span className="text-xs font-medium">{opt.label}</span>}
          </button>
        )
      })}
    </div>
  )
}
