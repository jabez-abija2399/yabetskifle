"use client"

import { useState } from "react"
import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { AdminEmptyState } from "@/components/ui/AdminEmptyState"
import { EducationForm } from "../EducationForm" // Adjust path if needed
import { Education } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Pencil, Trash2, GraduationCap } from "lucide-react"

export default function AdminEducationPage() {
  const { data: education, loading, deleteItem, refresh } = useAdminData<Education>("education")
  const [editingEdu, setEditingEdu] = useState<Education | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: Omit<Education, "id">) => {
    setIsSaving(true)
    const supabase = createSupabaseClient()
    const { error } = editingEdu 
      ? await supabase.from("education").update(data).eq("id", editingEdu.id)
      : await supabase.from("education").insert([data])

    if (error) {
      toast.error(`Error: ${error.message}`)
    } else {
      toast.success("Education updated!")
      setEditingEdu(null)
      setIsAdding(false)
      refresh()
    }
    setIsSaving(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AdminPageHeader 
        title="Education History" 
        description="Showcase your academic journey and degrees."
        actionLabel={!(isAdding || editingEdu) ? "Add Education" : undefined}
        onAction={() => setIsAdding(true)}
      />

      {(isAdding || editingEdu) ? (
        <div className="p-10 rounded-[3rem] border border-border bg-card shadow-sm">
           <h3 className="text-xl font-bold mb-6">{editingEdu ? "Edit Education" : "Add Education"}</h3>
           <EducationForm 
              initialData={editingEdu || undefined} 
              onSave={handleSave} 
              isSaving={isSaving}
              onCancel={() => { setEditingEdu(null); setIsAdding(false); }}
           />
        </div>
      ) : (
        <div className="space-y-4">
          {education.length === 0 && !loading && <AdminEmptyState message="No education history added yet." />}
          {education.map((edu) => (
            <div key={edu.id} className="p-6 rounded-[2rem] border border-border bg-card flex items-center justify-between group">
              <div className="flex gap-4 items-center">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <GraduationCap className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="font-bold text-lg">{edu.degree}</h4>
                    <p className="text-sm text-primary font-medium">{edu.institution}</p>
                    <p className="text-xs text-muted-foreground">{edu.duration}</p>
                 </div>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditingEdu(edu)} className="p-3 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => deleteItem(edu.id)} className="p-3 rounded-xl bg-muted hover:bg-destructive hover:text-white transition-colors">
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
