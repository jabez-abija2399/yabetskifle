"use client"

import { Plus, X, Laptop } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SkillCategory } from "@/types/portfolio"

interface Props {
  categories: SkillCategory[]
  onChange: (categories: SkillCategory[]) => void
}

export const SkillCategoryInput = ({ categories, onChange }: Props) => {
  
  const addCategory = () => {
    onChange([...categories, { name: "", techs: [] }])
  }

  const updateCategoryName = (index: number, name: string) => {
    const newCats = [...categories]
    newCats[index].name = name
    onChange(newCats)
  }

  const addTech = (index: number, tech: string) => {
    if (!tech.trim()) return
    const newCats = [...categories]
    newCats[index].techs = [...newCats[index].techs, tech.trim()]
    onChange(newCats)
  }

  const removeTech = (catIndex: number, techIndex: number) => {
    const newCats = [...categories]
    newCats[catIndex].techs = newCats[catIndex].techs.filter((_, i) => i !== techIndex)
    onChange(newCats)
  }

  const removeCategory = (index: number) => {
    onChange(categories.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold flex items-center gap-2">
          <Laptop className="w-4 h-4 text-primary" /> Skill Categories
        </label>
        <Button type="button" variant="outline" size="sm" onClick={addCategory} className="rounded-xl h-8">
          <Plus className="w-3 h-3 mr-1" /> Add Category
        </Button>
      </div>

      <div className="grid gap-6">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="p-6 rounded-[2rem] border border-border bg-muted/20 space-y-4 relative group">
            <Button 
                type="button" variant="ghost" size="icon" 
                onClick={() => removeCategory(catIdx)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-destructive"
            >
                <X className="w-4 h-4" />
            </Button>

            {/* Category Name */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Category Name</p>
              <Input 
                value={cat.name} 
                onChange={(e) => updateCategoryName(catIdx, e.target.value)}
                placeholder="e.g. Frontend, Backend, Design..."
                className="bg-background"
              />
            </div>

            {/* Techs in this category */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Skills in this category</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {cat.techs.map((tech, techIdx) => (
                  <span key={techIdx} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                    {tech}
                    <button type="button" onClick={() => removeTech(catIdx, techIdx)}>
                       <X className="w-3 h-3 hover:text-destructive" />
                    </button>
                  </span>
                ))}
              </div>
              <Input 
                placeholder="Type skill and press Enter..." 
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTech(catIdx, (e.target as HTMLInputElement).value)
                    ;(e.target as HTMLInputElement).value = ""
                  }
                }}
                className="bg-background h-9 text-xs"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
