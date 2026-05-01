"use client"

import { useState } from "react"
import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { AdminEmptyState } from "@/components/ui/AdminEmptyState"
import { Project } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Pencil, Trash2, ExternalLink, EyeOff } from "lucide-react"
import Image from "next/image"
import { FaGithub } from "react-icons/fa"
import { ProjectForm } from "../ProjectForm"

export default function AdminProjectsPage() {
  const { data: projects, loading, deleteItem, refresh } = useAdminData<Project>("projects")
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: Omit<Project, "id" | "created_at">) => {
    setIsSaving(true)
    const supabase = createSupabaseClient()
    const { error } = editingProject 
      ? await supabase.from("projects").update(data).eq("id", editingProject.id)
      : await supabase.from("projects").insert([data])

    if (error) {
      toast.error(`Error: ${error.message}`)
    } else {
      toast.success("Portfolio item updated!")
      setEditingProject(null)
      setIsAdding(false)
      refresh()
    }
    setIsSaving(false)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <AdminPageHeader 
        title="Portfolio Curator" 
        description="Select and showcase your best work. High-quality imagery is recommended."
        actionLabel={!(isAdding || editingProject) ? "Add Project" : undefined}
        onAction={() => setIsAdding(true)}
      />

      {(isAdding || editingProject) ? (
        <div className="p-10 rounded-[3rem] border border-border bg-card shadow-2xl shadow-primary/5 animate-in fade-in slide-in-from-bottom-5">
           <h3 className="text-2xl font-black mb-10 italic">
              {editingProject ? `Editing "${editingProject.title}"` : "Defining New Project"}
           </h3>
           <ProjectForm 
              initialData={editingProject || undefined} 
              onSave={handleSave} 
              isSaving={isSaving}
              onCancel={() => { setEditingProject(null); setIsAdding(false); }}
           />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 && !loading && <AdminEmptyState message="Your exhibition is empty. Time to add your first project!" />}
          {projects.map((project) => (
            <div key={project.id} className={`group relative flex flex-col rounded-[2.5rem] border border-border bg-card overflow-hidden hover:border-primary/30 transition-all ${!project.is_published ? "grayscale-[0.8] opacity-75" : ""}`}>
              <div className="relative aspect-video bg-muted overflow-hidden">
                {project.images?.[0] ? (
                  <Image src={project.images[0]} alt={project.title} fill className="object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold uppercase tracking-widest text-xs">No Thumbnail</div>
                )}
                {/* Visibility Overlay */}
                {!project.is_published && (
                   <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-destructive text-white text-[8px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
                      <EyeOff size={12} /> Hidden
                   </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-lg tracking-tight leading-none">{project.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-1">{project.tags?.join(" • ")}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                   <div className="flex gap-2">
                      <button onClick={() => setEditingProject(project)} className="p-3 rounded-2xl bg-muted hover:bg-primary hover:text-primary-foreground transition-all">
                         <Pencil size={14} />
                      </button>
                      <button onClick={() => deleteItem(project.id)} className="p-3 rounded-2xl bg-muted hover:bg-destructive hover:text-white transition-all">
                         <Trash2 size={14} />
                      </button>
                   </div>
                   <div className="flex gap-2">
                     {project.github_url && <a href={project.github_url} target="_blank" className="p-3 rounded-2xl bg-zinc-900 text-white"><FaGithub size={14} /></a>}
                     {project.live_url && <a href={project.live_url} target="_blank" className="p-3 rounded-2xl bg-primary text-primary-foreground"><ExternalLink size={14} /></a>}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
