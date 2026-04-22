"use client"

import { useState } from "react"
import { useProjects } from "@/hooks/useProjects"
import { Project } from "@/types/portfolio"
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { ProjectListItem } from "@/components/admin/ProjectListItem"
import { ProjectModal } from "@/components/admin/ProjectModal"
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton"
import { EmptyState } from "@/components/ui/EmptyState"
import { Code2 } from "lucide-react"

type ModalMode = "add" | "edit" | "closed"

export default function AdminProjectsPage() {
  const { projects, isLoading, addProject, updateProject, deleteProject } = useProjects()
  const [modalMode, setModalMode] = useState<ModalMode>("closed")
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const openAdd = () => { setEditingProject(null); setModalMode("add") }
  const openEdit = (p: Project) => { setEditingProject(p); setModalMode("edit") }
  const closeModal = () => { setModalMode("closed"); setEditingProject(null) }

  const handleSubmit = async (data: Omit<Project, "id">) => {
    setIsSaving(true)
    if (modalMode === "edit" && editingProject) {
      await updateProject(editingProject.id, data)
    } else {
      await addProject(data)
    }
    setIsSaving(false)
    closeModal()
  }
  const handleToggleFeatured = async (id: string, featured: boolean) => {
  await updateProject(id, {
    // We only change the featured field, keep everything else
    ...projects.find((p) => p.id === id)!,
    featured,
  })
}


  return (
    <div className="max-w-4xl mx-auto py-16 px-6 space-y-8">

      {/* ✅ Clean: one line for the header */}
      <AdminPageHeader
        title="Projects"
        subtitle={`${projects.length} project${projects.length !== 1 ? "s" : ""} total`}
        onAdd={openAdd}
        addLabel="Add Project"
      />

      {/* ✅ Clean: one line for loading state */}
      {isLoading && <LoadingSkeleton rows={3} />}

      {/* ✅ Clean: one line per list item */}
      {!isLoading && (
        <div className="space-y-3">
          {projects.map((project) => (
            <ProjectListItem
              key={project.id}
              project={project}
              onEdit={openEdit}
              onDelete={deleteProject}
              onToggleFeatured={handleToggleFeatured}
            />
          ))}
          {projects.length === 0 && (
            <EmptyState
              icon={Code2}
              title="No projects yet"
              description='Click "Add Project" to get started'
            />
          )}
        </div>
      )}

      {/* ✅ Clean: one line for the modal */}
      <ProjectModal
        isOpen={modalMode !== "closed"}
        onClose={closeModal}
        editingProject={editingProject}
        isSaving={isSaving}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
