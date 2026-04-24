"use client"

import { useState } from "react"
import { Experience } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DynamicListInput } from "./DynamicListInput"
import { Loader2 } from "lucide-react"

interface Props {
  initialData?: Experience
  onSave: (data: Omit<Experience, "id">) => Promise<void>
  isSaving: boolean
  onCancel: () => void
}

export const ExperienceForm = ({ initialData, onSave, isSaving, onCancel }: Props) => {
  const [description, setDescription] = useState<string[]>(initialData?.description || [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    await onSave({
      company: formData.get("company") as string,
      role: formData.get("role") as string,
      location: formData.get("location") as string,
      duration: formData.get("duration") as string,
      description: description,
      is_current: formData.get("is_current") === "on",
      order_index: Number(formData.get("order_index")),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-semibold">Company Name</label>
          <Input name="company" defaultValue={initialData?.company} required placeholder="Google, Freelance, etc." />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold">My Role</label>
          <Input name="role" defaultValue={initialData?.role} required placeholder="Senior Frontend Engineer" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-semibold">Duration</label>
          <Input name="duration" defaultValue={initialData?.duration} required placeholder="Jan 2022 - Present" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold">Location</label>
          <Input name="location" defaultValue={initialData?.location} placeholder="Remote, New York, etc." />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-muted/30">
          <input type="checkbox" name="is_current" id="is_current" defaultChecked={initialData?.is_current} className="w-4 h-4 accent-primary" />
          <label htmlFor="is_current" className="text-sm font-semibold cursor-pointer">Current Job</label>
        </div>
        <div className="flex-1 space-y-1">
          <Input name="order_index" type="number" defaultValue={initialData?.order_index || 0} placeholder="Priority Order" />
        </div>
      </div>

      <DynamicListInput 
        label="Key Achievements" 
        items={description} 
        onChange={setDescription} 
        placeholder="Led the development of a React dashboard..."
      />

      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSaving} className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Experience" : "Add Experience"}
        </Button>
      </div>
    </form>
  )
}
