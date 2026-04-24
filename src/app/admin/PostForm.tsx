"use client"

import { useState } from "react"
import { Post } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { Loader2, FileText, Globe } from "lucide-react"

interface Props {
  initialData?: Post
  onSave: (data: Omit<Post, "id" | "created_at">) => Promise<void>
  isSaving: boolean
  onCancel: () => void
}

export const PostForm = ({ initialData, onSave, isSaving, onCancel }: Props) => {
  const [coverImage, setCoverImage] = useState(initialData?.cover_image || "")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Auto-generate slug from title if empty
    const title = formData.get("title") as string
    const slug = formData.get("slug") as string || title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")

    await onSave({
      title,
      slug,
      content: formData.get("content") as string,
      excerpt: formData.get("excerpt") as string,
      cover_image: coverImage,
      published: formData.get("published") === "on",
      tags: (formData.get("tags") as string).split(",").map(t => t.trim()).filter(t => t !== ""),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold">Post Title</label>
            <Input name="title" defaultValue={initialData?.title} required placeholder="The future of Web Development..." />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">Content (Markdown/HTML supported)</label>
            <textarea 
               name="content" 
               defaultValue={initialData?.content} 
               required 
               className="w-full min-h-[400px] p-6 rounded-3xl border border-border bg-background font-mono text-sm leading-relaxed" 
               placeholder="Start writing your masterpiece..."
            />
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           <div className="p-6 rounded-[2rem] border border-border bg-muted/20 space-y-4">
              <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Metadata</p>
              <div className="space-y-1">
                 <label className="text-[10px] font-bold">Slug (URL)</label>
                 <Input name="slug" defaultValue={initialData?.slug} placeholder="my-awesome-post" />
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] font-bold">Tags (comma separated)</label>
                 <Input name="tags" defaultValue={initialData?.tags?.join(", ")} placeholder="react, design, thoughts" />
              </div>
              <div className="flex items-center gap-2 pt-2">
                 <input type="checkbox" name="published" id="published" defaultChecked={initialData?.published} className="w-4 h-4 accent-primary" />
                 <label htmlFor="published" className="text-sm font-bold">Publish instantly</label>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase">Cover Image</label>
              <div className="relative aspect-video rounded-3xl border-2 border-border overflow-hidden bg-muted flex items-center justify-center">
                 {coverImage ? <img src={coverImage} alt="" className="w-full h-full object-cover" /> : <FileText className="w-8 h-8 text-zinc-600" />}
              </div>
              <ImageUploader onUpload={setCoverImage} />
           </div>

           <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase">Short Excerpt</label>
              <textarea name="excerpt" defaultValue={initialData?.excerpt} className="w-full h-24 p-3 rounded-xl border border-border bg-background text-xs" placeholder="Short preview text for the blog list..." />
           </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-10 border-t border-border">
        <Button type="button" variant="ghost" onClick={onCancel}>Discard Changes</Button>
        <Button type="submit" disabled={isSaving} className="rounded-2xl px-12 h-14 font-black shadow-2xl shadow-primary/20">
          {isSaving && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
          {initialData ? "Update Post" : "Publish Story"}
        </Button>
      </div>
    </form>
  )
}
