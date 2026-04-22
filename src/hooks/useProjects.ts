import { useState, useEffect } from "react"
import { createSupabaseClient } from "@/lib/supabase"
import { Project } from "@/types/portfolio"
import { toast } from "sonner"

export const useProjects = () => {
  // 1. State starts as an empty array (not null or undefined!)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createSupabaseClient()

  // 2. Fetch ALL projects, sorted by order_index
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("order_index", { ascending: true })

      if (data) setProjects(data)
      if (error) toast.error("Could not load projects")
      setIsLoading(false)
    }

    fetchProjects()
  }, [])

  // 3. Add a new project
  const addProject = async (newProject: Omit<Project, "id">) => {
    const { data, error } = await supabase
      .from("projects")
      .insert(newProject)
      .select()
      .single()

    if (data) {
      // Optimistically add it to local state immediately
      setProjects((prev) => [...prev, data])
      toast.success("Project added!")
    }
    if (error) toast.error("Failed to add project")
  }

  // 4. Delete a project by its ID
  const deleteProject = async (id: string) => {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)

    if (!error) {
      // Remove it from local state immediately (optimistic update)
      setProjects((prev) => prev.filter((p) => p.id !== id))
      toast.success("Project deleted!")
    }
    if (error) toast.error("Failed to delete project")
  }

  return { projects, isLoading, addProject, deleteProject }
}
