import { Info } from "lucide-react"

interface Props {
  message: string
}

export const AdminEmptyState = ({ message }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-border rounded-[2rem] bg-muted/20 text-center">
      <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mb-6">
        <Info className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground font-medium max-w-xs">{message}</p>
    </div>
  )
}
