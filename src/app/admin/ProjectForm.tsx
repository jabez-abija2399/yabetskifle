"use client"

import { useState } from "react"
import { Project } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { TextField, TextAreaField, SwitchRow, FormFooter, FormSection } from "@/components/admin/fields"
import { Plus, X } from "lucide-react"

interface Props {
  initialData?: Project
  onSave: (data: Omit<Project, "id" | "created_at">) => Promise<void>
  isSaving: boolean
  onCancel: () => void
}

const ensureArray = (val: unknown): string[] => {
  if (!val) return []
  if (Array.isArray(val)) return val as string[]
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val)
      return Array.isArray(parsed) ? (parsed as string[]) : [val]
    } catch {
      return val.startsWith("[") ? [] : [val]
    }
  }
  return []
}

export const ProjectForm = ({ initialData, onSave, isSaving, onCancel }: Props) => {
  const [images, setImages] = useState<string[]>(ensureArray(initialData?.images))
  const [tags, setTags] = useState<string[]>(ensureArray(initialData?.tags))
  const [keyFeatures, setKeyFeatures] = useState<string[]>(
    ensureArray(initialData?.key_features).length > 0 ? ensureArray(initialData?.key_features) : [""]
  )
  const [learnings, setLearnings] = useState<string[]>(
    ensureArray(initialData?.what_i_learned).length > 0 ? ensureArray(initialData?.what_i_learned) : [""]
  )
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    await onSave({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      purpose: formData.get("purpose") as string,
      my_role: formData.get("my_role") as string,
      project_type: formData.get("project_type") as string,
      key_features: keyFeatures.filter((f) => f.trim() !== ""),
      what_i_learned: learnings.filter((l) => l.trim() !== ""),
      live_url: formData.get("live_url") as string,
      github_url: formData.get("github_url") as string,
      featured: formData.get("featured") === "on",
      order_index: parseInt(formData.get("order_index") as string) || 0,
      images,
      tags,
      is_published: formData.get("is_published") === "on",
    })
  }

  const listEditor = (
    values: string[],
    setValues: (v: string[]) => void,
    label: string,
    placeholder: string
  ) => (
    <div className="space-y-2">
      <span className="label-mono text-muted-foreground">
        {label}
      </span>
      <div className="space-y-2">
        {values.map((val, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={val || ""}
              onChange={(e) =>
                setValues(values.map((v, idx) => (idx === i ? e.target.value : v)))
              }
              placeholder={placeholder}
              aria-label={`${label} ${i + 1}`}
              className="h-9 flex-1 rounded-xs border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Remove ${label} ${i + 1}`}
              onClick={() => setValues(values.filter((_, idx) => idx !== i))}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => setValues([...values, ""])}
          className="w-full border-dashed"
        >
          <Plus className="size-3.5" aria-hidden /> Add line
        </Button>
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormSection title="Project visuals">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {images.map((img, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-xs border border-border bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                aria-label={`Remove image ${i + 1}`}
                className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-xs border border-border bg-background/90 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xs border border-dashed border-border text-muted-foreground transition-colors hover:border-accent/60">
            <ImageUploader onUpload={(url) => setImages((prev) => [...prev, url])} />
            <p className="font-mono text-[9px] uppercase tracking-[0.14em]">Add media</p>
          </div>
        </div>
      </FormSection>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <FormSection title="Purpose & case study">
            <TextAreaField
              label="Purpose"
              name="purpose"
              defaultValue={initialData?.purpose}
              rows={4}
              placeholder="Why did you build this? What problem does it solve?"
            />
            <TextAreaField
              label="Case study description"
              name="description"
              defaultValue={initialData?.description}
              rows={8}
              placeholder="The full story of the project…"
            />
          </FormSection>
        </div>

        <div className="space-y-6">
          <FormSection title="Key features">
            {listEditor(keyFeatures, setKeyFeatures, "Key features", "e.g. Dashboard with charts")}
          </FormSection>
          <FormSection title="What I learned">
            {listEditor(learnings, setLearnings, "Learnings", "e.g. Optimized SQL queries")}
          </FormSection>
        </div>
      </div>

      <div className="grid gap-8 border-t border-border pt-8 lg:grid-cols-2">
        <FormSection title="Role & details">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Title / role" name="my_role" defaultValue={initialData?.my_role} placeholder="Full Stack Developer" />
            <TextField label="Project type" name="project_type" defaultValue={initialData?.project_type} placeholder="Personal / Client" />
          </div>
          <TextField
            label="Master project title"
            name="title"
            defaultValue={initialData?.title}
            placeholder="e.g. Stock Management"
            required
          />
          <div className="space-y-2">
            <span className="label-mono text-muted-foreground">
              Tech stack
            </span>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-xs border border-border bg-secondary px-2 py-1 label-mono text-foreground"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    aria-label={`Remove tag ${tag}`}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
                placeholder="Add tech stack…"
                aria-label="New tech stack tag"
                className="h-9 flex-1 rounded-xs border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button type="button" variant="outline" onClick={addTag} className="shrink-0" aria-label="Add tag">
                <Plus size={16} />
              </Button>
            </div>
          </div>
        </FormSection>

        <FormSection title="Logistics">
          <TextField label="Production link" name="live_url" defaultValue={initialData?.live_url} placeholder="https://…" />
          <TextField label="GitHub repository" name="github_url" defaultValue={initialData?.github_url} placeholder="https://github.com/…" />
          <TextField label="Sort order" name="order_index" type="number" defaultValue={initialData?.order_index || 0} />
          <div className="grid gap-4 sm:grid-cols-2">
            <SwitchRow
              name="featured"
              label="Featured"
              description="Pinned to the homepage."
              defaultChecked={initialData?.featured}
            />
            <SwitchRow
              name="is_published"
              label="Public"
              description="Visible on the site."
              defaultChecked={initialData?.is_published ?? true}
            />
          </div>
        </FormSection>
      </div>

      <FormFooter onCancel={onCancel} isSaving={isSaving} submitLabel="Save project" />
    </form>
  )
}
