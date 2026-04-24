"use client"

import { useState } from "react"
import { Project } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { Loader2, X } from "lucide-react"
import Image from "next/image"
import { DynamicListInput } from "./DynamicListInput"

// The "contract" for this component's props
interface ProjectFormProps {
  // If provided → Edit mode. If not → Add mode
  initialData?: Project
  isSaving: boolean
  // onSubmit: (data: Omit<Project, "id">, images: string[]) => Promise<void>
  onSubmit: (data: Omit<Project, "id">) => Promise<void>
  onCancel?: () => void  // Only needed in Edit mode
}

// Reusable form for BOTH Add and Edit
export const ProjectForm = ({
  initialData,
  isSaving,
  onSubmit,
  onCancel,
}: ProjectFormProps) => {
  // Images start with existing ones (edit) or empty (add)
  const [images, setImages] = useState<string[]>(initialData?.images ?? [])

  const isEditMode = !!initialData  // true if editing, false if adding
  // Helper to ensure we always have an array, even if the DB returns a JSON string
  const ensureArray = (data: any): string[] => {
    if (Array.isArray(data)) return data;
    if (typeof data === "string") {
      try {
        // Try to parse it if it looks like ["a", "b"]
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
        // If it's just a normal string with new lines, split it
        return data.split(/\n|,/).map(s => s.trim()).filter(Boolean);
      } catch (e) {
        return data.split(/\n|,/).map(s => s.trim()).filter(Boolean);
      }
    }
    return [];
  };
  const [features, setFeatures] = useState<string[]>(ensureArray(initialData?.key_features))
  const [learned, setLearned] = useState<string[]>(ensureArray(initialData?.what_i_learned))
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    // Reusable tag parser — used in both modes
    const tagsArray = (formData.get("tags") as string)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    await onSubmit(
      {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        images,      // Use our local images state
        tags: tagsArray,
        live_url: formData.get("live_url") as string,
        github_url: formData.get("github_url") as string,
        order_index: Number(formData.get("order_index")),
        my_role: formData.get("my_role") as string,
        key_features: features,
        purpose: formData.get("purpose") as string,
        project_type: formData.get("project_type") as string,
        what_i_learned: learned,
        featured: formData.get("featured") === "on",
      },

    )

    // Only reset if we are in Add mode (edit mode closes the panel)
    if (!isEditMode) {
      setImages([])
        ; (e.target as HTMLFormElement).reset()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div className="space-y-1 md:col-span-2">
        <label className="text-sm font-semibold">Project Title *</label>
        <Input name="title" defaultValue={initialData?.title} placeholder="My Awesome App" required />
      </div>

      <div className="space-y-1 md:col-span-2">
        <label className="text-sm font-semibold">Description *</label>
        <textarea name="description" defaultValue={initialData?.description}
          placeholder="What does this project do?"
          className="w-full min-h-24 p-3 rounded-md border border-input bg-background text-sm" required />
      </div>

      {/* Reusable Image Section */}
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-semibold">Project Images</label>
        {images.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {images.map((url, i) => (
              <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                <Image src={url} alt={`Image ${i + 1}`}
                  fill
                  className="object-cover" />
                <button type="button"
                  onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <ImageUploader onUpload={(url) => setImages(prev => [...prev, url])} />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold">Tags (comma separated)</label>
        <Input name="tags" defaultValue={initialData?.tags.join(", ")} placeholder="React, TypeScript" />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold">Your Role</label>
        <Input name="my_role" defaultValue={initialData?.my_role} placeholder="Lead Frontend Developer" />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold">Live URL</label>
        <Input name="live_url" defaultValue={initialData?.live_url} placeholder="https://myapp.com" />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold">GitHub URL</label>
        <Input name="github_url" defaultValue={initialData?.github_url} placeholder="https://github.com/..." />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold">Project Type</label>
        <select name="project_type" defaultValue={initialData?.project_type ?? "Personal"}
          className="w-full p-3 rounded-md border border-input bg-background text-sm">
          <option value="Personal">Personal</option>
          <option value="Client">Client</option>
          <option value="Team">Team</option>
          <option value="Open Source">Open Source</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold">Display Order</label>
        <Input name="order_index" type="number" defaultValue={initialData?.order_index ?? 0} />
      </div>

      <div className="flex items-center gap-2 md:col-span-2 p-3 rounded-lg border border-border bg-muted/30">
        <input
          type="checkbox"
          name="featured"
          id="featured"
          defaultChecked={initialData?.featured}
          className="w-4 h-4 accent-primary"
        />
        <label htmlFor="featured" className="text-sm font-semibold cursor-pointer">
          Feature this project on the homepage
        </label>
      </div>

      <div className="space-y-1 md:col-span-2">
        <label className="text-sm font-semibold">Purpose / Problem Solved</label>
        <textarea name="purpose" defaultValue={initialData?.purpose}
          placeholder="Why was this built?"
          className="w-full min-h-20 p-3 rounded-md border border-input bg-background text-sm" />
      </div>

      <div className="md:col-span-2">
        <DynamicListInput
          label="Key Features"
          items={features}
          onChange={setFeatures}
          placeholder="e.g., Real-time chat with Socket.io"
        />
      </div>

      <div className="md:col-span-2">
        <DynamicListInput
          label="What I Learned"
          items={learned}
          onChange={setLearned}
          placeholder="e.g., Deep dive into PostgreSQL indexing"
        />
      </div>

      {/* Action buttons */}
      <div className="md:col-span-2 flex gap-3">
        {onCancel && (
          <Button type="button" variant="outline" className="flex-1 h-12" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1 h-12 font-bold" disabled={isSaving}>
          {isSaving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {isEditMode ? "Saving Changes..." : "Adding Project..."}
            </span>
          ) : (
            isEditMode ? "Save Changes" : "Add Project"
          )}
        </Button>
      </div>

    </form>
  )
}
