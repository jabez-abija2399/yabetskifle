"use client"

import { usePortfolio } from "@/hooks/usePortfolio"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import { toast } from "sonner"

export default function AdminPage() {
  const { heroData, updateHero, isLoading } = usePortfolio()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // 1. Gather all values from the form
    const newData = {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      bio: formData.get("bio") as string,
    }

    // 2. Pass them to our "Middleman" Hook
    updateHero(newData)
    toast.success("Portfolio updated successfully!", {
      description: "Your hero section is now live locally.",
    })
  }

  return (
    <div className="max-w-2xl mx-auto py-20 px-6">
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold">Hero Section Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-70">Your Display Name</label>
              <Input name="name" defaultValue={heroData.name} />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-70">Professional Role</label>
              <Input name="role" defaultValue={heroData.role} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold opacity-70">Short Bio</label>
              <textarea 
                name="bio" 
                defaultValue={heroData.bio}
                className="w-full min-h-(--spacing-32) p-3 rounded-md border border-input bg-background"
              />
            </div>

            <Button type="submit" className="w-full text-lg h-12" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
