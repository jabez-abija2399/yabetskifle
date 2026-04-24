"use client"

import { useState } from "react"
import { Project } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { Plus, X, Globe, Info, Layers, Eye, EyeOff } from "lucide-react"
import { FaGithub } from "react-icons/fa"

interface Props {
  initialData?: Project
  onSave: (data: Omit<Project, "id" | "created_at">) => Promise<void>
  isSaving: boolean
  onCancel: () => void
}

export const ProjectForm = ({ initialData, onSave, isSaving, onCancel }: Props) => {
  const [images, setImages] = useState<string[]>(initialData?.images || [])
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    await onSave({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      content: formData.get("content") as string,
      live_url: formData.get("live_url") as string,
      github_url: formData.get("github_url") as string,
      order_index: parseInt(formData.get("order_index") as string) || 0,
      images,
      tags,
      is_published: formData.get("is_published") === "on", // 👈 Capture toggle
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      
      {/* 🖼️ Media Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Layers size={18}/></div>
           <h3 className="font-bold text-lg">Project Media</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
           {images.map((img, i) => (
             <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-border group bg-muted">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button 
                   type="button"
                   onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                   className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                   <X size={12} />
                </button>
             </div>
           ))}
           <div className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl hover:border-primary/50 transition-colors">
              <ImageUploader onUpload={(url) => setImages([...images, url])} />
              <p className="text-[10px] font-bold text-zinc-500 mt-2 uppercase tracking-widest text-center px-4 leading-none">Add Visuals</p>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
         {/* 📝 Core Info */}
         <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Info size={18}/></div>
               <h3 className="font-bold text-lg">Project Details</h3>
            </div>
            <div className="space-y-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-zinc-500">Master Title</label>
                  <Input name="title" defaultValue={initialData?.title} placeholder="e.g. AI-Powered Analytics" required />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-zinc-500">Elevator Pitch</label>
                  <textarea name="description" defaultValue={initialData?.description} required placeholder="Brief summary for cards..." className="w-full min-h-24 p-3 rounded-xl border border-border bg-background text-sm" />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-zinc-500">Full Case Study Content</label>
                  <textarea name="content" defaultValue={initialData?.content} placeholder="Deep dive into your process..." className="w-full min-h-48 p-4 rounded-xl border border-border bg-background text-sm leading-relaxed" />
               </div>
            </div>
         </div>

         {/* 🔗 Links & Tags */}
         <div className="space-y-8">
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Globe size={18}/></div>
                  <h3 className="font-bold text-lg">Integration & Reach</h3>
               </div>
               <div className="grid gap-4">
                  <div className="relative group">
                     <Input name="live_url" defaultValue={initialData?.live_url} placeholder="Production URL" className="pl-10" />
                     <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="relative group">
                     <Input name="github_url" defaultValue={initialData?.github_url} placeholder="Repository Link" className="pl-10" />
                     <FaGithub className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Technologies & Tags</label>
               <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold border border-primary/10">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-destructive"><X size={12}/></button>
                    </span>
                  ))}
               </div>
               <div className="flex gap-2">
                  <Input value={newTag || ""} onChange={(e) => setNewTag(e.target.value)} placeholder="Add tag (e.g. Next.js)" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                  <Button type="button" onClick={addTag} variant="outline" className="shrink-0"><Plus size={16}/></Button>
               </div>
            </div>
         </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center bg-muted/20 p-8 rounded-[2rem] border border-border">
         <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-zinc-500">Display Weight</label>
            <Input name="order_index" type="number" defaultValue={initialData?.order_index || 0} className="w-32" />
         </div>

         {/* 🛡️ VISIBILITY TOGGLE */}
         <div className="flex items-center justify-between p-4 rounded-2xl bg-background border border-border">
           <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${initialData?.is_published === false ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                 {initialData?.is_published === false ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
              <div className="space-y-0.5">
                 <p className="font-bold text-sm">Public Visibility</p>
                 <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none">
                    {initialData?.is_published === false ? "Hidden" : "Public"}
                 </p>
              </div>
           </div>
           <input 
              type="checkbox" 
              name="is_published"
              defaultChecked={initialData?.is_published ?? true}
              className="w-12 h-6 accent-primary cursor-pointer"
           />
         </div>
      </div>

      <div className="flex justify-end gap-3 pt-10 border-t border-border">
        <Button type="button" variant="ghost" onClick={onCancel} className="h-14 px-8 rounded-2xl">Discard Changes</Button>
        <Button type="submit" disabled={isSaving} className="h-14 px-12 rounded-2xl font-black shadow-xl shadow-primary/20">
           {isSaving ? "Publishing..." : "Save Project"}
        </Button>
      </div>
    </form>
  )
}
