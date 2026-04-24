"use client"

import { useState } from "react"
import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { AdminEmptyState } from "@/components/ui/AdminEmptyState"
import { CertForm } from "../CertForm"
import { Certification } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Pencil, Trash2, Award, ExternalLink } from "lucide-react"

export default function AdminCertificationsPage() {
  const { data: certs, loading, deleteItem, refresh } = useAdminData<Certification>("certifications")
  const [editingCert, setEditingCert] = useState<Certification | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: Omit<Certification, "id">) => {
    setIsSaving(true)
    const supabase = createSupabaseClient()
    const { error } = editingCert 
      ? await supabase.from("certifications").update(data).eq("id", editingCert.id)
      : await supabase.from("certifications").insert([data])

    if (error) {
      toast.error(`Error: ${error.message}`)
    } else {
      toast.success("Certification saved!")
      setEditingCert(null)
      setIsAdding(false)
      refresh()
    }
    setIsSaving(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <AdminPageHeader 
        title="Certifications" 
        description="Showcase your professional credentials and verified skills."
        actionLabel={!(isAdding || editingCert) ? "Add Certification" : undefined}
        onAction={() => setIsAdding(true)}
      />

      {(isAdding || editingCert) ? (
        <div className="p-8 rounded-[2.5rem] border border-border bg-card shadow-sm">
           <h3 className="text-xl font-bold mb-6">{editingCert ? "Edit Certification" : "New Certification"}</h3>
           <CertForm 
              initialData={editingCert || undefined} 
              onSave={handleSave} 
              isSaving={isSaving}
              onCancel={() => { setEditingCert(null); setIsAdding(false); }}
           />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {certs.length === 0 && !loading && <AdminEmptyState message="No certifications added yet." />}
          {certs.map((cert) => (
            <div key={cert.id} className="p-6 rounded-[2rem] border border-border bg-card flex items-center justify-between group">
              <div className="flex gap-4 items-center">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Award className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="font-bold text-lg">{cert.title}</h4>
                    <p className="text-sm text-primary font-medium">{cert.issuer}</p>
                    <p className="text-xs text-muted-foreground">{cert.issued_at}</p>
                 </div>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {cert.credential_url && (
                  <a href={cert.credential_url} target="_blank" className="p-3 rounded-xl bg-muted hover:bg-zinc-800 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button onClick={() => setEditingCert(cert)} className="p-3 rounded-xl bg-muted hover:bg-primary hover:text-white transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => deleteItem(cert.id)} className="p-3 rounded-xl bg-muted hover:bg-destructive hover:text-white transition-colors">
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
