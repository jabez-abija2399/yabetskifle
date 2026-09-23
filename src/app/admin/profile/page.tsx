"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { ListSkeleton } from "@/components/admin/ListSkeleton"
import { ProfileForm } from "@/components/admin/ProfileForm"
import { Profile } from "@/types/portfolio"
import { PortfolioService } from "@/services/portfolio"
import { toast } from "sonner"

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleUpdate = async (updatedData: Profile) => {
    setIsSaving(true)
    try {
      await PortfolioService.updateProfile(updatedData)
      toast.success("Profile updated")
      setProfile(updatedData)
    } catch (error) {
      toast.error(`Update failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await PortfolioService.getProfile()
        if (cancelled) return
        if (!data) {
          toast.error("Could not load profile. Ensure you ran the SQL query.")
        } else {
          setProfile(data)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        index="04"
        title="Profile"
        description="Your professional bio, skills, and social presence across the site."
      />

      {isLoading ? (
        <ListSkeleton rows={4} />
      ) : (
        profile && (
          <ProfileForm initialData={profile} onSave={handleUpdate} isSaving={isSaving} />
        )
      )}
    </div>
  )
}
