"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface Props {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export const AdminPageHeader = ({ title, description, actionLabel, onAction }: Props) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-8 border-b border-border">
      <div className="space-y-1">
        <h2 className="text-3xl font-black tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      
      {actionLabel && (
        <Button onClick={onAction} className="rounded-xl px-6 h-12 font-bold shadow-xl shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
