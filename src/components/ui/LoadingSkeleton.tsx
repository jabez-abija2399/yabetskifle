// Pass rows={3} to show 3 animated placeholder bars
// Used whenever data is loading from Supabase
interface LoadingSkeletonProps {
  rows?: number    // How many skeleton rows to show
  height?: string  // Height of each row
}

export const LoadingSkeleton = ({
  rows = 3,
  height = "h-20",
}: LoadingSkeletonProps) => {
  // Array(rows).fill(0) creates an array of {rows} items to map over
  return (
    <div className="space-y-3">
      {Array(rows).fill(0).map((_, i) => (
        <div key={i} className={`${height} rounded-xl bg-muted animate-pulse`} />
      ))}
    </div>
  )
}
