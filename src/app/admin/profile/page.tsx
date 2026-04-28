"use client"

import { useState, useEffect } from "react"
import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { ProfileForm } from "@/components/admin/ProfileForm"
import { Profile } from "@/types/portfolio"
import { PortfolioService } from "@/services/portfolio"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const fetchProfile = async () => {
    setIsLoading(true)
    const data = await PortfolioService.getProfile()
    
    if (!data) {
      toast.error("Could not load profile. Ensure you ran the SQL query.")
    } else {
      setProfile(data)
    }
    setIsLoading(false)
  }

  const handleUpdate = async (updatedData: Profile) => {
    setIsSaving(true)
    try {
      await PortfolioService.updateProfile(updatedData)
      toast.success("Profile updated successfully!")
      setProfile(updatedData)
    } catch (error: any) {
      toast.error(`Update failed: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
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
