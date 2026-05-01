"use client"

import { useState } from "react"
import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { AdminEmptyState } from "@/components/ui/AdminEmptyState"
import { TestimonialForm } from "../TestimonialForm"
import { Testimonial } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Pencil, Trash2, Quote, Star, EyeOff } from "lucide-react"

export default function AdminTestimonialsPage() {
  const { data: list, loading, deleteItem, refresh } = useAdminData<Testimonial>("testimonials")
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: Omit<Testimonial, "id" | "created_at">) => {
    setIsSaving(true)
    const supabase = createSupabaseClient()
    const { error } = editingItem 
      ? await supabase.from("testimonials").update(data).eq("id", editingItem.id)
      : await supabase.from("testimonials").insert([data])

    if (error) {
      toast.error(`Error: ${error.message}`)
    } else {
      toast.success(editingItem ? "Social proof updated!" : "Feedback added!")
      setEditingItem(null)
      setIsAdding(false)
      refresh()
    }
    setIsSaving(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <AdminPageHeader 
        title="Client Testimonials" 
        description="Share the love! Manage what your clients and teammates say about you."
        actionLabel={!(isAdding || editingItem) ? "Add Testimonial" : undefined}
        onAction={() => setIsAdding(true)}
      />

      {(isAdding || editingItem) ? (
        <div className="p-10 rounded-[3rem] border border-border bg-card animate-in fade-in slide-in-from-bottom-4 shadow-sm">
           <h3 className="text-xl font-bold mb-8 italic">{editingItem ? "Edit Story" : "New Client Praise"}</h3>
           <TestimonialForm 
              initialData={editingItem || undefined} 
              onSave={handleSave} 
              isSaving={isSaving}
              onCancel={() => { setEditingItem(null); setIsAdding(false); }}
           />
        </div>
      ) : (
        <div className="grid gap-6">
          {list.length === 0 && !loading && <AdminEmptyState message="No one has left a review yet. Be the first to add one!" />}
          
          <div className="grid md:grid-cols-2 gap-6">
            {list.map((item) => (
              <div key={item.id} className={`p-8 rounded-[3rem] border border-border bg-card group relative hover:border-primary/40 transition-all ${!item.is_published ? "grayscale-[0.5] opacity-75" : ""}`}>
                <Quote className="absolute top-8 right-10 w-10 h-10 text-primary/5 transition-colors group-hover:text-primary/10" />
                
                <div className="flex items-center gap-2 mb-6">
                   <div className="flex gap-1 text-yellow-500">
                      {[...Array(item.rating || 5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                   </div>
                   {!item.is_published && (
                     <span className="flex items-center gap-1 text-[8px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 font-black uppercase tracking-widest">
                        <EyeOff size={8} /> Hidden
                     </span>
                   )}
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-10 italic">
                  "{item.content}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                  <div className="w-12 h-12 rounded-full border border-border bg-muted overflow-hidden shrink-0">
                     {item.client_avatar ? (
                       <img src={item.client_avatar} alt="" className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center font-bold text-zinc-500">
                          {item.client_name.charAt(0)}
                       </div>
                     )}
                  </div>
                  <div className="flex-1">
                     <h4 className="font-bold text-sm tracking-tight">{item.client_name}</h4>
                     <p className="text-[10px] text-muted-foreground uppercase font-black">{item.client_role}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => setEditingItem(item)} className="p-2 rounded-lg bg-muted text-primary hover:bg-primary hover:text-primary-foreground transition-all"><Pencil size={14} /></button>
                    <button onClick={() => deleteItem(item.id)} className="p-2 rounded-lg bg-muted text-destructive hover:bg-destructive hover:text-white transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
