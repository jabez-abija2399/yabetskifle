"use client"

import { Education } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface Props {
  initialData?: Education
  onSave: (data: Omit<Education, "id">) => Promise<void>
  isSaving: boolean
  onCancel: () => void
}

export const EducationForm = ({ initialData, onSave, isSaving, onCancel }: Props) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await onSave({
      institution: formData.get("institution") as string,
      degree: formData.get("degree") as string,
      field_of_study: formData.get("field_of_study") as string,
      duration: formData.get("duration") as string,
      grade: formData.get("grade") as string,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-zinc-400">Institution</label>
          <Input name="institution" defaultValue={initialData?.institution} required placeholder="MIT, Stanford, etc." />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-zinc-400">Degree</label>
          <Input name="degree" defaultValue={initialData?.degree} required placeholder="Bachelor of Science" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-zinc-400">Field of Study</label>
          <Input name="field_of_study" defaultValue={initialData?.field_of_study} placeholder="Computer Science" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-zinc-400">Duration</label>
          <Input name="duration" defaultValue={initialData?.duration} placeholder="2018 - 2022" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-zinc-400">Grade (Optional)</label>
          <Input name="grade" defaultValue={initialData?.grade} placeholder="GPA: 3.9" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSaving} className="rounded-xl px-10 h-12 font-black shadow-xl shadow-primary/20">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Education" : "Add Education"}
        </Button>
      </div>
    </form>
  )
}
