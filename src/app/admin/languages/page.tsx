"use client"

import { useState } from "react"
import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { AdminEmptyState } from "@/components/ui/AdminEmptyState"
import { Language } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Languages, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminLanguagesPage() {
  const { data: langs, loading, deleteItem, refresh } = useAdminData<Language>("languages")
  const [editingItem, setEditingItem] = useState<Language | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      proficiency: formData.get("proficiency") as string,
      is_published: formData.get("is_published") === "on", // 👈 Capture toggle
    }

    const supabase = createSupabaseClient()
    const { error } = editingItem 
      ? await supabase.from("languages").update(data).eq("id", editingItem.id)
      : await supabase.from("languages").insert([data])

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Language profile updated!")
      setEditingItem(null)
      setIsAdding(false)
      refresh()
    }
    setIsSaving(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AdminPageHeader 
        title="Languages" 
        description="List the languages you speak and your proficiency level."
        actionLabel={!(isAdding || editingItem) ? "Add Language" : undefined}
        onAction={() => setIsAdding(true)}
      />

      {(isAdding || editingItem) && (
        <form onSubmit={handleSave} className="p-6 rounded-[2rem] border border-border bg-card shadow-sm mb-10 space-y-4 animate-in fade-in zoom-in-95">
           <div className="grid grid-cols-2 gap-4">
              <Input name="name" defaultValue={editingItem?.name} placeholder="Language (e.g. English)" required />
              <Input name="proficiency" defaultValue={editingItem?.proficiency} placeholder="Level (e.g. Native)" required />
           </div>

           <div className="flex items-center justify-between pt-2">
              {/* 🛡️ TOGGLE */}
              <div className="flex items-center gap-3 bg-muted/50 p-2 px-4 rounded-full border border-border">
                 <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Live Status</span>
                 <input type="checkbox" name="is_published" defaultChecked={editingItem?.is_published ?? true} className="w-10 h-5 accent-primary" />
              </div>

              <div className="flex gap-2">
                 <Button type="button" variant="ghost" size="sm" onClick={() => { setEditingItem(null); setIsAdding(false); }}>Discard</Button>
                 <Button type="submit" size="sm" disabled={isSaving}>{isSaving ? "Updatig..." : "Save Language"}</Button>
              </div>
           </div>
        </form>
      )}

      <div className="grid gap-3">
        {langs.length === 0 && !loading && <AdminEmptyState message="No languages listed." />}
        {langs.map((lang) => (
          <div key={lang.id} className={`p-4 px-6 rounded-2xl border border-border bg-card group flex items-center justify-between hover:border-primary/20 transition-all ${!lang.is_published ? "bg-muted/30 opacity-60" : ""}`}>
            <div className="flex items-center gap-4">
               <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary"><Languages size={18} /></div>
                  {!lang.is_published && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white rounded-full flex items-center justify-center shadow-lg"><EyeOff size={8} /></div>
                  )}
               </div>
               <div>
                  <h4 className="font-bold flex items-center gap-2 text-sm uppercase tracking-tight">
                    {lang.name}
                    {!lang.is_published && <span className="text-[8px] bg-destructive/10 text-destructive px-2 py-0.5 rounded-full border border-destructive/20 font-black tracking-widest">HIDDEN</span>}
                  </h4>
                  <p className="text-xs text-muted-foreground font-black uppercase tracking-widest opacity-60">{lang.proficiency}</p>
               </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setEditingItem(lang)} className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-all"><Pencil size={12} /></button>
              <button onClick={() => deleteItem(lang.id)} className="p-2 rounded-lg bg-muted hover:bg-destructive hover:text-white transition-all"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
