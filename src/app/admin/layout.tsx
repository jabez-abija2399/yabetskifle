import { AdminNav } from "@/components/admin/AdminNav"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-background min-h-screen">
      {/* Our new Sidebar */}
      <AdminNav />
      
      {/* The main content area */}
      <main className="flex-1 overflow-y-auto p-10">
        {children}
      </main>
    </div>
  )
}
