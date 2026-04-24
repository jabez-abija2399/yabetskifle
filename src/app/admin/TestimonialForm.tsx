"use client"

import { useState } from "react"
import { Testimonial } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { Loader2, User } from "lucide-react"
import Image from "next/image"

interface Props {
  initialData?: Testimonial
  onSave: (data: Omit<Testimonial, "id">) => Promise<void>
  isSaving: boolean
  onCancel: () => void
}

export const TestimonialForm = ({ initialData, onSave, isSaving, onCancel }: Props) => {
  const [avatar, setAvatar] = useState(initialData?.client_avatar || "")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await onSave({
      client_name: formData.get("client_name") as string,
      client_role: formData.get("client_role") as string,
      client_avatar: avatar,
      content: formData.get("content") as string,
      rating: Number(formData.get("rating")),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="space-y-4">
           <label className="text-sm font-semibold text-zinc-400">Client Avatar</label>
           <div className="relative w-20 h-20 rounded-full border-2 border-border overflow-hidden bg-muted flex items-center justify-center">
              {avatar ? <Image src={avatar} alt="Avatar" fill className="object-cover" /> : <User className="w-8 h-8 text-zinc-500" />}
           </div>
           <ImageUploader onUpload={setAvatar} />
        </div>

        <div className="md:col-span-2 space-y-4">
           <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-zinc-400">Client Name</label>
                <Input name="client_name" defaultValue={initialData?.client_name} required placeholder="John Doe" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-zinc-400">Client Role</label>
                <Input name="client_role" defaultValue={initialData?.client_role} placeholder="CEO at TechCorp" />
              </div>
           </div>
           <div className="space-y-1">
              <label className="text-sm font-semibold text-zinc-400">Rating (1-5)</label>
              <Input name="rating" type="number" min="1" max="5" defaultValue={initialData?.rating || 5} />
           </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-zinc-400">Testimonial Content</label>
        <textarea name="content" defaultValue={initialData?.content} required 
          className="w-full min-h-24 p-4 rounded-xl border border-border bg-background text-sm leading-relaxed" 
          placeholder="What did the client say about your work?" />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSaving} className="rounded-xl px-10 h-12 font-black shadow-xl shadow-primary/20">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Feedback" : "Add Feedback"}
        </Button>
      </div>
    </form>
  )
}
