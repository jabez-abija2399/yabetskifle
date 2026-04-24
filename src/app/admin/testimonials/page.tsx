"use client"

import { useState } from "react"
import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { AdminEmptyState } from "@/components/ui/AdminEmptyState"
import { TestimonialForm } from "../TestimonialForm"
import { Testimonial } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Pencil, Trash2, Quote, Star } from "lucide-react"

export default function AdminTestimonialsPage() {
  const { data: reviews, loading, deleteItem, refresh } = useAdminData<Testimonial>("testimonials")
  const [editingReview, setEditingReview] = useState<Testimonial | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: Omit<Testimonial, "id">) => {
    setIsSaving(true)
    const supabase = createSupabaseClient()
    const { error } = editingReview 
      ? await supabase.from("testimonials").update(data).eq("id", editingReview.id)
      : await supabase.from("testimonials").insert([data])

    if (error) {
      toast.error(`Error: ${error.message}`)
    } else {
      toast.success("Feedback saved!")
      setEditingReview(null)
      setIsAdding(false)
      refresh()
    }
    setIsSaving(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <AdminPageHeader 
        title="Client Testimonials" 
        description="Manage reviews and feedback from your clients to build social proof."
        actionLabel={!(isAdding || editingReview) ? "Add Feedback" : undefined}
        onAction={() => setIsAdding(true)}
      />

      {(isAdding || editingReview) ? (
        <div className="p-8 rounded-[2.5rem] border border-border bg-card shadow-sm">
           <h3 className="text-xl font-bold mb-6">{editingReview ? "Edit Feedback" : "Add New Feedback"}</h3>
           <TestimonialForm 
              initialData={editingReview || undefined} 
              onSave={handleSave} 
              isSaving={isSaving}
              onCancel={() => { setEditingReview(null); setIsAdding(false); }}
           />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.length === 0 && !loading && <AdminEmptyState message="No testimonials yet. Add your first client review!" />}
          {reviews.map((review) => (
            <div key={review.id} className="p-8 rounded-[2.5rem] border border-border bg-card space-y-6 group relative">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
              
              <div className="flex gap-1 text-yellow-400">
                {[...Array(review.rating || 5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
              </div>

              <p className="text-sm italic text-muted-foreground leading-relaxed line-clamp-3">"{review.content}"</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-muted border border-border overflow-hidden">
                      {review.client_avatar && <img src={review.client_avatar} alt="" className="w-full h-full object-cover" />}
                   </div>
                   <div>
                      <h5 className="font-bold text-sm tracking-tight">{review.client_name}</h5>
                      <p className="text-[10px] text-muted-foreground uppercase font-black">{review.client_role}</p>
                   </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => setEditingReview(review)} className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors">
                      <Pencil size={14} />
                   </button>
                   <button onClick={() => deleteItem(review.id)} className="p-2 rounded-lg bg-muted hover:bg-destructive hover:text-white transition-colors">
                      <Trash2 size={14} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
