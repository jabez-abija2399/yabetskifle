"use client"

import { useState } from "react"
import { SiteSettings } from "@/types/portfolio"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { TextField, TextAreaField, FormFooter, FormSection } from "@/components/admin/fields"
import { Settings, Mail, FileDown, Search, Image as ImageIcon } from "lucide-react"

interface Props {
  initialData: SiteSettings
  onSave: (data: SiteSettings) => Promise<void>
  isSaving: boolean
}

export const SettingsForm = ({ initialData, onSave, isSaving }: Props) => {
  const [favicon, setFavicon] = useState(initialData.favicon_url || "")
  const [logo, setLogo] = useState(initialData.logo_url || "")
  const [cv, setCv] = useState(initialData.cv_url || "")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    await onSave({
      ...initialData,
      site_name: formData.get("site_name") as string,
      site_description: formData.get("site_description") as string,
      meta_keywords: formData.get("meta_keywords") as string,
      footer_text: formData.get("footer_text") as string,
      contact_email: formData.get("contact_email") as string,
      google_analytics_id: formData.get("google_analytics_id") as string,
      favicon_url: favicon,
      logo_url: logo,
      cv_url: cv,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <FormSection title="SEO & branding" icon={<Search className="size-4" />}>
          <TextField
            label="Site name"
            name="site_name"
            defaultValue={initialData.site_name}
            required
          />
          <TextAreaField
            label="Global description"
            name="site_description"
            defaultValue={initialData.site_description}
            rows={4}
          />
          <TextField
            label="Meta keywords"
            name="meta_keywords"
            defaultValue={initialData.meta_keywords}
          />
          <div className="space-y-2">
            <span className="label-mono text-muted-foreground">
              Site logo
            </span>
            <div className="flex items-center gap-4">
              <div className="flex size-20 items-center justify-center overflow-hidden rounded-xs border border-border bg-muted">
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo} alt="" className="h-full w-full object-contain" />
                ) : (
                  <ImageIcon className="size-5 text-muted-foreground" aria-hidden />
                )}
              </div>
              <ImageUploader onUpload={setLogo} />
            </div>
          </div>
        </FormSection>

        <div className="space-y-8">
          <FormSection title="Assets" icon={<Settings className="size-4" />}>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2 text-center">
                <span className="label-mono text-muted-foreground">
                  Favicon
                </span>
                <div className="mx-auto flex size-16 items-center justify-center overflow-hidden rounded-xs border border-border bg-muted">
                  {favicon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={favicon} alt="" className="h-full w-full object-contain" />
                  ) : (
                    <Settings className="size-5 text-muted-foreground" aria-hidden />
                  )}
                </div>
                <ImageUploader onUpload={setFavicon} />
              </div>
              <div className="space-y-2 text-center">
                <span className="label-mono text-muted-foreground">
                  Resume (CV)
                </span>
                <div className="mx-auto flex size-16 items-center justify-center rounded-xs border border-border bg-muted">
                  <FileDown className="size-5 text-accent" aria-hidden />
                </div>
                <ImageUploader onUpload={setCv} />
              </div>
            </div>
          </FormSection>

          <FormSection title="Configuration" icon={<Mail className="size-4" />}>
            <TextField
              label="Google Analytics ID"
              name="google_analytics_id"
              defaultValue={initialData.google_analytics_id}
            />
            <TextField
              label="Contact email"
              name="contact_email"
              type="email"
              defaultValue={initialData.contact_email}
            />
            <TextField
              label="Footer text"
              name="footer_text"
              defaultValue={initialData.footer_text}
            />
          </FormSection>
        </div>
      </div>

      <FormFooter isSaving={isSaving} submitLabel="Apply settings" />
    </form>
  )
}
