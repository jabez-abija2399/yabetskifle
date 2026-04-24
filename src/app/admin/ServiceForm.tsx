"use client"

import { Service } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Plus, X, Box, Code2, Layout, Database, Smartphone, Palette, Eye, EyeOff } from "lucide-react"

const icons = [
  { name: "Code2", icon: <Code2 size={16} /> },
  { name: "Layout", icon: <Layout size={16} /> },
  { name: "Database", icon: <Database size={16} /> },
  { name: "Smartphone", icon: <Smartphone size={16} /> },
  { name: "Palette", icon: <Palette size={16} /> },
  { name: "Box", icon: <Box size={16} /> },
]

interface Props {
  initialData?: Service
  onSave: (data: Omit<Service, "id">) => Promise<void>
  isSaving: boolean
  onCancel: () => void
}

export const ServiceForm = ({ initialData, onSave, isSaving, onCancel }: Props) => {
  const [features, setFeatures] = useState<string[]>(initialData?.features || [""])
  const [selectedIcon, setSelectedIcon] = useState(initialData?.icon_name || "Code2")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onSave({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      icon_name: selectedIcon,
      features: features.filter(f => f.trim() !== ""),
      order_index: parseInt(formData.get("order_index") as string) || 0,
      is_published: formData.get("is_published") === "on", // 👈 Capture toggle
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
         <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Service Icon</label>
         <div className="flex flex-wrap gap-2">
            {icons.map((item) => (
              <button 
                key={item.name} 
                type="button" 
                onClick={() => setSelectedIcon(item.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                  selectedIcon === item.name ? "bg-primary text-white border-primary" : "bg-muted border-transparent hover:border-border"
                }`}
              >
                {item.icon} <span className="text-xs font-bold">{item.name}</span>
              </button>
            ))}
         </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
           <label className="text-[10px] font-black uppercase text-zinc-500">Service Title</label>
           <Input name="title" defaultValue={initialData?.title} placeholder="e.g. Full-Stack Development" required />
        </div>
        <div className="space-y-1">
           <label className="text-[10px] font-black uppercase text-zinc-500">Elevator Pitch (Short Description)</label>
           <textarea name="description" defaultValue={initialData?.description} required className="w-full min-h-24 p-3 rounded-xl border border-border bg-background text-sm" />
        </div>
      </div>
      
      <div className="space-y-3">
        <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Core Features / Techs</label>
        {features.map((feat, i) => (
          <div key={i} className="flex gap-2">
            <Input value={feat} onChange={(e) => setFeatures(f => { f[i] = e.target.value; return [...f] })} placeholder="e.g. Next.js & React" />
            <Button type="button" variant="ghost" size="icon" onClick={() => setFeatures(f => f.filter((_, idx) => idx !== i))} className="text-destructive"><X size={14} /></Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => setFeatures([...features, ""])} className="w-full border-dashed border-2 rounded-xl"><Plus size={14} className="mr-2"/> Add Feature Line</Button>
      </div>

      <div className="flex items-center justify-between p-6 rounded-3xl bg-muted/30 border border-border">
        <div className="flex items-center gap-4">
           {initialData?.is_published === false ? <EyeOff size={20} className="text-destructive" /> : <Eye size={20} className="text-primary" />}
           <p className="font-bold text-sm">Public Visibility</p>
        </div>
        <input 
           type="checkbox" 
           name="is_published"
           defaultChecked={initialData?.is_published ?? true}
           className="w-12 h-6 accent-primary"
        />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <Button type="button" variant="ghost" onClick={onCancel}>Discard</Button>
        <Button type="submit" disabled={isSaving} className="rounded-xl px-10 h-14 font-black">
           {isSaving ? "Saving..." : "Save Service"}
        </Button>
      </div>
    </form>
  )
}
