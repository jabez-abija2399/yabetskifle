"use client"

import { useState } from "react"
import { Testimonial } from "@/types/portfolio"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { TextField, TextAreaField, SwitchRow, FormFooter, FormSection } from "@/components/admin/fields"
import { Star, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  initialData?: Testimonial
  onSave: (data: Omit<Testimonial, "id" | "created_at">) => Promise<void>
  isSaving: boolean
  onCancel: () => void
}

export const TestimonialForm = ({ initialData, onSave, isSaving, onCancel }: Props) => {
  const [avatar, setAvatar] = useState(initialData?.client_avatar || "")
  const [rating, setRating] = useState(initialData?.rating || 5)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    await onSave({
      client_name: formData.get("client_name") as string,
      client_role: formData.get("client_role") as string,
      client_avatar: avatar,
      content: formData.get("content") as string,
      rating: rating,
      is_published: formData.get("is_published") === "on",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormSection title="Client">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-3">
            <span className="label-mono text-muted-foreground">
              Client photo
            </span>
            <div className="flex size-24 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <User className="size-8 text-muted-foreground" aria-hidden />
              )}
            </div>
            <ImageUploader onUpload={setAvatar} />
          </div>

          <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
            <TextField
              label="Client name"
              name="client_name"
              defaultValue={initialData?.client_name}
              placeholder="Elon Musk"
              required
            />
            <TextField
              label="Role / company"
              name="client_role"
              defaultValue={initialData?.client_role}
              placeholder="CEO @ Tesla"
              required
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Feedback">
        <TextAreaField
          label="Quote"
          name="content"
          defaultValue={initialData?.content}
          rows={5}
          required
          placeholder="Working with Yabets was an absolute game changer…"
        />

        <div className="space-y-2">
          <span className="label-mono text-muted-foreground">
            Trust rating
          </span>
          <div className="flex gap-1" role="radiogroup" aria-label="Trust rating">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={s <= rating}
                aria-label={`${s} star${s > 1 ? "s" : ""}`}
                onClick={() => setRating(s)}
                className="flex size-8 items-center justify-center transition-colors hover:bg-muted"
              >
                <Star
                  className={cn(
                    "size-4",
                    s <= rating ? "fill-signal text-signal" : "text-muted-foreground"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </FormSection>

      <FormSection title="Visibility">
        <SwitchRow
          name="is_published"
          label="Public visibility"
          description="Hidden testimonials stay in the admin but never appear on the site."
          defaultChecked={initialData?.is_published ?? true}
        />
      </FormSection>

      <FormFooter
        onCancel={onCancel}
        isSaving={isSaving}
        submitLabel={initialData ? "Update testimonial" : "Save testimonial"}
      />
    </form>
  )
}
