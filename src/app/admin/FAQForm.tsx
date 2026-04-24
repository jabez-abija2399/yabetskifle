"use client"

import { FAQ } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface Props {
  initialData?: FAQ
  onSave: (data: Omit<FAQ, "id">) => Promise<void>
  isSaving: boolean
  onCancel: () => void
}

export const FAQForm = ({ initialData, onSave, isSaving, onCancel }: Props) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await onSave({
      question: formData.get("question") as string,
      answer: formData.get("answer") as string,
      category: formData.get("category") as string,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-zinc-400">Category</label>
        <Input name="category" defaultValue={initialData?.category || "General"} placeholder="Pricing, Technical, Process..." />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-zinc-400">Question</label>
        <Input name="question" defaultValue={initialData?.question} required placeholder="What is your average project timeline?" />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-zinc-400">Answer</label>
        <textarea name="answer" defaultValue={initialData?.answer} required 
          className="w-full min-h-32 p-4 rounded-xl border border-border bg-background text-sm leading-relaxed" 
          placeholder="I typically complete most projects within 4-6 weeks..." />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSaving} className="rounded-xl px-10 h-12 font-black shadow-xl shadow-primary/20">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update FAQ" : "Add FAQ"}
        </Button>
      </div>
    </form>
  )
}
