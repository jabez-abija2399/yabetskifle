"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { ListRow } from "@/components/admin/ListRow"
import { EditPanel } from "@/components/admin/EditPanel"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { EmptyState } from "@/components/admin/EmptyState"
import { ListSkeleton } from "@/components/admin/ListSkeleton"
import { CertForm } from "../CertForm"
import { Certification } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus, Award, ExternalLink } from "lucide-react"

export default function AdminCertificationsPage() {
  const { data: certs, loading, refresh } = useAdminData<Certification>("certifications")
  const [editingCert, setEditingCert] = useState<Certification | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Certification | null>(null)
  const [deleting, setDeleting] = useState(false)

  const editing = isAdding || !!editingCert

  const handleSave = async (data: Omit<Certification, "id">) => {
    setIsSaving(true)
    const supabase = createSupabaseClient()
    const { error } = editingCert
      ? await supabase.from("certifications").update(data).eq("id", editingCert.id)
      : await supabase.from("certifications").insert([data])

    if (error) {
      toast.error(`Error: ${error.message}`)
    } else {
      toast.success(editingCert ? "Certification updated" : "Certification added")
      setEditingCert(null)
      setIsAdding(false)
      refresh()
    }
    setIsSaving(false)
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    const supabase = createSupabaseClient()
    const { error } = await supabase.from("certifications").delete().eq("id", pendingDelete.id)
    if (error) {
      toast.error(`Failed: ${error.message}`)
    } else {
      toast.success("Certification deleted")
      setPendingDelete(null)
      refresh()
    }
    setDeleting(false)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        index="04"
        title="Certifications"
        description="Professional credentials and verified skills."
        actions={
          !editing && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="size-4" aria-hidden /> Add certification
            </Button>
          )
        }
      />

      {editing ? (
        <EditPanel
          eyebrow={editingCert ? "Editing" : "New"}
          title={editingCert ? editingCert.title : "Add a certification"}
          onClose={() => {
            setEditingCert(null)
            setIsAdding(false)
          }}
        >
          <CertForm
            initialData={editingCert || undefined}
            onSave={handleSave}
            isSaving={isSaving}
            onCancel={() => {
              setEditingCert(null)
              setIsAdding(false)
            }}
          />
        </EditPanel>
      ) : loading ? (
        <ListSkeleton rows={3} />
      ) : certs.length === 0 ? (
        <EmptyState
          title="No certifications yet"
          description="Add your professional credentials."
          action={
            <Button size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="size-3.5" aria-hidden /> Add your first certification
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {certs.map((cert) => (
            <ListRow
              key={cert.id}
              icon={<Award className="size-4" />}
              title={cert.title}
              meta={
                <>
                  {cert.issuer} <span className="text-accent">/</span> {cert.issued_at}
                </>
              }
              actions={
                <>
                  {cert.credential_url && (
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      aria-label={`Open credential for ${cert.title}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <a href={cert.credential_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="size-4" />
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${cert.title}`}
                    onClick={() => setEditingCert(cert)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${cert.title}`}
                    onClick={() => setPendingDelete(cert)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </>
              }
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        title={`Delete “${pendingDelete?.title}”?`}
        description="This removes the credential from the public site. This cannot be undone."
        confirmLabel="Delete certification"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
