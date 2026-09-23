"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { ListRow } from "@/components/admin/ListRow"
import { EditPanel } from "@/components/admin/EditPanel"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { EmptyState } from "@/components/admin/EmptyState"
import { ListSkeleton } from "@/components/admin/ListSkeleton"
import { TextField, FormFooter } from "@/components/admin/fields"
import { PortfolioService } from "@/services/portfolio"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Pencil, Boxes } from "lucide-react"

interface Skill {
  id: string
  category_name: string
  technologies: string[]
  order_index?: number
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [editing, setEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [categoryName, setCategoryName] = useState("")
  const [techString, setTechString] = useState("")

  const [pendingDelete, setPendingDelete] = useState<Skill | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchSkills = async () => {
    try {
      const data = await PortfolioService.getSkills()
      setSkills(data as Skill[])
    } catch {
      toast.error("Failed to load skills.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await PortfolioService.getSkills()
        if (!cancelled) setSkills(data as Skill[])
      } catch {
        toast.error("Failed to load skills.")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const startAdd = () => {
    setEditing(true)
    setEditingId(null)
    setCategoryName("")
    setTechString("")
  }

  const startEdit = (skill: Skill) => {
    setEditing(true)
    setEditingId(skill.id)
    setCategoryName(skill.category_name)
    setTechString(skill.technologies.join(", "))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryName.trim()) return toast.error("Category name is required.")

    setIsSaving(true)
    try {
      await PortfolioService.saveSkill({
        id: editingId || undefined,
        category_name: categoryName,
        technologies: techString.split(",").map((s) => s.trim()).filter(Boolean),
        order_index: skills.length,
      })
      toast.success(editingId ? "Category updated" : "Category added")
      setEditing(false)
      setEditingId(null)
      setCategoryName("")
      setTechString("")
      fetchSkills()
    } catch {
      toast.error("Save failed. Check your database connection.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await PortfolioService.deleteSkill(pendingDelete.id)
      toast.success("Category deleted")
      setPendingDelete(null)
      fetchSkills()
    } catch {
      toast.error("Delete failed.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        index="04"
        title="Skills"
        description="Categorized tools and frameworks shown in the technical inventory."
        actions={
          !editing && (
            <Button onClick={startAdd}>
              <Plus className="size-4" aria-hidden /> Add category
            </Button>
          )
        }
      />

      {editing ? (
        <EditPanel
          eyebrow={editingId ? "Editing" : "New"}
          title={editingId ? categoryName : "Add a skill category"}
          onClose={() => {
            setEditing(false)
            setEditingId(null)
          }}
        >
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. Architecture & state"
                required
              />
              <TextField
                label="Tools (comma separated)"
                value={techString}
                onChange={(e) => setTechString(e.target.value)}
                placeholder="Next.js, React, TypeScript…"
              />
            </div>
            <p className="label-mono text-muted-foreground">
              Icons are mapped automatically from category names.
            </p>
            <FormFooter
              onCancel={() => {
                setEditing(false)
                setEditingId(null)
              }}
              isSaving={isSaving}
              submitLabel={editingId ? "Update category" : "Add category"}
            />
          </form>
        </EditPanel>
      ) : isLoading ? (
        <ListSkeleton rows={3} />
      ) : skills.length === 0 ? (
        <EmptyState
          title="No skill categories yet"
          description="Add your first category — e.g. “Frontend” or “Architecture & state”."
          action={
            <Button size="sm" onClick={startAdd}>
              <Plus className="size-3.5" aria-hidden /> Add a category
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {skills.map((skill) => (
            <ListRow
              key={skill.id}
              icon={<Boxes className="size-4" />}
              title={skill.category_name}
              meta={
                <span className="flex flex-wrap gap-1.5">
                  {skill.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-xs border border-border bg-secondary px-1.5 py-0.5 label-mono text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </span>
              }
              actions={
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${skill.category_name}`}
                    onClick={() => startEdit(skill)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${skill.category_name}`}
                    onClick={() => setPendingDelete(skill)}
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
        title={`Delete “${pendingDelete?.category_name}”?`}
        description="This removes the skill category from the public site. This cannot be undone."
        confirmLabel="Delete category"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
