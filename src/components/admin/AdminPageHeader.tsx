// Used on every admin page: Projects, About, Skills, Contact
// Just pass a title, optional subtitle, and optional action button
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface AdminPageHeaderProps {
  title: string
  subtitle?: string
  onAdd?: () => void       // Optional — not all pages have an "Add" button
  addLabel?: string        // Custom label: "Add Project", "Add Skill", etc.
}

export const AdminPageHeader = ({
  title,
  subtitle,
  onAdd,
  addLabel = "Add New",  // Default value if not provided
}: AdminPageHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-extrabold">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
        )}
      </div>
      {/* Only render the button if onAdd is provided */}
      {onAdd && (
        <Button onClick={onAdd} className="gap-2 rounded-full px-6">
          <Plus className="w-4 h-4" />
          {addLabel}
        </Button>
      )}
    </div>
  )
}
