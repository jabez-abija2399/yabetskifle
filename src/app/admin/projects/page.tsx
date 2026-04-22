"use client"

import { useState } from "react"
import { useProjects } from "@/hooks/useProjects"
import { Project } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ProjectModal } from "@/components/admin/ProjectModal"
import { FaGithub } from "react-icons/fa"
import { Trash2, Plus, ExternalLink, Pencil } from "lucide-react"

// Controls what the modal is doing
type ModalMode = "add" | "edit" | "closed"

export default function AdminProjectsPage() {
  const { projects, isLoading, addProject, updateProject, deleteProject } = useProjects()

  // One state controls both the modal visibility AND what it shows
  const [modalMode, setModalMode] = useState<ModalMode>("closed")
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Opens Add modal
  const openAdd = () => {
    setEditingProject(null)
    setModalMode("add")
  }

  // Opens Edit modal with project data
  const openEdit = (project: Project) => {
    setEditingProject(project)
    setModalMode("edit")
  }

  // Closes the modal
  const closeModal = () => {
    setModalMode("closed")
    setEditingProject(null)
  }

  // Handles both Add and Edit submit
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

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 space-y-8">

      {/* Page Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""} total
          </p>
        </div>
        {/* This is the ONLY trigger to open the Add form */}
        <Button onClick={openAdd} className="gap-2 rounded-full px-6">
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {/* Projects List — clean, no forms here */}
      {!isLoading && (
        <div className="space-y-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="flex flex-row items-center justify-between p-4 gap-4 hover:border-border transition-colors"
            >
              {/* Left: project info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Thumbnail if exists */}
                {project.images?.[0] && (
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-14 h-14 rounded-lg object-cover shrink-0 border border-border"
                  />
                )}
                <div className="min-w-0">
                  <p className="font-bold truncate">{project.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                      {project.project_type}
                    </span>
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: action buttons */}
              <div className="flex gap-2 shrink-0">
                {project.live_url && (
                  <Button asChild size="icon" variant="ghost">
                    <a href={project.live_url} target="_blank"><ExternalLink className="w-4 h-4" /></a>
                  </Button>
                )}
                {project.github_url && (
                  <Button asChild size="icon" variant="ghost">
                    <a href={project.github_url} target="_blank"><FaGithub className="w-4 h-4" /></a>
                  </Button>
                )}
                {/* Opens the Edit modal with this project's data */}
                <Button size="icon" variant="outline" onClick={() => openEdit(project)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => deleteProject(project.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}

          {projects.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">No projects yet.</p>
              <p className="text-sm">Click "Add Project" to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Single Modal — used for both Add and Edit */}
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
