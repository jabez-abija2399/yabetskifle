"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { ListRow } from "@/components/admin/ListRow"
import { EditPanel } from "@/components/admin/EditPanel"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { EmptyState } from "@/components/admin/EmptyState"
import { ListSkeleton } from "@/components/admin/ListSkeleton"
import { EducationForm } from "../EducationForm"
import { Education } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus, GraduationCap } from "lucide-react"

export default function AdminEducationPage() {
  const { data: education, loading, refresh } = useAdminData<Education>("education")
  const [editingEdu, setEditingEdu] = useState<Education | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Education | null>(null)
  const [deleting, setDeleting] = useState(false)

  const editing = isAdding || !!editingEdu

  const handleSave = async (data: Omit<Education, "id">) => {
    setIsSaving(true)
    const supabase = createSupabaseClient()
    const { error } = editingEdu
      ? await supabase.from("education").update(data).eq("id", editingEdu.id)
      : await supabase.from("education").insert([data])

    if (error) {
      toast.error(`Error: ${error.message}`)
    } else {
      toast.success(editingEdu ? "Education updated" : "Education added")
      setEditingEdu(null)
      setIsAdding(false)
      refresh()
    }
    setIsSaving(false)
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    const supabase = createSupabaseClient()
    const { error } = await supabase.from("education").delete().eq("id", pendingDelete.id)
    if (error) {
      toast.error(`Failed: ${error.message}`)
    } else {
      toast.success("Education deleted")
      setPendingDelete(null)
      refresh()
    }
    setDeleting(false)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        index="04"
        title="Education"
        description="Your academic journey and degrees."
        actions={
          !editing && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="size-4" aria-hidden /> Add education
            </Button>
          )
        }
      />

      {editing ? (
        <EditPanel
          eyebrow={editingEdu ? "Editing" : "New"}
          title={editingEdu ? `${editingEdu.degree} — ${editingEdu.institution}` : "Add education"}
          onClose={() => {
            setEditingEdu(null)
            setIsAdding(false)
          }}
        >
          <EducationForm
            initialData={editingEdu || undefined}
            onSave={handleSave}
            isSaving={isSaving}
            onCancel={() => {
              setEditingEdu(null)
              setIsAdding(false)
            }}
          />
        </EditPanel>
      ) : loading ? (
        <ListSkeleton rows={3} />
      ) : education.length === 0 ? (
        <EmptyState
          title="No education history yet"
          description="Add your degrees and academic milestones."
          action={
            <Button size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="size-3.5" aria-hidden /> Add your first entry
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {education.map((edu) => (
            <ListRow
              key={edu.id}
              icon={<GraduationCap className="size-4" />}
              title={edu.degree}
              meta={
                <>
                  {edu.institution} <span className="text-accent">/</span> {edu.duration}
                </>
              }
              actions={
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${edu.degree}`}
                    onClick={() => setEditingEdu(edu)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${edu.degree}`}
                    onClick={() => setPendingDelete(edu)}
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
        title={`Delete the ${pendingDelete?.degree} entry?`}
        description="This removes the entry from your public timeline. This cannot be undone."
        confirmLabel="Delete entry"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
