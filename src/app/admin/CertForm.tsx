"use client"

import { useState } from "react"
import { Certification } from "@/types/portfolio"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { TextField, FormFooter, FormSection } from "@/components/admin/fields"
import { Award } from "lucide-react"

interface Props {
  initialData?: Certification
  onSave: (data: Omit<Certification, "id">) => Promise<void>
  isSaving: boolean
  onCancel: () => void
}

export const CertForm = ({ initialData, onSave, isSaving, onCancel }: Props) => {
  const [logo, setLogo] = useState(initialData?.logo_url || "")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await onSave({
      title: formData.get("title") as string,
      issuer: formData.get("issuer") as string,
      issued_at: formData.get("issued_at") as string,
      credential_url: formData.get("credential_url") as string,
      logo_url: logo,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormSection title="Credential">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-3">
            <span className="label-mono text-muted-foreground">
              Issuer logo
            </span>
            <div className="flex size-24 items-center justify-center overflow-hidden rounded-xs border border-border bg-muted">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt="" className="h-full w-full object-cover" />
              ) : (
                <Award className="size-8 text-muted-foreground" aria-hidden />
              )}
            </div>
            <ImageUploader onUpload={setLogo} />
          </div>
          <div className="grid gap-4 sm:col-span-2">
            <TextField
              label="Certification name"
              name="title"
              defaultValue={initialData?.title}
              placeholder="AWS Certified Solutions Architect"
              required
            />
            <TextField
              label="Issuer"
              name="issuer"
              defaultValue={initialData?.issuer}
              placeholder="Amazon Web Services"
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Date issued"
                name="issued_at"
                defaultValue={initialData?.issued_at}
                placeholder="Dec 2023"
              />
              <TextField
                label="Credential URL"
                name="credential_url"
                defaultValue={initialData?.credential_url}
                placeholder="https://…"
              />
            </div>
          </div>
        </div>
      </FormSection>

      <FormFooter
        onCancel={onCancel}
        isSaving={isSaving}
        submitLabel={initialData ? "Update certification" : "Add certification"}
      />
    </form>
  )
}
