"use client"

import { useState } from "react"
import { Service } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { TextField, TextAreaField, SwitchRow, FormFooter } from "@/components/admin/fields"
import { Plus, X, Box, Code2, Layout, Database, Smartphone, Palette, Zap, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const ICONS = [
  { name: "Code2", icon: <Code2 size={16} /> },
  { name: "Layout", icon: <Layout size={16} /> },
  { name: "Database", icon: <Database size={16} /> },
  { name: "Smartphone", icon: <Smartphone size={16} /> },
  { name: "Palette", icon: <Palette size={16} /> },
  { name: "Box", icon: <Box size={16} /> },
  { name: "Zap", icon: <Zap size={16} /> },
  { name: "Sparkles", icon: <Sparkles size={16} /> },
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
      features: features.filter((f) => f.trim() !== ""),
      order_index: parseInt(formData.get("order_index") as string) || 0,
      is_published: formData.get("is_published") === "on",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <span className="label-mono text-muted-foreground">
          Service icon
        </span>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Service icon">
          {ICONS.map((item) => (
            <button
              key={item.name}
              type="button"
              role="radio"
              aria-checked={selectedIcon === item.name}
              aria-label={item.name}
              onClick={() => setSelectedIcon(item.name)}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-xs border px-2.5 text-xs transition-colors",
                selectedIcon === item.name
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              )}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Title"
          name="title"
          defaultValue={initialData?.title}
          placeholder="e.g. Full-Stack Development"
          required
        />
        <TextField
          label="Sort order"
          name="order_index"
          type="number"
          defaultValue={initialData?.order_index || 0}
        />
      </div>

      <TextAreaField
        label="Short description"
        name="description"
        defaultValue={initialData?.description}
        rows={3}
        required
        placeholder="One-line pitch shown on the public site."
      />

      <div className="space-y-2">
        <span className="label-mono text-muted-foreground">
          Feature lines
        </span>
        <div className="space-y-2">
          {features.map((feat, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={feat || ""}
                onChange={(e) =>
                  setFeatures((prev) => prev.map((f, idx) => (idx === i ? e.target.value : f)))
                }
                placeholder="e.g. Next.js & React"
                aria-label={`Feature line ${i + 1}`}
                className="h-9 flex-1 rounded-xs border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove feature line ${i + 1}`}
                onClick={() => setFeatures((f) => f.filter((_, idx) => idx !== i))}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => setFeatures([...features, ""])}
            className="w-full border-dashed"
          >
            <Plus className="size-3.5" aria-hidden /> Add feature line
          </Button>
        </div>
      </div>

      <SwitchRow
        name="is_published"
        label="Public visibility"
        description="Hidden services stay in the admin but never appear on the site."
        defaultChecked={initialData?.is_published ?? true}
      />

      <FormFooter onCancel={onCancel} isSaving={isSaving} submitLabel="Save service" />
    </form>
  )
}
