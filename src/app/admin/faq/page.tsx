"use client"

import { useState } from "react"
import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { AdminEmptyState } from "@/components/ui/AdminEmptyState"
import { FAQForm } from "../FAQForm"
import { FAQ } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Pencil, Trash2, HelpCircle } from "lucide-react"

export default function AdminFAQPage() {
  const { data: faqs, loading, deleteItem, refresh } = useAdminData<FAQ>("faqs")
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: Omit<FAQ, "id">) => {
    setIsSaving(true)
    const supabase = createSupabaseClient()
    const { error } = editingFAQ 
      ? await supabase.from("faqs").update(data).eq("id", editingFAQ.id)
      : await supabase.from("faqs").insert([data])

    if (error) {
      toast.error(`Error: ${error.message}`)
    } else {
      toast.success("FAQ saved!")
      setEditingFAQ(null)
      setIsAdding(false)
      refresh()
    }
    setIsSaving(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AdminPageHeader 
        title="Frequently Asked Questions" 
        description="Address common client inquiries directly on your site."
        actionLabel={!(isAdding || editingFAQ) ? "Add FAQ" : undefined}
        onAction={() => setIsAdding(true)}
      />

      {(isAdding || editingFAQ) ? (
        <div className="p-8 rounded-[2.5rem] border border-border bg-card shadow-sm">
           <h3 className="text-xl font-bold mb-6">{editingFAQ ? "Edit FAQ" : "New FAQ"}</h3>
           <FAQForm 
              initialData={editingFAQ || undefined} 
              onSave={handleSave} 
              isSaving={isSaving}
              onCancel={() => { setEditingFAQ(null); setIsAdding(false); }}
           />
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.length === 0 && !loading && <AdminEmptyState message="No FAQs added yet." />}
          {faqs.map((faq) => (
            <div key={faq.id} className="p-6 rounded-[2rem] border border-border bg-card group relative">
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-5 h-5 text-primary" />
                 </div>
                 <div className="space-y-1 pr-20">
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">{faq.category}</p>
                    <h4 className="font-bold text-lg">{faq.question}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                 </div>
              </div>

              <div className="absolute top-6 right-6 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditingFAQ(faq)} className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => deleteItem(faq.id)} className="p-2 rounded-lg bg-muted hover:bg-destructive hover:text-white transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
