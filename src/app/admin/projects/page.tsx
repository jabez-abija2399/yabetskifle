"use client"

import { useState } from "react"
import { useProjects } from "@/hooks/useProjects"
import { Project } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ProjectForm } from "@/components/admin/ProjectForm"  // ← new import
import { FaGithub } from "react-icons/fa"
import { Trash2, Plus, ExternalLink, Pencil, X } from "lucide-react"

export default function AdminProjectsPage() {
  const { projects, isLoading, addProject, updateProject, deleteProject } = useProjects()
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Add handler — passed to the form
  const handleAdd = async (data: Omit<Project, "id">) => {
    setIsSaving(true)
    await addProject(data)
    setIsSaving(false)
  }

  // Edit handler — passed to the form
  const handleEdit = async (data: Omit<Project, "id">) => {
    if (!editingProject) return
    setIsSaving(true)
    await updateProject(editingProject.id, data)
    setIsSaving(false)
    setEditingProject(null)
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 space-y-10">

      {/* ADD Form */}
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold flex items-center gap-2">
            <Plus className="w-6 h-6" /> Add New Project
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* ✅ Reusable form in "Add" mode — no initialData */}
          <ProjectForm isSaving={isSaving} onSubmit={handleAdd} />
        </CardContent>
      </Card>

      {/* Projects List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Existing Projects ({projects.length})</h2>
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-row items-center justify-between p-4 gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">{project.title}</p>
              <p className="text-sm text-muted-foreground truncate">{project.description}</p>
              <div className="flex gap-1 mt-1 flex-wrap">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
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
              <Button size="icon" variant="outline" onClick={() => setEditingProject(project)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="destructive" onClick={() => deleteProject(project.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
        {!isLoading && projects.length === 0 && (
          <p className="text-muted-foreground text-sm">No projects yet!</p>
        )}
      </div>

      {/* EDIT Form — appears when a project is selected */}
      {editingProject && (
        <Card className="shadow-2xl border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-extrabold flex items-center gap-2">
              <Pencil className="w-5 h-5" /> Editing: {editingProject.title}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setEditingProject(null)}>
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent>
            {/* ✅ Same form in "Edit" mode — initialData fills all fields */}
            <ProjectForm
              initialData={editingProject}
              isSaving={isSaving}
              onSubmit={handleEdit}
              onCancel={() => setEditingProject(null)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
