import type { ReactNode } from "react"
import { Inbox } from "lucide-react"

interface Props {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xs border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
      <div
        className="mb-4 flex size-10 items-center justify-center rounded-xs border border-border bg-card text-muted-foreground"
        aria-hidden
      >
        {icon ?? <Inbox className="size-4" />}
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
