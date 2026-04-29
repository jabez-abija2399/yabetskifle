"use client"

import { useState } from "react"
import { Project } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { Plus, X, Globe, Info, Layers, Eye, EyeOff, Target, Lightbulb, Zap, Award, BookOpen } from "lucide-react"
import { FaGithub } from "react-icons/fa"

interface Props {
  initialData?: Project
  onSave: (data: Omit<Project, "id" | "created_at">) => Promise<void>
  isSaving: boolean
  onCancel: () => void
}

// 🛡️ Safe Parser: Handles JSON strings, real arrays, and nulls
const ensureArray = (val: any): string[] => {
  if (!val) return []
  if (Array.isArray(val)) return val
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val)
      return Array.isArray(parsed) ? parsed : [val]
    } catch {
      return val.startsWith('[') ? [] : [val]
    }
  }
  return []
}

export const ProjectForm = ({ initialData, onSave, isSaving, onCancel }: Props) => {
  const [images, setImages] = useState<string[]>(ensureArray(initialData?.images))
  const [tags, setTags] = useState<string[]>(ensureArray(initialData?.tags))
  const [keyFeatures, setKeyFeatures] = useState<string[]>(ensureArray(initialData?.key_features).length > 0 ? ensureArray(initialData?.key_features) : [""])
  const [learnings, setLearnings] = useState<string[]>(ensureArray(initialData?.what_i_learned).length > 0 ? ensureArray(initialData?.what_i_learned) : [""])
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
      purpose: formData.get("purpose") as string,
      my_role: formData.get("my_role") as string,
      project_type: formData.get("project_type") as string,
      key_features: keyFeatures.filter(f => f.trim() !== ""),
      what_i_learned: learnings.filter(l => l.trim() !== ""),
      live_url: formData.get("live_url") as string,
      github_url: formData.get("github_url") as string,
      featured: formData.get("featured") === "on",
      order_index: parseInt(formData.get("order_index") as string) || 0,
      images,
      tags,
      is_published: formData.get("is_published") === "on",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      
      {/* 🖼️ Media Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Layers size={18}/></div>
           <h3 className="font-bold text-lg">Project Visuals</h3>
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
              <ImageUploader onUpload={(url) => setImages(prev => [...prev, url])} />
              <p className="text-[10px] font-bold text-zinc-500 mt-2 uppercase tracking-widest text-center px-4 leading-none">Add Media</p>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
         <div className="space-y-8">
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500"><Target size={18}/></div>
                  <h3 className="font-bold text-lg leading-none">Project Purpose</h3>
               </div>
               <textarea name="purpose" defaultValue={initialData?.purpose} placeholder="Why did you build this? What problem does it solve?" className="w-full min-h-32 p-4 rounded-xl border border-border bg-background text-sm leading-relaxed" />
            </div>

            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Lightbulb size={18}/></div>
                  <h3 className="font-bold text-lg leading-none">Project Description (Case Study)</h3>
               </div>
               <textarea name="description" defaultValue={initialData?.description} placeholder="The full story of the project..." className="w-full min-h-64 p-5 rounded-[2rem] border border-border bg-background text-sm leading-relaxed font-serif" />
            </div>
         </div>

         <div className="space-y-10">
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500"><Zap size={18}/></div>
                  <h3 className="font-bold text-lg leading-none">Key Features</h3>
               </div>
               <div className="space-y-3">
                  {keyFeatures.map((feat, i) => (
                    <div key={i} className="flex gap-2">
                       <Input value={feat || ""} onChange={(e) => setKeyFeatures(prev => prev.map((f, idx) => idx === i ? e.target.value : f))} placeholder="e.g. Dashboard with charts" />
                       <Button type="button" variant="ghost" size="icon" onClick={() => setKeyFeatures(f => f.filter((_, idx) => idx !== i))} className="text-destructive"><X size={14} /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => setKeyFeatures([...keyFeatures, ""])} className="w-full border-dashed">Add Key Feature</Button>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500"><BookOpen size={18}/></div>
                  <h3 className="font-bold text-lg leading-none">What I Learned</h3>
               </div>
               <div className="space-y-3">
                  {learnings.map((ln, i) => (
                    <div key={i} className="flex gap-2">
                       <Input value={ln || ""} onChange={(e) => setLearnings(prev => prev.map((l, idx) => idx === i ? e.target.value : l))} placeholder="e.g. Optimized SQL queries" />
                       <Button type="button" variant="ghost" size="icon" onClick={() => setLearnings(l => l.filter((_, idx) => idx !== i))} className="text-destructive"><X size={14} /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => setLearnings([...learnings, ""])} className="w-full border-dashed border-green-500/30">Add Learning Detail</Button>
               </div>
            </div>
         </div>
      </div>

      {/* Roles & Meta */}
      <div className="grid lg:grid-cols-2 gap-10 border-t border-border pt-10">
         <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-zinc-500/10 flex items-center justify-center text-zinc-500"><Award size={18}/></div>
               <h3 className="font-bold text-lg">My Role & Details</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Title / Role</label>
                  <Input name="my_role" defaultValue={initialData?.my_role} placeholder="Full Stack Developer" />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Project Type</label>
                  <Input name="project_type" defaultValue={initialData?.project_type} placeholder="Personal / Client" />
               </div>
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Master Project Title</label>
               <Input name="title" defaultValue={initialData?.title} placeholder="e.g. Stock Management" required />
            </div>
            <div className="space-y-4 pt-4">
               <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold border border-primary/10">
                      {tag} <button onClick={() => removeTag(tag)}><X size={12}/></button>
                    </span>
                  ))}
               </div>
               <div className="flex gap-2">
                  <Input value={newTag || ""} onChange={(e) => setNewTag(e.target.value)} placeholder="Add Tech Stack..." onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                  <Button type="button" onClick={addTag} variant="outline" className="shrink-0"><Plus size={16}/></Button>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Globe size={18}/></div>
               <h3 className="font-bold text-lg">Logistics</h3>
            </div>
            <div className="grid gap-4">
               <Input name="live_url" defaultValue={initialData?.live_url} placeholder="Production Link" />
               <Input name="github_url" defaultValue={initialData?.github_url} placeholder="GitHub Repository" />
               <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border">
                     <span className="text-sm font-bold">Featured</span>
                     <input type="checkbox" name="featured" defaultChecked={initialData?.featured} className="w-8 h-4 accent-primary" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border">
                     <span className="text-sm font-bold">Live</span>
                     <input type="checkbox" name="is_published" defaultChecked={initialData?.is_published ?? true} className="w-8 h-4 accent-primary" />
                  </div>
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Sort Order</label>
                  <Input name="order_index" type="number" defaultValue={initialData?.order_index || 0} />
               </div>
            </div>
         </div>
      </div>

      <div className="flex justify-end gap-3 pt-10">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSaving} className="h-14 px-12 rounded-2xl font-black shadow-xl">
           Save Everything
        </Button>
      </div>
    </form>
  )
}
