"use client"

import { useState } from "react"
import { SiteSettings } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { Loader2, Settings, Mail, FileDown, Search } from "lucide-react"

interface Props {
  initialData: SiteSettings
  onSave: (data: SiteSettings) => Promise<void>
  isSaving: boolean
}

export const SettingsForm = ({ initialData, onSave, isSaving }: Props) => {
  const [favicon, setFavicon] = useState(initialData.favicon_url || "")
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
      cv_url: cv,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      
      {/* Search & SEO Settings */}
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
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Meta Description (SEO)</label>
            <textarea name="site_description" defaultValue={initialData.site_description} 
              className="w-full min-h-24 p-3 rounded-xl border border-border bg-background text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Keywords (comma separated)</label>
            <Input name="meta_keywords" defaultValue={initialData.meta_keywords} placeholder="web developer, nextjs, react..." />
          </div>
        </div>
      </div>

      {/* Files & External Settings */}
      <div className="space-y-8">
        <div className="p-8 rounded-[2.5rem] border border-border bg-card space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" /> Configuration
          </h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-center block">Favicon</label>
               <div className="relative w-16 h-16 mx-auto rounded-xl border-2 border-border overflow-hidden bg-muted flex items-center justify-center">
                  {favicon ? <img src={favicon} alt="Favicon" className="w-full h-full object-contain" /> : <Settings className="w-6 h-6 text-zinc-600" />}
               </div>
               <ImageUploader onUpload={setFavicon} />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-center block">Resume (PDF)</label>
               <div className="relative w-16 h-16 mx-auto rounded-xl border-2 border-border overflow-hidden bg-muted flex items-center justify-center">
                  <FileDown className="w-6 h-6 text-primary" />
               </div>
               <ImageUploader onUpload={setCv} />
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] border border-border bg-card space-y-4">
           <div className="space-y-1">
             <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Google Analytics ID</label>
             <Input name="google_analytics_id" defaultValue={initialData.google_analytics_id} placeholder="G-XXXXXXXXXX" />
           </div>
           <div className="space-y-1">
             <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Public Contact Email</label>
             <Input name="contact_email" defaultValue={initialData.contact_email} type="email" />
           </div>
           <div className="space-y-1">
             <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Footer Trademark Text</label>
             <Input name="footer_text" defaultValue={initialData.footer_text} placeholder="© 2024 Your Name. All rights reserved." />
           </div>
        </div>
      </div>

      <div className="lg:col-span-2 flex justify-end pt-10 border-t border-border mt-10">
        <Button type="submit" disabled={isSaving} className="rounded-2xl px-12 h-14 font-black shadow-2xl shadow-primary/20">
          {isSaving && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
          Update Global Settings
        </Button>
      </div>
    </form>
  )
}
