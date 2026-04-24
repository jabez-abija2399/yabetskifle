"use client"

import { useState, useEffect } from "react"
import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { ProfileForm } from "@/components/admin/ProfileForm"
import { Profile } from "@/types/portfolio"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const fetchProfile = async () => {
    setIsLoading(true)
    const supabase = createSupabaseClient()
    const { data, error } = await supabase.from("profiles").select("*").single()

    if (error) {
      toast.error("Could not load profile. Ensure you ran the SQL query.")
    } else {
      setProfile(data as Profile)
    }
    setIsLoading(false)
  }

  const handleUpdate = async (updatedData: Profile) => {
    setIsSaving(true)
    const supabase = createSupabaseClient()
    const { error } = await supabase
      .from("profiles")
      .update(updatedData)
      .eq("id", profile?.id)

    if (error) {
      toast.error(`Update failed: ${error.message}`)
    } else {
      toast.success("Profile updated successfully!")
      setProfile(updatedData)
    }
    setIsSaving(false)
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  if (isLoading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto">
      <AdminPageHeader 
        title="My Profile" 
        description="Manage your professional bio, skills, and social presence across the entire site."
      />

      {profile && (
        <ProfileForm 
          initialData={profile} 
          onSave={handleUpdate} 
          isSaving={isSaving} 
        />
      )}
    </div>
  )
}
