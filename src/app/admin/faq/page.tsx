"use client"

import { useState } from "react"
import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { AdminEmptyState } from "@/components/ui/AdminEmptyState"
import { FAQ } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, HelpCircle, EyeOff, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminFAQPage() {
  const { data: faqs, loading, deleteItem, refresh } = useAdminData<FAQ>("faqs")
  const [editingItem, setEditingItem] = useState<FAQ | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      question: formData.get("question") as string,
      answer: formData.get("answer") as string,
      category: formData.get("category") as string,
      order_index: parseInt(formData.get("order_index") as string) || 0,
      is_published: formData.get("is_published") === "on", // 👈 Capture toggle
    }

    const supabase = createSupabaseClient()
    const { error } = editingItem 
      ? await supabase.from("faqs").update(data).eq("id", editingItem.id)
      : await supabase.from("faqs").insert([data])

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("FAQ updated!")
      setEditingItem(null)
      setIsAdding(false)
      refresh()
    }
    setIsSaving(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AdminPageHeader 
        title="FAQ Management" 
        description="Anticipate and answer your visitors' questions before they ask."
        actionLabel={!(isAdding || editingItem) ? "Add FAQ" : undefined}
        onAction={() => setIsAdding(true)}
      />

      {(isAdding || editingItem) && (
        <form onSubmit={handleSave} className="p-8 rounded-[2.5rem] border border-border bg-card shadow-sm mb-10 space-y-6 animate-in fade-in slide-in-from-top-4">
           <h3 className="text-xl font-bold italic">{editingItem ? "Edit Question" : "New FAQ Entry"}</h3>
           <div className="grid md:grid-cols-2 gap-4">
              <Input name="question" defaultValue={editingItem?.question} placeholder="The Question" required />
              <Input name="category" defaultValue={editingItem?.category} placeholder="Category (e.g. Services)" required />
           </div>
           <textarea name="answer" defaultValue={editingItem?.answer} placeholder="The Answer..." required className="w-full min-h-24 p-3 rounded-xl border border-border bg-background text-foreground text-sm" />
           
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <label className="text-xs font-bold text-zinc-500">Order</label>
                 <Input name="order_index" type="number" defaultValue={editingItem?.order_index || 0} className="w-20" />
              </div>
              
              {/* 🛡️ TOGGLE */}
              <div className="flex items-center gap-3 bg-muted/50 p-2 px-4 rounded-full border border-border">
                 <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Public Visibility</span>
                 <input type="checkbox" name="is_published" defaultChecked={editingItem?.is_published ?? true} className="w-10 h-5 accent-primary" />
              </div>
           </div>

           <div className="flex justify-end gap-3 pt-6 border-t border-border">
              <Button type="button" variant="ghost" onClick={() => { setEditingItem(null); setIsAdding(false); }}>Cancel</Button>
              <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save FAQ"}</Button>
           </div>
        </form>
      )}

      <div className="space-y-3">
        {faqs.length === 0 && !loading && <AdminEmptyState message="No FAQs yet." />}
        {faqs.map((faq) => (
          <div key={faq.id} className={`p-5 rounded-[2rem] border border-border bg-card group flex items-center justify-between hover:border-primary/30 transition-all ${!faq.is_published ? "bg-muted/30 opacity-70" : ""}`}>
            <div className="flex items-center gap-4">
               <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><HelpCircle size={18} /></div>
                  {!faq.is_published && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white rounded-full flex items-center justify-center shadow-lg"><EyeOff size={8} /></div>
                  )}
               </div>
               <div>
                  <h4 className="font-bold flex items-center gap-2">
                     {faq.question}
                     {!faq.is_published && <span className="text-[7px] bg-destructive/10 text-destructive px-2 py-0.5 rounded-full border border-destructive/20 uppercase font-black tracking-widest">Hidden</span>}
                  </h4>
                  <p className="text-xs text-muted-foreground">{faq.category}</p>
               </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setEditingItem(faq)} className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all"><Pencil size={14} /></button>
              <button onClick={() => deleteItem(faq.id)} className="p-2 rounded-lg bg-muted hover:bg-destructive hover:text-white transition-all"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
