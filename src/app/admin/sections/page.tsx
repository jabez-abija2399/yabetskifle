"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { ListSkeleton } from "@/components/admin/ListSkeleton"
import { PortfolioService } from "@/services/portfolio"
import { SiteSettings } from "@/types/portfolio"
import { toast } from "sonner"
import { Eye, EyeOff, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

const DEFAULTS = {
  site_name: "My Portfolio",
  footer_text: "© 2026",
  contact_email: "hello@example.com",
  show_services: true,
  show_projects: true,
  show_experience: true,
  show_testimonials: true,
  show_blog: true,
  show_faq: true,
  show_languages: true,
  show_contact: true,
}

const SECTIONS = [
  { id: "show_services", name: "Services & expertise", desc: "Display your core service offerings." },
  { id: "show_skills", name: "Technical ecosystem", desc: "Show your categorized tools and frameworks." },
  { id: "show_projects", name: "Featured projects", desc: "Showcase your work gallery." },
  { id: "show_experience", name: "Work history", desc: "Display your professional timeline." },
  { id: "show_testimonials", name: "Testimonials", desc: "Show client and student feedback." },
  { id: "show_contact", name: "Contact form", desc: "The “get in touch” area." },
  { id: "show_faq", name: "FAQ section", desc: "Answer common visitor questions." },
  { id: "show_languages", name: "Language skills", desc: "Display your linguistic proficiency." },
  { id: "show_blog", name: "Blog posts", desc: "Show or hide your journal entries." },
]

export default function AdminSectionsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await PortfolioService.getSettings()
        if (cancelled) return
        setSettings((data as SiteSettings | null) ?? ({ ...DEFAULTS } as SiteSettings))
      } catch {
        if (!cancelled) setSettings({ ...DEFAULTS } as SiteSettings)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const handleToggle = (field: string) => {
    if (!settings) return
    const flags = settings as unknown as Record<string, unknown>
    const currentValue = Boolean(flags[field] ?? true)
    setSettings({ ...settings, [field]: !currentValue } as SiteSettings)
  }

  const handleSave = async () => {
    if (!settings) return
    setIsSaving(true)
    try {
      await PortfolioService.updateSettings(settings)
      toast.success("Sections synchronized")
    } catch (error) {
      toast.error(`Failed: ${error instanceof Error ? error.message : "Save failed"}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        index="05"
        title="Sections"
        description="Master control — enable or disable entire public sections globally."
        actions={
          <Button onClick={handleSave} disabled={isSaving || loading} className="gap-2">
            <Save className="size-4" aria-hidden />
            {isSaving ? "Saving…" : "Save layout"}
          </Button>
        }
      />

      {loading ? (
        <ListSkeleton rows={5} />
      ) : (
        <div className="space-y-2">
          {SECTIONS.map((section) => {
            const flags = settings as unknown as Record<string, boolean> | null
            const isEnabled = flags?.[section.id] ?? true
            return (
              <div
                key={section.id}
                className={`flex items-center justify-between gap-4 rounded-xs border border-border bg-card p-5 transition-opacity ${
                  isEnabled ? "" : "opacity-60"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground" aria-hidden>
                    {isEnabled ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{section.name}</p>
                    <p className="label-mono text-muted-foreground">
                      {section.desc}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(section.id)}
                  type="button"
                  role="switch"
                  aria-checked={isEnabled}
                  aria-label={`${section.name} visibility`}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    isEnabled ? "bg-accent" : "bg-border"
                  }`}
                >
                  <span
                    className={`absolute top-1 size-4 rounded-full bg-background transition-all ${
                      isEnabled ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
