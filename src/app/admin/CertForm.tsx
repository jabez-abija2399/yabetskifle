"use client"

import { useState } from "react"
import { Certification } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { Loader2, Award } from "lucide-react"
import Image from "next/image"

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
           <label className="text-sm font-semibold text-zinc-400">Issuer Logo</label>
           <div className="relative w-24 h-24 rounded-2xl border-2 border-border overflow-hidden bg-muted flex items-center justify-center">
              {logo ? <Image src={logo} alt="Logo" fill className="object-cover" /> : <Award className="w-8 h-8 text-zinc-500" />}
           </div>
           <ImageUploader onUpload={setLogo} />
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-zinc-400">Certification Name</label>
            <Input name="title" defaultValue={initialData?.title} required placeholder="AWS Certified Solutions Architect" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-zinc-400">Issuer</label>
            <Input name="issuer" defaultValue={initialData?.issuer} required placeholder="Amazon Web Services" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-zinc-400">Date Issued</label>
          <Input name="issued_at" defaultValue={initialData?.issued_at} placeholder="Dec 2023" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-zinc-400">Credential URL</label>
          <Input name="credential_url" defaultValue={initialData?.credential_url} placeholder="https://..." />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSaving} className="rounded-xl px-10 h-12 font-black shadow-xl shadow-primary/20">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Record" : "Add Record"}
        </Button>
      </div>
    </form>
  )

}