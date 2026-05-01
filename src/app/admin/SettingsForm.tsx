"use client"

import { useState } from "react"
import { SiteSettings } from "@/types/portfolio" // Matches your types
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { Loader2, Settings, Mail, FileDown, Search, Image as ImageIcon } from "lucide-react"

interface Props {
  initialData: SiteSettings
  onSave: (data: SiteSettings) => Promise<void>
  isSaving: boolean
}

export const SettingsForm = ({ initialData, onSave, isSaving }: Props) => {
  // State for all our optional URLs from the SiteSettings type
  const [favicon, setFavicon] = useState(initialData.favicon_url || "")
  const [logo, setLogo] = useState(initialData.logo_url || "")
  const [cv, setCv] = useState(initialData.cv_url || "")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Constructing the object exactly as the 'SiteSettings' interface expects
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
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      
      {/* SECTION 1: SEARCH & BRANDING */}
      <div className="space-y-8 p-8 rounded-[2.5rem] border border-border bg-card">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" /> SEO & Branding
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Site Name</label>
            <Input name="site_name" defaultValue={initialData.site_name} required />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Global Description</label>
            <textarea name="site_description" defaultValue={initialData.site_description} 
              className="w-full min-h-24 p-3 rounded-xl border border-border bg-background text-foreground text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Meta Keywords</label>
            <Input name="meta_keywords" defaultValue={initialData.meta_keywords} />
          </div>
        </div>

        {/* Logo Uploader (Newly Added to match Type) */}
        <div className="space-y-2 pt-4">
           <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Site Logo</label>
           <div className="flex items-center gap-6">
              <div className="relative w-20 h-20 rounded-xl border-2 border-border overflow-hidden bg-muted flex items-center justify-center">
                 {logo ? <img src={logo} alt="Logo" className="w-full h-full object-contain" /> : <ImageIcon className="w-6 h-6 text-zinc-600" />}
              </div>
              <ImageUploader onUpload={setLogo} />
           </div>
        </div>
      </div>

      {/* SECTION 2: CONFIG & ASSETS */}
      <div className="space-y-8">
        <div className="p-8 rounded-[2.5rem] border border-border bg-card">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
             <Settings className="w-5 h-5 text-primary" /> Assets
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 text-center">
               <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Favicon</label>
               <div className="relative w-16 h-16 mx-auto rounded-xl border-2 border-border mb-3 bg-muted flex items-center justify-center">
                  {favicon ? <img src={favicon} alt="Favicon" className="w-full h-full object-contain" /> : <Settings className="w-6 h-6 text-zinc-600" />}
               </div>
               <ImageUploader onUpload={setFavicon} />
            </div>
            <div className="space-y-2 text-center">
               <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Resume (CV)</label>
               <div className="relative w-16 h-16 mx-auto rounded-xl border-2 border-border mb-3 bg-muted flex items-center justify-center">
                  <FileDown className="w-6 h-6 text-primary" />
               </div>
               <ImageUploader onUpload={setCv} />
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] border border-border bg-card space-y-4">
           <div className="space-y-1">
             <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Google Analytics ID</label>
             <Input name="google_analytics_id" defaultValue={initialData.google_analytics_id} />
           </div>
           <div className="space-y-1">
             <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Contact Email</label>
             <Input name="contact_email" defaultValue={initialData.contact_email} type="email" />
           </div>
           <div className="space-y-1">
             <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Footer Text</label>
             <Input name="footer_text" defaultValue={initialData.footer_text} />
           </div>
        </div>
      </div>

      <div className="lg:col-span-2 flex justify-end">
        <Button type="submit" disabled={isSaving} className="rounded-2xl px-12 h-14 font-black shadow-2xl shadow-primary/20">
          {isSaving && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
          Apply Global Settings
        </Button>
      </div>
    </form>
  )
}
