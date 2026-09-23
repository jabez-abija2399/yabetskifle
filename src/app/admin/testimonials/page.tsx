"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { ListRow } from "@/components/admin/ListRow"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { EditPanel } from "@/components/admin/EditPanel"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { EmptyState } from "@/components/admin/EmptyState"
import { ListSkeleton } from "@/components/admin/ListSkeleton"
import { TestimonialForm } from "../TestimonialForm"
import { Testimonial } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus, Quote } from "lucide-react"

export default function AdminTestimonialsPage() {
  const { data: list, loading, refresh } = useAdminData<Testimonial>("testimonials")
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Testimonial | null>(null)
  const [deleting, setDeleting] = useState(false)

  const editing = isAdding || !!editingItem

  const handleSave = async (data: Omit<Testimonial, "id" | "created_at">) => {
    setIsSaving(true)
    const supabase = createSupabaseClient()
    const { error } = editingItem
      ? await supabase.from("testimonials").update(data).eq("id", editingItem.id)
      : await supabase.from("testimonials").insert([data])

    if (error) {
      toast.error(`Error: ${error.message}`)
    } else {
      toast.success(editingItem ? "Testimonial updated" : "Testimonial added")
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
    const { error } = await supabase.from("testimonials").delete().eq("id", pendingDelete.id)
    if (error) {
      toast.error(`Failed: ${error.message}`)
    } else {
      toast.success("Testimonial deleted")
      setPendingDelete(null)
      refresh()
    }
    setDeleting(false)
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        index="02"
        title="Testimonials"
        description="Social proof from clients and collaborators."
        actions={
          !editing && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="size-4" aria-hidden /> Add testimonial
            </Button>
          )
        }
      />

      {editing ? (
        <EditPanel
          eyebrow={editingItem ? "Editing" : "New"}
          title={editingItem ? editingItem.client_name : "Add a testimonial"}
          onClose={() => {
            setEditingItem(null)
            setIsAdding(false)
          }}
        >
          <TestimonialForm
            initialData={editingItem || undefined}
            onSave={handleSave}
            isSaving={isSaving}
            onCancel={() => {
              setEditingItem(null)
              setIsAdding(false)
            }}
          />
        </EditPanel>
      ) : loading ? (
        <ListSkeleton rows={3} />
      ) : list.length === 0 ? (
        <EmptyState
          title="No testimonials yet"
          description="Add a review from a client or teammate."
          action={
            <Button size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="size-3.5" aria-hidden /> Add your first testimonial
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {list.map((item) => (
            <ListRow
              key={item.id}
              dimmed={!item.is_published}
              icon={
                item.client_avatar ? (
                  <span className="relative block size-full overflow-hidden rounded-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.client_avatar} alt="" className="h-full w-full object-cover" />
                  </span>
                ) : (
                  <Quote className="size-4" />
                )
              }
              title={item.client_name}
              meta={
                <>
                  <span className="line-clamp-1">“{item.content}”</span>
                  <span className="mt-0.5 block label-mono text-muted-foreground">
                    {item.client_role} · {item.rating ?? 5}/5
                  </span>
                </>
              }
              badge={!item.is_published ? <StatusBadge variant="hidden" /> : undefined}
              actions={
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit testimonial from ${item.client_name}`}
                    onClick={() => setEditingItem(item)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete testimonial from ${item.client_name}`}
                    onClick={() => setPendingDelete(item)}
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
        title={`Delete the testimonial from ${pendingDelete?.client_name}?`}
        description="This removes the quote from the public site. This cannot be undone."
        confirmLabel="Delete testimonial"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
