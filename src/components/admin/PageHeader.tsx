"use client"

import type { ReactNode } from "react"

interface Props {
  index?: string
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ index, title, description, actions }: Props) {
  return (
    <div className="mb-8 pb-6 border-b border-border">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <p className="font-mono text-[11px] text-muted-foreground">
            {index ? `${index} — ` : ""}admin
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="max-w-xl text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
    </div>
  )
}
