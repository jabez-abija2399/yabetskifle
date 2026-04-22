// A reusable "nothing here yet" message shown when a list is empty
// Used across all admin pages and public sections
import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon    // Optional icon from lucide-react
}

export const EmptyState = ({ title, description, icon: Icon }: EmptyStateProps) => {
  return (
    <div className="text-center py-20 text-muted-foreground space-y-3">
      {/* Render the icon only if one was passed */}
      {Icon && <Icon className="w-10 h-10 mx-auto opacity-30" />}
      <p className="text-lg font-medium">{title}</p>
      {description && <p className="text-sm">{description}</p>}
    </div>
  )
}
