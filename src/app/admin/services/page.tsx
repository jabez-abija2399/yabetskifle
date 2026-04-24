"use client"

import { useState } from "react"
import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { AdminEmptyState } from "@/components/ui/AdminEmptyState"
import { ServiceForm } from "../ServiceForm" // Adjust import path if needed
import { Service } from "@/types/portfolio"
import { useAdminData } from "@/hooks/useAdminData"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Pencil, Trash2, Box, Layers } from "lucide-react"

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
      toast.success("Service saved!")
      setEditingService(null)
      setIsAdding(false)
      refresh()
    }
    setIsSaving(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <AdminPageHeader 
        title="Services & Expertise" 
        description="Define what you offer to clients and showcase your core competencies."
        actionLabel={!(isAdding || editingService) ? "Add Service" : undefined}
        onAction={() => setIsAdding(true)}
      />

      {(isAdding || editingService) ? (
        <div className="p-8 rounded-[2.5rem] border border-border bg-card shadow-sm">
           <h3 className="text-xl font-bold mb-6">{editingService ? "Edit Service" : "New Service"}</h3>
           <ServiceForm 
              initialData={editingService || undefined} 
              onSave={handleSave} 
              isSaving={isSaving}
              onCancel={() => { setEditingService(null); setIsAdding(false); }}
           />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {services.length === 0 && !loading && <AdminEmptyState message="No services defined yet." />}
          {services.map((service) => (
            <div key={service.id} className="p-6 rounded-[2rem] border border-border bg-card flex flex-col justify-between group relative overflow-hidden">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                   <Box className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-black text-xl">{service.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                <div className="flex flex-wrap gap-1">
                   {service.features?.slice(0, 3).map(f => (
                     <span key={f} className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground">{f}</span>
                   ))}
                </div>
              </div>

              <div className="flex gap-2 mt-6 justify-end">
                <button onClick={() => setEditingService(service)} className="p-3 rounded-xl bg-muted hover:bg-primary hover:text-white transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => deleteItem(service.id)} className="p-3 rounded-xl bg-muted hover:bg-destructive hover:text-white transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
