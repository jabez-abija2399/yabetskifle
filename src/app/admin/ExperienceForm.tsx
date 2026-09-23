"use client"

import { useState } from "react"
import { Experience } from "@/types/portfolio"
import { TextField, SwitchRow, FormFooter } from "@/components/admin/fields"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

interface Props {
  initialData?: Experience
  onSave: (data: Omit<Experience, "id">) => Promise<void>
  isSaving: boolean
  onCancel: () => void
}

export const ExperienceForm = ({ initialData, onSave, isSaving, onCancel }: Props) => {
  const [description, setDescription] = useState<string[]>(initialData?.description || [""])

  const addPoint = () => setDescription([...description, ""])
  const removePoint = (index: number) =>
    setDescription(description.filter((_, i) => i !== index))
  const updatePoint = (index: number, val: string) => {
    const newDesc = [...description]
    newDesc[index] = val
    setDescription(newDesc)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onSave({
      role: formData.get("role") as string,
      company: formData.get("company") as string,
      duration: formData.get("duration") as string,
      location: formData.get("location") as string,
      is_current: formData.get("is_current") === "on",
      description: description.filter((d) => d.trim() !== ""),
      order_index: parseInt(formData.get("order_index") as string) || 0,
      is_published: formData.get("is_published") === "on",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Role"
          name="role"
          defaultValue={initialData?.role}
          placeholder="Senior Frontend Developer"
          required
        />
        <TextField
          label="Company"
          name="company"
          defaultValue={initialData?.company}
          placeholder="Google / Freelance"
          required
        />
        <TextField
          label="Duration"
          name="duration"
          defaultValue={initialData?.duration}
          placeholder="Jan 2022 – Present"
          required
        />
        <TextField
          label="Location"
          name="location"
          defaultValue={initialData?.location}
          placeholder="Remote / Addis Ababa"
        />
      </div>

      <div className="space-y-2">
        <span className="label-mono text-muted-foreground">
          Key achievements
        </span>
        <div className="space-y-2">
          {description.map((point, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={point || ""}
                onChange={(e) => updatePoint(i, e.target.value)}
                placeholder="Built a $1M revenue feature…"
                aria-label={`Achievement ${i + 1}`}
                className="h-9 flex-1 rounded-xs border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove achievement ${i + 1}`}
                onClick={() => removePoint(i)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addPoint} className="w-full border-dashed">
            <Plus className="size-3.5" aria-hidden /> Add achievement
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
        <TextField
          label="Sort order"
          name="order_index"
          type="number"
          defaultValue={initialData?.order_index || 0}
        />
        <SwitchRow
          name="is_current"
          label="Current role"
          description="I currently work here."
          defaultChecked={initialData?.is_current ?? false}
        />
        <SwitchRow
          name="is_published"
          label="Public"
          description="Visible on the site."
          defaultChecked={initialData?.is_published ?? true}
        />
      </div>

      <FormFooter onCancel={onCancel} isSaving={isSaving} submitLabel="Save experience" />
    </form>
  )
}
