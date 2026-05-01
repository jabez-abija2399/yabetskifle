"use client"

import { useState } from "react"
import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { AdminEmptyState } from "@/components/ui/AdminEmptyState"
import { ExperienceForm } from "../ExperienceForm"
import { Experience } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Pencil, Trash2, Briefcase, EyeOff } from "lucide-react"

export default function AdminExperiencePage() {
  const { data: exps, loading, deleteItem, refresh } = useAdminData<Experience>("experiences")
  const [editingExp, setEditingExp] = useState<Experience | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: Omit<Experience, "id">) => {
    setIsSaving(true)
    const supabase = createSupabaseClient()
    const { error } = editingExp 
      ? await supabase.from("experiences").update(data).eq("id", editingExp.id)
      : await supabase.from("experiences").insert([data])

    if (error) {
      toast.error(`Error: ${error.message}`)
    } else {
      toast.success("Experience journey updated!")
      setEditingExp(null)
      setIsAdding(false)
      refresh()
    }
    setIsSaving(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AdminPageHeader 
        title="Professional Journey" 
        description="Tell the story of your career growth and major professional milestones."
        actionLabel={!(isAdding || editingExp) ? "Add Experience" : undefined}
        onAction={() => setIsAdding(true)}
      />

      {(isAdding || editingExp) ? (
        <div className="p-8 rounded-[2.5rem] border border-border bg-card shadow-sm animate-in fade-in slide-in-from-bottom-2">
           <h3 className="text-xl font-bold mb-6 italic">{editingExp ? "Edit Experience" : "New Chapter"}</h3>
           <ExperienceForm 
              initialData={editingExp || undefined} 
              onSave={handleSave} 
              isSaving={isSaving}
              onCancel={() => { setEditingExp(null); setIsAdding(false); }}
           />
        </div>
      ) : (
        <div className="space-y-4">
          {exps.length === 0 && !loading && <AdminEmptyState message="Your professional story hasn't started here yet." />}
          {exps.map((exp) => (
            <div key={exp.id} className={`p-6 rounded-[2.5rem] border border-border bg-card group flex items-center justify-between hover:border-primary/30 transition-all ${!exp.is_published ? "bg-muted/30 opacity-70" : ""}`}>
              <div className="flex items-center gap-6">
                 <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Briefcase size={24} />
                    </div>
                    {!exp.is_published && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center shadow-lg">
                        <EyeOff size={10} />
                      </div>
                    )}
                 </div>
                 <div>
                    <div className="flex items-center gap-2 mb-1">
                       <h4 className="font-bold text-lg tracking-tight">{exp.role}</h4>
                       {!exp.is_published && (
                         <span className="text-[8px] font-black uppercase text-destructive tracking-widest px-2 py-0.5 rounded-full bg-destructive/10">Hidden</span>
                       )}
                    </div>
                    <p className="text-sm text-zinc-500 font-medium">
                       {exp.company} <span className="mx-2 text-primary">/</span> {exp.duration}
                    </p>
                 </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => setEditingExp(exp)} className="p-3 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"><Pencil size={14} /></button>
                <button onClick={() => deleteItem(exp.id)} className="p-3 rounded-xl bg-muted hover:bg-destructive hover:text-white transition-all shadow-sm"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
