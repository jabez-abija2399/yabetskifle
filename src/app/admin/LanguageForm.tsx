"use client"

import { Language } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface Props {
  initialData?: Language
  onSave: (data: Omit<Language, "id">) => Promise<void>
  isSaving: boolean
  onCancel: () => void
}

export const LanguageForm = ({ initialData, onSave, isSaving, onCancel }: Props) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await onSave({
      name: formData.get("name") as string,
      proficiency: formData.get("proficiency") as string,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-zinc-400">Language Name</label>
          <Input name="name" defaultValue={initialData?.name} required placeholder="English, Amharic, French..." />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-zinc-400">Proficiency</label>
          <Input name="proficiency" defaultValue={initialData?.proficiency} required placeholder="Native, Fluent, Professional..." />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSaving} className="rounded-xl px-10 h-12 font-black shadow-xl shadow-primary/20">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Language" : "Add Language"}
        </Button>
      </div>
    </form>
  )
}
