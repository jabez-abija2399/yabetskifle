"use client"

import { useState } from "react"
import { Plus, X, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Props {
  label: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
}

export const DynamicListInput = ({ label, items, onChange, placeholder }: Props) => {
  const [inputValue, setInputValue] = useState("")

  const addItem = () => {
    if (!inputValue.trim()) return
    onChange([...items, inputValue.trim()])
    setInputValue("")
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold flex items-center gap-2">
        <List className="w-4 h-4 text-primary" />
        {label}
      </label>

      {/* The List of items */}
      <div className="space-y-2">
        {(Array.isArray(items) ? items : []).map((item, index) => (
          <div key={index} className="flex items-center gap-2 group animate-in fade-in slide-in-from-left-2 duration-200">
            <div className="flex-1 px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm">
              {item}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 transition-all"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Input box to add new ones */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addItem()
            }
          }}
          placeholder={placeholder || "Type and press Enter..."}
          className="flex-1"
        />
        <Button type="button" onClick={addItem} size="icon" variant="outline">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
