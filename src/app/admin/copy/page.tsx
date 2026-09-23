"use client"

import { useEffect, useMemo, useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { EmptyState } from "@/components/admin/EmptyState"
import { ListSkeleton } from "@/components/admin/ListSkeleton"
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
      <div className="mx-auto max-w-5xl">
        <PageHeader index="05" title="Site copy" description="Loading…" />
        <ListSkeleton rows={5} />
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="mx-auto max-w-5xl">
        <PageHeader
          index="05"
          title="Site copy"
          description="Every label, title, and button across the public site."
        />
        <EmptyState
          title="Site copy is empty"
          description="Run scripts/migration-site-copy.sql in the Supabase SQL editor first."
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl pb-32">
      <PageHeader
        index="05"
        title="Site copy"
        description="Wrap any phrase in *asterisks* to render it italic on the public site."
        actions={
          <Button
            onClick={handleSave}
            disabled={saving || dirtyCount === 0}
            className="gap-2"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Save className="size-4" aria-hidden />
            )}
            Save changes
          </Button>
        }
      />

      <div className="mb-6 flex items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by key, label, or text…"
            aria-label="Search site copy"
            className="h-9 pl-9 text-sm"
          />
        </div>
        <p className="hidden label-mono text-muted-foreground md:block">
          {dirtyCount > 0 ? (
            <span className="text-signal">{dirtyCount} unsaved</span>
          ) : (
            "All saved"
          )}
        </p>
      </div>

      <div className="space-y-10">
        {Object.entries(filtered).map(([groupName, items]) => (
          <section key={groupName} className="space-y-3">
            <header className="flex items-baseline gap-3 border-b border-border pb-3">
              <span className="label-mono text-muted-foreground">
                {groupName}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {items.length} field{items.length === 1 ? "" : "s"}
              </span>
            </header>

            <div className="space-y-2">
              {items.map((r) => {
                const isLong =
                  (edits[r.key] || "").length > 80 || (edits[r.key] || "").includes("\n")
                const isDirty = (r.value || "") !== (edits[r.key] || "")
                return (
                  <div
                    key={r.key}
                    className={`grid grid-cols-1 gap-4 rounded-xs border p-4 transition-colors md:grid-cols-12 ${
                      isDirty ? "border-signal bg-signal/5" : "border-border bg-card"
                    }`}
                  >
                    <div className="space-y-1 md:col-span-4">
                      <code className="break-all font-mono text-xs text-foreground">
                        {r.key}
                      </code>
                      {r.description && (
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {r.description}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-8">
                      {isLong ? (
                        <textarea
                          value={edits[r.key] || ""}
                          onChange={(e) => setEdits({ ...edits, [r.key]: e.target.value })}
                          rows={Math.min(8, Math.max(2, (edits[r.key] || "").split("\n").length + 1))}
                          aria-label={r.key}
                          className="w-full rounded-xs border border-input bg-background p-3 font-mono text-sm leading-relaxed text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      ) : (
                        <Input
                          value={edits[r.key] || ""}
                          onChange={(e) => setEdits({ ...edits, [r.key]: e.target.value })}
                          aria-label={r.key}
                          className="h-9 text-sm"
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

      {dirtyCount > 0 && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-xs border border-border bg-background/95 px-4 py-2 shadow-lg backdrop-blur">
          <span className="label-mono text-signal">
            {dirtyCount} unsaved
          </span>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
