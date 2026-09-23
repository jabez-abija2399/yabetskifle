"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { ListRow } from "@/components/admin/ListRow"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { EditPanel } from "@/components/admin/EditPanel"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { EmptyState } from "@/components/admin/EmptyState"
import { ListSkeleton } from "@/components/admin/ListSkeleton"
import { TextField, TextAreaField, SwitchRow, FormFooter } from "@/components/admin/fields"
import { FAQ } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus, HelpCircle } from "lucide-react"

export default function AdminFAQPage() {
  const { data: faqs, loading, refresh } = useAdminData<FAQ>("faqs")
  const [editingItem, setEditingItem] = useState<FAQ | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<FAQ | null>(null)
  const [deleting, setDeleting] = useState(false)

  const editing = isAdding || !!editingItem

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      question: formData.get("question") as string,
      answer: formData.get("answer") as string,
      category: formData.get("category") as string,
      order_index: parseInt(formData.get("order_index") as string) || 0,
      is_published: formData.get("is_published") === "on",
    }

    const supabase = createSupabaseClient()
    const { error } = editingItem
      ? await supabase.from("faqs").update(data).eq("id", editingItem.id)
      : await supabase.from("faqs").insert([data])

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(editingItem ? "FAQ updated" : "FAQ added")
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
    const { error } = await supabase.from("faqs").delete().eq("id", pendingDelete.id)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("FAQ deleted")
      setPendingDelete(null)
      refresh()
    }
    setDeleting(false)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        index="03"
        title="FAQs"
        description="Answer visitors’ questions before they ask."
        actions={
          !editing && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="size-4" aria-hidden /> Add FAQ
            </Button>
          )
        }
      />

      {editing ? (
        <EditPanel
          eyebrow={editingItem ? "Editing" : "New"}
          title={editingItem ? editingItem.question : "Add a question"}
          onClose={() => {
            setEditingItem(null)
            setIsAdding(false)
          }}
        >
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Question"
                name="question"
                defaultValue={editingItem?.question}
                placeholder="Do you take freelance work?"
                required
              />
              <TextField
                label="Category"
                name="category"
                defaultValue={editingItem?.category}
                placeholder="e.g. Services"
                required
              />
            </div>
            <TextAreaField
              label="Answer"
              name="answer"
              defaultValue={editingItem?.answer}
              rows={4}
              required
              placeholder="The answer…"
            />
            <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
              <TextField
                label="Sort order"
                name="order_index"
                type="number"
                defaultValue={editingItem?.order_index || 0}
              />
              <div className="sm:col-span-2">
                <SwitchRow
                  name="is_published"
                  label="Public visibility"
                  defaultChecked={editingItem?.is_published ?? true}
                />
              </div>
            </div>
            <FormFooter
              onCancel={() => {
                setEditingItem(null)
                setIsAdding(false)
              }}
              isSaving={isSaving}
              submitLabel="Save FAQ"
            />
          </form>
        </EditPanel>
      ) : loading ? (
        <ListSkeleton rows={4} />
      ) : faqs.length === 0 ? (
        <EmptyState
          title="No FAQs yet"
          description="Add the questions you hear most often."
          action={
            <Button size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="size-3.5" aria-hidden /> Add your first FAQ
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {faqs.map((faq) => (
            <ListRow
              key={faq.id}
              icon={<HelpCircle className="size-4" />}
              dimmed={!faq.is_published}
              title={faq.question}
              meta={faq.category}
              badge={!faq.is_published ? <StatusBadge variant="hidden" /> : undefined}
              actions={
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${faq.question}`}
                    onClick={() => setEditingItem(faq)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${faq.question}`}
                    onClick={() => setPendingDelete(faq)}
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
        title="Delete this FAQ?"
        description={`“${pendingDelete?.question}” will be removed from the public site. This cannot be undone.`}
        confirmLabel="Delete FAQ"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
