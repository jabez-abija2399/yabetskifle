"use client"

import { useState } from "react"
import { Testimonial } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { Star, Loader2, User, Eye, EyeOff } from "lucide-react"

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
      is_published: formData.get("is_published") === "on", // 👈 Capture toggle
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid md:grid-cols-3 gap-10">
        
        {/* Left: Avatar Upload */}
        <div className="space-y-4">
           <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Client Photo</label>
           <div className="relative w-32 h-32 mx-auto rounded-full border-4 border-muted overflow-hidden bg-muted flex items-center justify-center">
              {avatar ? (
                <img src={avatar} alt="Client" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-zinc-400" />
              )}
           </div>
           <div className="flex justify-center">
              <ImageUploader onUpload={setAvatar} />
           </div>
        </div>

        {/* Right: Info Fields */}
        <div className="md:col-span-2 space-y-6">
           <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Client Name</label>
                 <Input name="client_name" defaultValue={initialData?.client_name} required placeholder="Elon Musk" />
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Role / Company</label>
                 <Input name="client_role" defaultValue={initialData?.client_role} required placeholder="CEO @ Tesla" />
              </div>
           </div>

           <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Feedback Content</label>
              <textarea 
                 name="content" 
                 defaultValue={initialData?.content} 
                 required 
                 className="w-full min-h-32 p-4 rounded-2xl border border-border bg-background text-sm leading-relaxed" 
                 placeholder="Working with Yabets was an absolute game changer..."
              />
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Trust Rating</label>
              <div className="flex gap-2">
                 {[1, 2, 3, 4, 5].map((s) => (
                    <button 
                      key={s} 
                      type="button" 
                      onClick={() => setRating(s)}
                      className="transition-transform active:scale-90"
                    >
                       <Star 
                         className={`w-6 h-6 ${s <= rating ? "fill-yellow-500 text-yellow-500" : "text-muted border-zinc-700"}`} 
                       />
                    </button>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* 🛡️ VISIBILITY TOGGLE */}
      <div className="flex items-center justify-between p-6 rounded-3xl bg-muted/30 border border-border">
        <div className="flex items-center gap-4">
           <div className={`w-10 h-10 rounded-full flex items-center justify-center ${initialData?.is_published === false ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
              {initialData?.is_published === false ? <EyeOff size={20} /> : <Eye size={20} />}
           </div>
           <div className="space-y-0.5">
              <p className="font-bold text-sm">Public Visibility</p>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none">
                 {initialData?.is_published === false ? "Hidden from Public Site" : "Visible to everyone"}
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

      <div className="flex justify-end gap-3 pt-8 border-t border-border">
        <Button type="button" variant="ghost" onClick={onCancel}>Discard</Button>
        <Button type="submit" disabled={isSaving} className="rounded-xl px-12 h-14 font-black transition-all hover:scale-[1.02] shadow-xl shadow-primary/20">
          {isSaving && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
          {initialData ? "Update Testimonial" : "Publish Feedback"}
        </Button>
      </div>
    </form>
  )
}
