"use client"

import { useId, useState, type ReactNode, type TextareaHTMLAttributes, type InputHTMLAttributes } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const LABEL_CLASS = "label-mono text-muted-foreground"

export function TextField({
  label,
  id,
  className,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  const auto = useId()
  const fieldId = id ?? auto
  return (
    <div className="space-y-1.5">
      <Label htmlFor={fieldId} className={LABEL_CLASS}>
        {label}
      </Label>
      <Input id={fieldId} className={cn("h-9", className)} {...props} />
    </div>
  )
}

export function TextAreaField({
  label,
  id,
  className,
  rows = 4,
  ...props
}: { label: string; rows?: number } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const auto = useId()
  const fieldId = id ?? auto
  return (
    <div className="space-y-1.5">
      <Label htmlFor={fieldId} className={LABEL_CLASS}>
        {label}
      </Label>
      <textarea
        id={fieldId}
        rows={rows}
        className={cn(
          "flex w-full rounded-xs border border-input bg-background px-3 py-2 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

export function SwitchRow({
  name,
  label,
  description,
  defaultChecked = true,
}: {
  name: string
  label: string
  description?: string
  defaultChecked?: boolean
}) {
  const [on, setOn] = useState(defaultChecked)
  const id = useId()
  return (
    <div className="flex items-center justify-between gap-4 rounded-xs border border-border bg-muted/30 px-4 py-3">
      <div className="min-w-0">
        <Label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </Label>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <input type="hidden" name={name} value={on ? "on" : ""} />
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn((v) => !v)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          on ? "border-accent bg-accent" : "border-border bg-muted"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute top-0.5 size-[18px] rounded-full bg-card shadow-sm transition-all",
            on ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  )
}

export function FormFooter({
  onCancel,
  isSaving,
  submitLabel,
}: {
  onCancel?: () => void
  isSaving?: boolean
  submitLabel: string
}) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
      )}
      <Button type="submit" disabled={isSaving} className="gap-2">
        {isSaving && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {submitLabel}
      </Button>
    </div>
  )
}

export function FormSection({
  title,
  description,
  icon,
  children,
}: {
  title: string
  description?: string
  icon?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="text-accent" aria-hidden>
              {icon}
            </span>
          )}
          <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
        </div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  )
}
