"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { ListRow } from "@/components/admin/ListRow"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { EditPanel } from "@/components/admin/EditPanel"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { EmptyState } from "@/components/admin/EmptyState"
import { ListSkeleton } from "@/components/admin/ListSkeleton"
import { TextField, SwitchRow, FormFooter } from "@/components/admin/fields"
import { Language } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus, Languages } from "lucide-react"

export default function AdminLanguagesPage() {
  const { data: langs, loading, refresh } = useAdminData<Language>("languages")
  const [editingItem, setEditingItem] = useState<Language | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Language | null>(null)
  const [deleting, setDeleting] = useState(false)

  const editing = isAdding || !!editingItem

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      proficiency: formData.get("proficiency") as string,
      is_published: formData.get("is_published") === "on",
    }

    const supabase = createSupabaseClient()
    const { error } = editingItem
      ? await supabase.from("languages").update(data).eq("id", editingItem.id)
      : await supabase.from("languages").insert([data])

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(editingItem ? "Language updated" : "Language added")
      setEditingItem(null)
      setIsAdding(false)
      refresh()
    }
    setIsSaving(false)
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    const supabase = createSupabaseClient()
    const { error } = await supabase.from("languages").delete().eq("id", pendingDelete.id)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Language deleted")
      setPendingDelete(null)
      refresh()
    }
    setDeleting(false)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        index="03"
        title="Languages"
        description="Languages you speak and your proficiency."
        actions={
          !editing && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="size-4" aria-hidden /> Add language
            </Button>
          )
        }
      />

      {editing ? (
        <EditPanel
          eyebrow={editingItem ? "Editing" : "New"}
          title={editingItem ? editingItem.name : "Add a language"}
          onClose={() => {
            setEditingItem(null)
            setIsAdding(false)
          }}
        >
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Language"
                name="name"
                defaultValue={editingItem?.name}
                placeholder="English"
                required
              />
              <TextField
                label="Proficiency"
                name="proficiency"
                defaultValue={editingItem?.proficiency}
                placeholder="Native / Professional"
                required
              />
            </div>
            <SwitchRow
              name="is_published"
              label="Public visibility"
              defaultChecked={editingItem?.is_published ?? true}
            />
            <FormFooter
              onCancel={() => {
                setEditingItem(null)
                setIsAdding(false)
              }}
              isSaving={isSaving}
              submitLabel="Save language"
            />
          </form>
        </EditPanel>
      ) : loading ? (
        <ListSkeleton rows={3} />
      ) : langs.length === 0 ? (
        <EmptyState
          title="No languages listed"
          description="Add the languages you speak."
          action={
            <Button size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="size-3.5" aria-hidden /> Add a language
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {langs.map((lang) => (
            <ListRow
              key={lang.id}
              icon={<Languages className="size-4" />}
              dimmed={!lang.is_published}
              title={lang.name}
              meta={
                <span className="label-mono">
                  {lang.proficiency}
                </span>
              }
              badge={!lang.is_published ? <StatusBadge variant="hidden" /> : undefined}
              actions={
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${lang.name}`}
                    onClick={() => setEditingItem(lang)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${lang.name}`}
                    onClick={() => setPendingDelete(lang)}
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
        title={`Delete “${pendingDelete?.name}”?`}
        description="This removes the language from the public site. This cannot be undone."
        confirmLabel="Delete language"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
