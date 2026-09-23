export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-hidden>
      <span className="sr-only">Loading…</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse items-center gap-4 rounded-xs border border-border bg-card px-4 py-3.5"
        >
          <div className="size-9 shrink-0 rounded-xs bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded-xs bg-muted" />
            <div className="h-2.5 w-1/2 rounded-xs bg-muted/70" />
          </div>
          <div className="h-8 w-16 rounded-xs bg-muted" />
        </div>
      ))}
    </div>
  )
}
