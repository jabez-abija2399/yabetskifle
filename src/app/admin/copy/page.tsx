"use client"

import { useEffect, useMemo, useState } from "react"
import { PortfolioService } from "@/services/portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2, Save, Search } from "lucide-react"

type Row = {
  key: string
  value: string
  description?: string
  group_name?: string
  sort_order?: number
}

export default function CopyAdminPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState("")

  useEffect(() => {
    PortfolioService.getSiteCopyRows()
      .then((data) => {
        setRows(data)
        setEdits(Object.fromEntries(data.map((r) => [r.key, r.value || ""])))
      })
      .catch((e) => toast.error(`Could not load copy: ${e.message}`))
      .finally(() => setLoading(false))
  }, [])

  const grouped = useMemo(() => {
    const map: Record<string, Row[]> = {}
    for (const r of rows) {
      const g = r.group_name || "Other"
      if (!map[g]) map[g] = []
      map[g].push(r)
    }
    for (const g of Object.keys(map)) {
      map[g].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    }
    return map
  }, [rows])

  const filtered = useMemo(() => {
    if (!filter.trim()) return grouped
    const q = filter.toLowerCase()
    const out: Record<string, Row[]> = {}
    for (const [g, items] of Object.entries(grouped)) {
      const matches = items.filter(
        (r) =>
          r.key.toLowerCase().includes(q) ||
          (r.description || "").toLowerCase().includes(q) ||
          (edits[r.key] || "").toLowerCase().includes(q),
      )
      if (matches.length > 0) out[g] = matches
    }
    return out
  }, [grouped, filter, edits])

  const dirtyCount = useMemo(() => {
    return rows.filter((r) => (r.value || "") !== (edits[r.key] || "")).length
  }, [rows, edits])

  const handleSave = async () => {
    const updates = rows
      .filter((r) => (r.value || "") !== (edits[r.key] || ""))
      .map((r) => ({ key: r.key, value: edits[r.key] }))
    if (updates.length === 0) return
    setSaving(true)
    try {
      await PortfolioService.updateSiteCopy(updates)
      // Refresh from DB to get authoritative values
      const fresh = await PortfolioService.getSiteCopyRows()
      setRows(fresh)
      setEdits(Object.fromEntries(fresh.map((r) => [r.key, r.value || ""])))
      toast.success(`Saved ${updates.length} change${updates.length === 1 ? "" : "s"}.`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Save failed"
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-20 space-y-6 text-center">
        <h1 className="font-display text-4xl">Site copy is empty</h1>
        <p className="text-muted-foreground">
          You haven&rsquo;t run the migration yet. Open the Supabase SQL Editor and paste the
          contents of <code className="bg-muted px-2 py-1 rounded">scripts/migration-site-copy.sql</code>.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto pb-32">
      {/* Header */}
      <div className="flex items-end justify-between gap-6 border-b border-border pb-8 mb-10">
        <div className="space-y-2">
          <p className="eyebrow">Admin</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight">
            Edit <span className="italic">site copy</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Every label, title, subtitle, and button across the public site. Wrap any phrase in
            <code className="bg-muted px-1 mx-1 rounded text-xs">*asterisks*</code> in a title to render it italic.
          </p>
        </div>
      </div>

      {/* Sticky toolbar */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border py-4 -mx-10 px-10 flex items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by key, label, or text…"
            className="pl-9 h-10 text-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground hidden md:block">
            {dirtyCount > 0 ? (
              <span className="text-foreground font-medium">{dirtyCount} unsaved change{dirtyCount === 1 ? "" : "s"}</span>
            ) : (
              "All saved"
            )}
          </p>
          <Button
            onClick={handleSave}
            disabled={saving || dirtyCount === 0}
            className="rounded-full h-10 px-5 gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save changes
          </Button>
        </div>
      </div>

      {/* Groups */}
      <div className="space-y-12">
        {Object.entries(filtered).map(([groupName, items]) => (
          <section key={groupName} className="space-y-4">
            <header className="flex items-baseline gap-3 border-b border-border pb-3">
              <h2 className="font-display text-2xl">{groupName}</h2>
              <span className="font-mono text-xs text-muted-foreground">
                {items.length} field{items.length === 1 ? "" : "s"}
              </span>
            </header>

            <div className="space-y-4">
              {items.map((r) => {
                const isLong = (edits[r.key] || "").length > 80 || (edits[r.key] || "").includes("\n")
                const isDirty = (r.value || "") !== (edits[r.key] || "")
                return (
                  <div
                    key={r.key}
                    className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-5 rounded-2xl border ${
                      isDirty ? "border-signal bg-signal/5" : "border-border bg-card"
                    } transition-colors`}
                  >
                    <div className="md:col-span-4 space-y-1">
                      <code className="text-xs font-mono text-foreground break-all">{r.key}</code>
                      {r.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed">{r.description}</p>
                      )}
                    </div>
                    <div className="md:col-span-8">
                      {isLong ? (
                        <textarea
                          value={edits[r.key] || ""}
                          onChange={(e) => setEdits({ ...edits, [r.key]: e.target.value })}
                          rows={Math.min(8, Math.max(2, (edits[r.key] || "").split("\n").length + 1))}
                          className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm leading-relaxed font-mono"
                        />
                      ) : (
                        <Input
                          value={edits[r.key] || ""}
                          onChange={(e) => setEdits({ ...edits, [r.key]: e.target.value })}
                          className="text-sm"
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Floating save reminder */}
      {dirtyCount > 0 && (
        <div className="fixed bottom-6 right-6 bg-foreground text-background rounded-full px-5 py-3 text-sm font-medium shadow-lg flex items-center gap-3">
          {dirtyCount} unsaved
          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            variant="secondary"
            className="rounded-full h-8 px-4"
          >
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
          </Button>
        </div>
      )}
    </div>
  )
}
