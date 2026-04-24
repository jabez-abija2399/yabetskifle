"use client"

import { useState } from "react"
import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { AdminEmptyState } from "@/components/ui/AdminEmptyState"
import { ServiceForm } from "../ServiceForm"
import { Service } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Pencil, Trash2, Box, Code2, Layout, Database, Smartphone, Palette, EyeOff } from "lucide-react"

const IconMap: any = { Code2, Layout, Database, Smartphone, Palette, Box }

export default function AdminServicesPage() {
  const { data: services, loading, deleteItem, refresh } = useAdminData<Service>("services")
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (data: Omit<Service, "id">) => {
    setIsSaving(true)
    const supabase = createSupabaseClient()
    const { error } = editingService 
      ? await supabase.from("services").update(data).eq("id", editingService.id)
      : await supabase.from("services").insert([data])

    if (error) {
      toast.error(`Error: ${error.message}`)
    } else {
      toast.success("Service expertise updated!")
      setEditingService(null)
      setIsAdding(false)
      refresh()
    }
    setIsSaving(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AdminPageHeader 
        title="Services & Expertise" 
        description="Showcase what you offer to your clients and collaborators."
        actionLabel={!(isAdding || editingService) ? "Add Service" : undefined}
        onAction={() => setIsAdding(true)}
      />

      {(isAdding || editingService) ? (
        <div className="p-10 rounded-[3rem] border border-border bg-card shadow-sm animate-in fade-in zoom-in-95">
           <h3 className="text-xl font-bold mb-8 italic">{editingService ? "Update Expertise" : "New Service Offering"}</h3>
           <ServiceForm 
              initialData={editingService || undefined} 
              onSave={handleSave} 
              isSaving={isSaving}
              onCancel={() => { setEditingService(null); setIsAdding(false); }}
           />
        </div>
      ) : (
        <div className="grid gap-4">
          {services.length === 0 && !loading && <AdminEmptyState message="You haven't listed your services yet." />}
          {services.map((service) => {
            const Icon = IconMap[service.icon_name || "Box"] || Box
            return (
              <div key={service.id} className={`p-6 rounded-[2.5rem] border border-border bg-card group flex items-center justify-between hover:border-primary/30 transition-all ${!service.is_published ? "opacity-60 grayscale-[0.5]" : ""}`}>
                <div className="flex items-center gap-6">
                   <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                         <Icon size={24} />
                      </div>
                      {!service.is_published && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center shadow-lg">
                           <EyeOff size={10} />
                        </div>
                      )}
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg tracking-tight leading-none">{service.title}</h4>
                        {!service.is_published && (
                           <span className="text-[8px] font-black uppercase text-destructive tracking-widest px-2 py-0.5 rounded-full bg-destructive/10">Hidden</span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-500 font-medium line-clamp-1 max-w-md">{service.description}</p>
                   </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => setEditingService(service)} className="p-3 rounded-xl bg-muted hover:bg-primary hover:text-white transition-all shadow-sm"><Pencil size={14} /></button>
                  <button onClick={() => deleteItem(service.id)} className="p-3 rounded-xl bg-muted hover:bg-destructive hover:text-white transition-all shadow-sm"><Trash2 size={14} /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
