"use client"

import { useState } from "react"
import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { AdminEmptyState } from "@/components/ui/AdminEmptyState"
import { LanguageForm } from "../LanguageForm"
import { Language } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Pencil, Trash2, Languages } from "lucide-react"

export default function AdminLanguagesPage() {
  const { data: langs, loading, deleteItem, refresh } = useAdminData<Language>("languages")
  const [editingLang, setEditingLang] = useState<Language | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: Omit<Language, "id">) => {
    setIsSaving(true)
    const supabase = createSupabaseClient()
    const { error } = editingLang 
      ? await supabase.from("languages").update(data).eq("id", editingLang.id)
      : await supabase.from("languages").insert([data])

    if (error) {
      toast.error(`Error: ${error.message}`)
    } else {
      toast.success("Language saved!")
      setEditingLang(null)
      setIsAdding(false)
      refresh()
    }
    setIsSaving(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AdminPageHeader 
        title="Languages" 
        description="Share your linguistic skills for international collaboration."
        actionLabel={!(isAdding || editingLang) ? "Add Language" : undefined}
        onAction={() => setIsAdding(true)}
      />

      {(isAdding || editingLang) ? (
        <div className="p-8 rounded-[2.5rem] border border-border bg-card shadow-sm">
           <h3 className="text-lg font-bold mb-6 italic">{editingLang ? "Update Proficiency" : "New Language"}</h3>
           <LanguageForm 
              initialData={editingLang || undefined} 
              onSave={handleSave} 
              isSaving={isSaving}
              onCancel={() => { setEditingLang(null); setIsAdding(false); }}
           />
        </div>
      ) : (
        <div className="grid gap-3">
          {langs.length === 0 && !loading && <AdminEmptyState message="No languages listed." />}
          {langs.map((lang) => (
            <div key={lang.id} className="p-5 rounded-2xl border border-border bg-card flex items-center justify-between group">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                     <Languages className="w-5 h-5" />
                  </div>
                  <div>
                     <h4 className="font-bold">{lang.name}</h4>
                     <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">{lang.proficiency}</p>
                  </div>
               </div>

               <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditingLang(lang)} className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => deleteItem(lang.id)} className="p-2 rounded-lg bg-muted hover:bg-destructive hover:text-white transition-colors">
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
