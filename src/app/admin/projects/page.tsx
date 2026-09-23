"use client"

import { useState } from "react"
import Image from "next/image"
import { PageHeader } from "@/components/admin/PageHeader"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { EditPanel } from "@/components/admin/EditPanel"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { EmptyState } from "@/components/admin/EmptyState"
import { ListSkeleton } from "@/components/admin/ListSkeleton"
import { ProjectForm } from "../ProjectForm"
import { Project } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus, ExternalLink, ImageOff } from "lucide-react"
import { FaGithub } from "react-icons/fa"

export default function AdminProjectsPage() {
  const { data: projects, loading, refresh } = useAdminData<Project>("projects")
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState(false)

  const editing = isAdding || !!editingProject

  const handleSave = async (data: Omit<Project, "id" | "created_at">) => {
    setIsSaving(true)
    const supabase = createSupabaseClient()
    const { error } = editingProject
      ? await supabase.from("projects").update(data).eq("id", editingProject.id)
      : await supabase.from("projects").insert([data])

    if (error) {
      toast.error(`Error: ${error.message}`)
    } else {
      toast.success(editingProject ? "Project updated" : "Project added")
      setEditingProject(null)
      setIsAdding(false)
      refresh()
    }
    setIsSaving(false)
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    const supabase = createSupabaseClient()
    const { error } = await supabase.from("projects").delete().eq("id", pendingDelete.id)
    if (error) {
      toast.error(`Failed: ${error.message}`)
    } else {
      toast.success("Project deleted")
      setPendingDelete(null)
      refresh()
    }
    setDeleting(false)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        index="02"
        title="Projects"
        description="Curate your portfolio. High-quality imagery is recommended."
        actions={
          !editing && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="size-4" aria-hidden /> Add project
            </Button>
          )
        }
      />

      {editing ? (
        <EditPanel
          eyebrow={editingProject ? "Editing" : "New"}
          title={editingProject ? editingProject.title : "Define a new project"}
          onClose={() => {
            setEditingProject(null)
            setIsAdding(false)
          }}
        >
          <ProjectForm
            initialData={editingProject || undefined}
            onSave={handleSave}
            isSaving={isSaving}
            onCancel={() => {
              setEditingProject(null)
              setIsAdding(false)
            }}
          />
        </EditPanel>
      ) : loading ? (
        <ListSkeleton rows={3} />
      ) : projects.length === 0 ? (
        <EmptyState
          title="Your exhibition is empty"
          description="Add your first project to start building the portfolio."
          action={
            <Button size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="size-3.5" aria-hidden /> Add your first project
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`group flex flex-col overflow-hidden rounded-xs border border-border bg-card transition-colors hover:border-accent/60 ${
                !project.is_published ? "opacity-75" : ""
              }`}
            >
              <div className="relative aspect-video overflow-hidden border-b border-border bg-muted">
                {project.images?.[0] ? (
                  <Image
                    src={project.images[0]}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <ImageOff className="size-5" aria-hidden />
                  </div>
                )}
                {!project.is_published && (
                  <span className="absolute left-2 top-2">
                    <StatusBadge variant="hidden" />
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-semibold tracking-tight">
                    {project.title}
                  </h4>
                  <p className="mt-0.5 truncate label-mono text-muted-foreground">
                    {project.tags?.join(" • ")}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${project.title}`}
                      onClick={() => setEditingProject(project)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${project.title}`}
                      onClick={() => setPendingDelete(project)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    {project.github_url && (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        aria-label={`Open ${project.title} on GitHub`}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <FaGithub className="size-4" />
                        </a>
                      </Button>
                    )}
                    {project.live_url && (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        aria-label={`Open ${project.title} live site`}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="size-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        title={`Delete “${pendingDelete?.title}”?`}
        description="This removes the project from the public site. This cannot be undone."
        confirmLabel="Delete project"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
