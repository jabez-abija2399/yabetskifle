"use client"

import { useState } from "react"
import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { AdminEmptyState } from "@/components/ui/AdminEmptyState"
import { ExperienceForm } from "@/components/admin/ExperienceForm"
import { Experience } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Pencil, Trash2, Calendar, Building2 } from "lucide-react"

export default function AdminExperiencePage() {
  const { data: experiences, loading, deleteItem, refresh } = useAdminData<Experience>("experiences")
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: Omit<Experience, "id">) => {
    setIsSaving(true)
    const supabase = createSupabaseClient()
    
    let error
    if (editingExperience) {
      const { error: err } = await supabase.from("experiences").update(data).eq("id", editingExperience.id)
      error = err
    } else {
      const { error: err } = await supabase.from("experiences").insert([data])
      error = err
    }

    if (error) {
      toast.error(`Save failed: ${error.message}`)
    } else {
      toast.success(editingExperience ? "Experience updated!" : "Experience added!")
      setEditingExperience(null)
      setIsAdding(false)
      refresh()
    }
    setIsSaving(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <AdminPageHeader 
        title="Work Experience" 
        description="Manage your professional timeline and career achievements."
        actionLabel={!(isAdding || editingExperience) ? "Add Experience" : undefined}
        onAction={() => setIsAdding(true)}
      />

      {(isAdding || editingExperience) ? (
        <div className="p-10 rounded-[3rem] border border-border bg-card shadow-sm animate-in fade-in slide-in-from-bottom-4">
           <h3 className="text-xl font-bold mb-8">{editingExperience ? "Edit Position" : "New Position"}</h3>
           <ExperienceForm 
              initialData={editingExperience || undefined} 
              onSave={handleSave} 
              isSaving={isSaving}
              onCancel={() => { setEditingExperience(null); setIsAdding(false); }}
           />
        </div>
      ) : (
        <div className="grid gap-4">
          {experiences.length === 0 && !loading && <AdminEmptyState message="No professional experience added yet." />}
          
          {experiences.map((exp) => (
            <div key={exp.id} className="p-6 rounded-[2rem] border border-border bg-card hover:border-primary/30 transition-all group flex items-start justify-between">
              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg">{exp.role}</h4>
                  <p className="text-primary font-medium text-sm">{exp.company}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {exp.duration}</span>
                    <span>• {exp.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setEditingExperience(exp)}
                  className="p-3 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteItem(exp.id)}
                  className="p-3 rounded-xl bg-muted hover:bg-destructive hover:text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
