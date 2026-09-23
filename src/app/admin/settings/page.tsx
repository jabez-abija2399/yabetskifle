"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { ListSkeleton } from "@/components/admin/ListSkeleton"
import { SettingsForm } from "../SettingsForm"
import { SiteSettings } from "@/types/portfolio"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleUpdate = async (updatedData: SiteSettings) => {
    setIsSaving(true)
    const supabase = createSupabaseClient()
    const { error } = await supabase
      .from("site_settings")
      .update(updatedData)
      .eq("id", settings?.id)

    if (error) {
      toast.error(`Error updating: ${error.message}`)
    } else {
      toast.success("Site settings updated")
      setSettings(updatedData)
    }
    setIsSaving(false)
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase.from("site_settings").select("*").single()
      if (cancelled) return
      if (error) {
        toast.error("Settings not found.")
      } else {
        setSettings(data as SiteSettings)
      }
      setIsLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        index="05"
        title="Settings"
        description="Global metadata, SEO, and legal information."
      />

      {isLoading ? (
        <ListSkeleton rows={4} />
      ) : (
        settings && <SettingsForm initialData={settings} onSave={handleUpdate} isSaving={isSaving} />
      )}
    </div>
  )
}
