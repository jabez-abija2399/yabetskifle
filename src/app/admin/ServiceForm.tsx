"use client"

import { useState } from "react"
import { Service } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DynamicListInput } from "@/components/admin/DynamicListInput"
import { Loader2, Box } from "lucide-react"

interface Props {
  initialData?: Service
  onSave: (data: Omit<Service, "id">) => Promise<void>
  isSaving: boolean
  onCancel: () => void
}

export const ServiceForm = ({ initialData, onSave, isSaving, onCancel }: Props) => {
  const [features, setFeatures] = useState<string[]>(initialData?.features || [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await onSave({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      icon_name: formData.get("icon_name") as string,
      features: features,
      order_index: Number(formData.get("order_index")),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-zinc-400">Service Title</label>
          <Input name="title" defaultValue={initialData?.title} required placeholder="Full-Stack Web Development" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-zinc-400">Icon Name (Lucide)</label>
          <Input name="icon_name" defaultValue={initialData?.icon_name} placeholder="Code, Layout, Database..." />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-zinc-400">Short Description</label>
        <textarea name="description" defaultValue={initialData?.description} required 
          className="w-full min-h-20 p-3 rounded-xl border border-border bg-background text-sm" />
      </div>

      <DynamicListInput label="Core Features" items={features} onChange={setFeatures} placeholder="SEO Optimization, API Integration..." />

      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSaving} className="rounded-xl px-10 h-12 font-black shadow-xl shadow-primary/20">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Service" : "Create Service"}
        </Button>
      </div>
    </form>
  )
}
