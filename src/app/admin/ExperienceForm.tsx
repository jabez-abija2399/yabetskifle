"use client"

import { Experience } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Plus, X, Eye, EyeOff } from "lucide-react"

interface Props {
  initialData?: Experience
  onSave: (data: Omit<Experience, "id">) => Promise<void>
  isSaving: boolean
  onCancel: () => void
}

export const ExperienceForm = ({ initialData, onSave, isSaving, onCancel }: Props) => {
  const [description, setDescription] = useState<string[]>(initialData?.description || [""])

  const addPoint = () => setDescription([...description, ""])
  const removePoint = (index: number) => setDescription(description.filter((_, i) => i !== index))
  const updatePoint = (index: number, val: string) => {
    const newDesc = [...description]
    newDesc[index] = val
    setDescription(newDesc)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onSave({
      role: formData.get("role") as string,
      company: formData.get("company") as string,
      duration: formData.get("duration") as string,
      location: formData.get("location") as string,
      is_current: formData.get("is_current") === "on",
      description: description.filter(d => d.trim() !== ""),
      order_index: parseInt(formData.get("order_index") as string) || 0,
      is_published: formData.get("is_published") === "on", // 👈 Capture toggle
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
           <label className="text-[10px] font-black uppercase text-zinc-500 mb-1 block">Role / Function</label>
           <Input name="role" defaultValue={initialData?.role} placeholder="Senior Frontend Developer" required />
        </div>
        <div className="space-y-1">
           <label className="text-[10px] font-black uppercase text-zinc-500 mb-1 block">Company / Studio</label>
           <Input name="company" defaultValue={initialData?.company} placeholder="Google / Freelance" required />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
           <label className="text-[10px] font-black uppercase text-zinc-500 mb-1 block">Duration</label>
           <Input name="duration" defaultValue={initialData?.duration} placeholder="Jan 2022 - Present" required />
        </div>
        <div className="space-y-1">
           <label className="text-[10px] font-black uppercase text-zinc-500 mb-1 block">Location</label>
           <Input name="location" defaultValue={initialData?.location} placeholder="Remote / Addis Ababa" />
        </div>
      </div>
      
      <div className="space-y-3">
        <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Key Achievements</label>
        {description.map((point, i) => (
          <div key={i} className="flex gap-2">
            <Input value={point || ""} onChange={(e) => updatePoint(i, e.target.value)} placeholder="Built a $1M revenue feature..." />
            <Button type="button" variant="ghost" size="icon" onClick={() => removePoint(i)} className="text-destructive"><X size={14} /></Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addPoint} className="w-full border-dashed border-2 rounded-xl">
           <Plus size={14} className="mr-2"/> Add Achievement Point
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6 items-end">
         <div className="space-y-1 w-24">
            <label className="text-[10px] font-black uppercase text-zinc-500 mb-1 block">Order</label>
            <Input name="order_index" type="number" defaultValue={initialData?.order_index || 0} />
         </div>
         <div className="flex items-center gap-2 pb-2">
            <input type="checkbox" name="is_current" id="is_current" defaultChecked={initialData?.is_current} className="w-4 h-4 accent-primary" />
            <label htmlFor="is_current" className="text-sm font-bold">I currently work here</label>
         </div>
      </div>

      {/* 🛡️ VISIBILITY TOGGLE */}
      <div className="flex items-center justify-between p-6 rounded-3xl bg-muted/30 border border-border">
        <div className="flex items-center gap-4">
           <div className={`w-10 h-10 rounded-full flex items-center justify-center ${initialData?.is_published === false ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
              {initialData?.is_published === false ? <EyeOff size={20} /> : <Eye size={20} />}
           </div>
           <p className="font-bold text-sm">Public Visibility</p>
        </div>
        <input 
           type="checkbox" 
           name="is_published"
           defaultChecked={initialData?.is_published ?? true}
           className="w-12 h-6 accent-primary cursor-pointer"
        />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <Button type="button" variant="ghost" onClick={onCancel}>Discard</Button>
        <Button type="submit" disabled={isSaving} className="rounded-xl px-10 h-14 font-black">
           Save Experience
        </Button>
      </div>
    </form>
  )
}
