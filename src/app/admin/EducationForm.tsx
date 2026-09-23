"use client"

import { Education } from "@/types/portfolio"
import { TextField, FormFooter, FormSection } from "@/components/admin/fields"

interface Props {
  initialData?: Education
  onSave: (data: Omit<Education, "id">) => Promise<void>
  isSaving: boolean
  onCancel: () => void
}

export const EducationForm = ({ initialData, onSave, isSaving, onCancel }: Props) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await onSave({
      institution: formData.get("institution") as string,
      degree: formData.get("degree") as string,
      field_of_study: formData.get("field_of_study") as string,
      duration: formData.get("duration") as string,
      grade: formData.get("grade") as string,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormSection title="Academic details">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Institution"
            name="institution"
            defaultValue={initialData?.institution}
            placeholder="MIT, Stanford, etc."
            required
          />
          <TextField
            label="Degree"
            name="degree"
            defaultValue={initialData?.degree}
            placeholder="Bachelor of Science"
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            label="Field of study"
            name="field_of_study"
            defaultValue={initialData?.field_of_study}
            placeholder="Computer Science"
          />
          <TextField
            label="Duration"
            name="duration"
            defaultValue={initialData?.duration}
            placeholder="2018 – 2022"
          />
          <TextField
            label="Grade (optional)"
            name="grade"
            defaultValue={initialData?.grade}
            placeholder="GPA: 3.9"
          />
        </div>
      </FormSection>

      <FormFooter
        onCancel={onCancel}
        isSaving={isSaving}
        submitLabel={initialData ? "Update education" : "Add education"}
      />
    </form>
  )
}
