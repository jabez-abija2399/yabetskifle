"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { ListRow } from "@/components/admin/ListRow"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { EditPanel } from "@/components/admin/EditPanel"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { EmptyState } from "@/components/admin/EmptyState"
import { ListSkeleton } from "@/components/admin/ListSkeleton"
import { ExperienceForm } from "../ExperienceForm"
import { Experience } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus, Briefcase } from "lucide-react"

export default function AdminExperiencePage() {
  const { data: exps, loading, refresh } = useAdminData<Experience>("experiences")
  const [editingExp, setEditingExp] = useState<Experience | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Experience | null>(null)
  const [deleting, setDeleting] = useState(false)

  const editing = isAdding || !!editingExp

  const handleSave = async (data: Omit<Experience, "id">) => {
    setIsSaving(true)
    const supabase = createSupabaseClient()
    const { error } = editingExp
      ? await supabase.from("experiences").update(data).eq("id", editingExp.id)
      : await supabase.from("experiences").insert([data])

    if (error) {
      toast.error(`Error: ${error.message}`)
    } else {
      toast.success(editingExp ? "Experience updated" : "Experience added")
      setEditingExp(null)
      setIsAdding(false)
      refresh()
    }
    setIsSaving(false)
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    const supabase = createSupabaseClient()
    const { error } = await supabase.from("experiences").delete().eq("id", pendingDelete.id)
    if (error) {
      toast.error(`Failed: ${error.message}`)
    } else {
      toast.success("Experience deleted")
      setPendingDelete(null)
      refresh()
    }
    setDeleting(false)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        index="02"
        title="Experience"
        description="Your professional timeline and milestones."
        actions={
          !editing && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="size-4" aria-hidden /> Add experience
            </Button>
          )
        }
      />

      {editing ? (
        <EditPanel
          eyebrow={editingExp ? "Editing" : "New"}
          title={editingExp ? `${editingExp.role} — ${editingExp.company}` : "Add a position"}
          onClose={() => {
            setEditingExp(null)
            setIsAdding(false)
          }}
        >
          <ExperienceForm
            initialData={editingExp || undefined}
            onSave={handleSave}
            isSaving={isSaving}
            onCancel={() => {
              setEditingExp(null)
              setIsAdding(false)
            }}
          />
        </EditPanel>
      ) : loading ? (
        <ListSkeleton rows={4} />
      ) : exps.length === 0 ? (
        <EmptyState
          title="No experience entries yet"
          description="Add the roles and milestones that shape your career story."
          action={
            <Button size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="size-3.5" aria-hidden /> Add your first entry
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {exps.map((exp) => (
            <ListRow
              key={exp.id}
              icon={<Briefcase className="size-4" />}
              dimmed={!exp.is_published}
              title={exp.role}
              meta={
                <>
                  {exp.company} <span className="text-accent">/</span> {exp.duration}
                </>
              }
              badge={!exp.is_published ? <StatusBadge variant="hidden" /> : undefined}
              actions={
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${exp.role}`}
                    onClick={() => setEditingExp(exp)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${exp.role}`}
                    onClick={() => setPendingDelete(exp)}
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
        title={`Delete the “${pendingDelete?.role}” entry?`}
        description="This removes the position from your public timeline. This cannot be undone."
        confirmLabel="Delete entry"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
