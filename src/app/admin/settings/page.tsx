"use client"

import { useState, useEffect } from "react"
import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { SettingsForm } from "../SettingsForm"
import { SiteSettings } from "@/types/portfolio"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const fetchSettings = async () => {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase.from("site_settings").select("*").single()
    if (error) {
      toast.error("Settings not found.")
    } else {
      setSettings(data as SiteSettings)
    }
    setIsLoading(false)
  }

  const handleUpdate = async (updatedData: SiteSettings) => {
    setIsSaving(true)
    const supabase = createSupabaseClient()
    const { error } = await supabase
      .from("site_settings")
      .update(updatedData)
      .eq("id", settings?.id)

    if (error) {
      toast.error(`Error Updating: ${error.message}`)
    } else {
      toast.success("Site configuration updated!")
      setSettings(updatedData)
    }
    setIsSaving(false)
  }

  useEffect(() => { fetchSettings() }, [])

  if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>

  return (
    <div className="max-w-6xl mx-auto">
      <AdminPageHeader 
        title="Site Settings & SEO" 
        description="Configure your website global metadata, SEO, and legal information."
      />

      {settings && <SettingsForm initialData={settings} onSave={handleUpdate} isSaving={isSaving} />}
    </div>
  )
}
