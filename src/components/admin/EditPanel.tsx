"use client"

import type { ReactNode } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  eyebrow?: string
  title: string
  onClose: () => void
  children: ReactNode
}

export function EditPanel({ eyebrow = "Editing", title, onClose, children }: Props) {
  return (
    <div className="rounded-xs border border-border bg-card animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <p className="label-mono text-muted-foreground">
            {eyebrow}
          </p>
          <h2 className="truncate text-sm font-semibold tracking-tight text-foreground sm:text-base">
            {title}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close editor"
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </Button>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  )
}
