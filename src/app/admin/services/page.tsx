"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { ListRow } from "@/components/admin/ListRow"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { EditPanel } from "@/components/admin/EditPanel"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { EmptyState } from "@/components/admin/EmptyState"
import { ListSkeleton } from "@/components/admin/ListSkeleton"
import { ServiceForm } from "../ServiceForm"
import { Service } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { PortfolioService } from "@/services/portfolio"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus, Box, Code2, Layout, Database, Smartphone, Palette, Zap, Sparkles } from "lucide-react"

const IconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Code2, Layout, Database, Smartphone, Palette, Box, Zap, Sparkles,
}

export default function AdminServicesPage() {
  const { data: services, loading, refresh } = useAdminData<Service>("services")
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Service | null>(null)
  const [deleting, setDeleting] = useState(false)

  const editing = isAdding || !!editingService

  const handleSave = async (data: Omit<Service, "id">) => {
    setIsSaving(true)
    try {
      await PortfolioService.saveService({
        ...data,
        id: editingService?.id,
      } as Service)
      toast.success(editingService ? "Service updated" : "Service added")
      setEditingService(null)
      setIsAdding(false)
      refresh()
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : "Save failed"}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await PortfolioService.deleteService(pendingDelete.id)
      toast.success("Service deleted")
      setPendingDelete(null)
      refresh()
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Delete failed"}`)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        index="02"
        title="Services"
        description="What you offer to clients and collaborators."
        actions={
          !editing && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="size-4" aria-hidden /> Add service
            </Button>
          )
        }
      />

      {editing ? (
        <EditPanel
          eyebrow={editingService ? "Editing" : "New"}
          title={editingService ? editingService.title : "Add a service"}
          onClose={() => {
            setEditingService(null)
            setIsAdding(false)
          }}
        >
          <ServiceForm
            initialData={editingService || undefined}
            onSave={handleSave}
            isSaving={isSaving}
            onCancel={() => {
              setEditingService(null)
              setIsAdding(false)
            }}
          />
        </EditPanel>
      ) : loading ? (
        <ListSkeleton rows={4} />
      ) : services.length === 0 ? (
        <EmptyState
          title="No services yet"
          description="List what you offer so visitors know how to work with you."
          action={
            <Button size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="size-3.5" aria-hidden /> Add your first service
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {services.map((service) => {
            const Icon = IconMap[service.icon_name || "Box"] ?? Box
            return (
              <ListRow
                key={service.id}
                icon={<Icon size={18} />}
                dimmed={!service.is_published}
                title={service.title}
                meta={service.description}
                badge={
                  !service.is_published ? <StatusBadge variant="hidden" /> : undefined
                }
                actions={
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${service.title}`}
                      onClick={() => setEditingService(service)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${service.title}`}
                      onClick={() => setPendingDelete(service)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </>
                }
              />
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        title={`Delete “${pendingDelete?.title}”?`}
        description="This removes the service from the public site. This cannot be undone."
        confirmLabel="Delete service"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
