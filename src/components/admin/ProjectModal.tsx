// A reusable modal that wraps our ProjectForm
// It can be opened for both Add and Edit modes
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProjectForm } from "./ProjectForm"
import { Project } from "@/types/portfolio"

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  editingProject?: Project | null   // null = Add mode, Project = Edit mode
  isSaving: boolean
  onSubmit: (data: Omit<Project, "id">) => Promise<void>
}

export const ProjectModal = ({
  isOpen,
  onClose,
  editingProject,
  isSaving,
  onSubmit,
}: ProjectModalProps) => {
  const isEditMode = !!editingProject

  return (
    // Dialog handles Escape key, backdrop click, and focus trap automatically
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold">
            {isEditMode ? `Editing: ${editingProject.title}` : "Add New Project"}
          </DialogTitle>
        </DialogHeader>

        {/* The same reusable form — mode is determined by initialData */}
        <ProjectForm
          initialData={editingProject ?? undefined}
          isSaving={isSaving}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
