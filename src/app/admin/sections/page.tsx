"use client"

import { useState, useEffect } from "react"
import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { PortfolioService } from "@/services/portfolio"
import { SiteSettings } from "@/types/portfolio"
import { toast } from "sonner"
import { Layout, Eye, EyeOff, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminSectionsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const data = await PortfolioService.getSettings()
    
    if (data) setSettings(data)
    else {
      // Create a default object if no row exists yet
      setSettings({
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
        show_contact: true
      } as any)
    }
    setLoading(false)
  }

  const handleToggle = (field: string) => {
    if (!settings) return
    const currentValue = (settings as any)[field] ?? true
    setSettings({ 
      ...settings, 
      [field]: !currentValue 
    } as any)
  }

  const handleSave = async () => {
    if (!settings) return
    setIsSaving(true)
    
    console.log("Saving Architecture:", settings)

    try {
      await PortfolioService.updateSettings(settings)
      console.log("Saved Success")
      toast.success("Website Architecture synchronized!")
    } catch (error: any) {
      console.error("Save Error:", error)
      toast.error(`Failed: ${error.message}. Make sure SQL columns were added.`)
    }
    setIsSaving(false)
  }

  const sections = [
    { id: "show_services", name: "Services & Expertise", desc: "Display your core service offerings." },
    { id: "show_projects", name: "Featured Projects", desc: "Showcase your work gallery." },
    { id: "show_experience", name: "Work History", desc: "Display your professional timeline." },
    { id: "show_testimonials", name: "Testimonials", desc: "Show client and student feedback." },
    { id: "show_contact", name: "Contact Form", desc: "The 'Get in Touch' area." },
    { id: "show_faq", name: "FAQ Section", desc: "Answer common visitor questions." },
    { id: "show_languages", name: "Language Skills", desc: "Display your linguistic proficiency." },
    { id: "show_blog", name: "Blog Posts", desc: "Show/Hide your journal entries." },
  ]

  if (loading) return <div className="p-20 text-center font-black italic animate-pulse">Syncing Structural Grid...</div>

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <AdminPageHeader 
        title="Layout Architect" 
        description="Master control for your website layout. Enable or disable entire sections globally."
      />

      <div className="grid gap-4 mt-8">
        {sections.map((section) => {
          const isEnabled = (settings as any)?.[section.id] ?? true
          return (
            <div key={section.id} className={`p-8 rounded-[3rem] border border-border bg-card transition-all flex items-center justify-between ${!isEnabled ? "opacity-40 grayscale" : "shadow-xl shadow-primary/5"}`}>
               <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isEnabled ? "bg-primary/10 text-primary" : "bg-muted text-zinc-500"}`}>
                     {isEnabled ? <Eye size={24} /> : <EyeOff size={24} />}
                  </div>
                  <div>
                     <h4 className="font-bold text-lg tracking-tight">{section.name}</h4>
                     <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{section.desc}</p>
                  </div>
               </div>

               <button 
                  onClick={() => handleToggle(section.id)}
                  type="button"
                  className={`w-16 h-8 rounded-full relative transition-all shadow-inner ${isEnabled ? "bg-primary" : "bg-zinc-700"}`}
               >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all ${isEnabled ? "right-1" : "left-1"}`} />
               </button>
            </div>
          )
        })}
      </div>

      <div className="fixed bottom-10 right-10 flex items-center gap-4 bg-background/80 backdrop-blur-xl p-4 rounded-[2rem] border border-primary/20 shadow-2xl animate-in slide-in-from-right-10 z-50">
         <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest px-4">Instant Global Update</p>
         <Button onClick={handleSave} disabled={isSaving} className="h-14 px-10 rounded-2xl font-black italic gap-2 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
            {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
            Update Architecture
         </Button>
      </div>
    </div>
  )
}
