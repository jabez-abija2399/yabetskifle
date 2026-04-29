"use client"

import { useState, useEffect } from "react"
import { AdminPageHeader } from "@/components/ui/AdminPageHeader"
import { PortfolioService } from "@/services/portfolio"
import { toast } from "sonner"
import { Plus, Loader2, Trash2, Edit2, Boxes } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [categoryName, setCategoryName] = useState("")
  const [techString, setTechString] = useState("")

  const fetchSkills = async () => {
    setIsLoading(true)
    try {
      const data = await PortfolioService.getSkills()
      setSkills(data)
    } catch (err) {
      toast.error("Failed to load skills from database.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchSkills() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryName.trim()) return toast.error("Category name is required.")
    
    setIsSaving(true)
    try {
      const payload = {
        id: editingId || undefined,
        category_name: categoryName,
        technologies: techString.split(",").map(s => s.trim()).filter(Boolean),
        order_index: skills.length
      }
      
      await PortfolioService.saveSkill(payload)
      toast.success(editingId ? "Category updated!" : "New category added!")
      
      // Reset form & refresh
      setCategoryName("")
      setTechString("")
      setEditingId(null)
      fetchSkills()
    } catch (err) {
      toast.error("Save failed. Check your database connection.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently remove this skill category?")) return
    try {
      await PortfolioService.deleteSkill(id)
      toast.success("Category removed.")
      fetchSkills()
    } catch (err) {
      toast.error("Delete failed.")
    }
  }

  const startEdit = (skill: any) => {
    setEditingId(skill.id)
    setCategoryName(skill.category_name)
    setTechString(skill.technologies.join(", "))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <AdminPageHeader 
        title="Technical Ecosystem" 
        description="Strategically manage your tools and frameworks. Your changes reflect instantly in your 'Technical Inventory' section."
      />

      {/* 📝 Add/Edit Card */}
      <div className="p-10 rounded-[3rem] bg-card border border-border shadow-2xl shadow-primary/5">
        <form onSubmit={handleSave} className="space-y-8">
           <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <label className="text-xs font-black uppercase tracking-widest text-zinc-500 italic">Category Name</label>
                 <Input 
                   value={categoryName} 
                   onChange={e => setCategoryName(e.target.value)} 
                   placeholder="e.g. Architecture & State" 
                   className="h-14 rounded-2xl"
                 />
              </div>
              <div className="space-y-4">
                 <label className="text-xs font-black uppercase tracking-widest text-zinc-500 italic">Tools (Comma separated)</label>
                 <Input 
                   value={techString} 
                   onChange={e => setTechString(e.target.value)} 
                   placeholder="Next.js, React, TypeScript..." 
                   className="h-14 rounded-2xl"
                 />
              </div>
           </div>

           <div className="flex items-center justify-between pt-4 border-t border-border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Icons are mapped automatically based on names.</p>
              <div className="flex gap-4">
                {editingId && (
                  <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setCategoryName(""); setTechString(""); }}>
                    Cancel
                  </Button>
                )}
                <Button disabled={isSaving} className="h-14 px-10 rounded-2xl font-black italic gap-2 shadow-xl shadow-primary/20">
                   {isSaving ? <Loader2 className="animate-spin" /> : <Plus size={18} />}
                   {editingId ? "Update Category" : "Add Category"}
                </Button>
              </div>
           </div>
        </form>
      </div>

      {/* 🧩 List View */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 text-primary px-4">
           <Boxes size={20} />
           <span className="text-xs font-black uppercase tracking-[0.4em] italic">Current Inventory</span>
        </div>

        {isLoading ? (
          <div className="p-20 text-center animate-pulse font-bold italic opacity-30">Synchronizing Database...</div>
        ) : skills.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed border-border rounded-[3rem] text-muted-foreground italic">
             No technical categories defined yet. Start by adding one above.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skill) => (
              <div key={skill.id} className="p-10 rounded-[3rem] bg-card border border-border flex flex-col justify-between group hover:border-primary/30 transition-all shadow-xl shadow-primary/5">
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                             <Boxes size={20} />
                          </div>
                          <h4 className="text-xl font-bold italic tracking-tight">{skill.category_name}</h4>
                       </div>
                       <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => startEdit(skill)} className="rounded-xl hover:text-primary">
                             <Edit2 size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(skill.id)} className="rounded-xl hover:text-destructive">
                             <Trash2 size={16} />
                          </Button>
                       </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                       {skill.technologies.map((t: string) => (
                         <span key={t} className="px-4 py-2 bg-muted/50 rounded-xl text-[10px] font-bold text-zinc-500 border border-border/50">
                            {t}
                         </span>
                       ))}
                    </div>
                 </div>

                 <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-400 mt-8">Category UUID: {skill.id.slice(0,8)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
