// This layout wraps ALL pages inside /admin automatically
// Next.js applies it to /admin, /admin/projects, /admin/about, etc.
import Link from "next/link"
import { LayoutDashboard, Code2, User, Wrench, Mail, ArrowLeft } from "lucide-react"

// Define the nav items in a data array - easy to add new ones!
const adminNavItems = [
  { href: "/admin",          label: "Hero Section",    icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects",        icon: Code2 },
  { href: "/admin/about",    label: "About Me",        icon: User },
  { href: "/admin/skills",   label: "Skills",          icon: Wrench },
  { href: "/admin/contact",  label: "Contact Info",    icon: Mail },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border/50 bg-background/80 backdrop-blur-sm p-6 flex flex-col gap-2 sticky top-0 h-screen">
        
        {/* Logo */}
        <div className="mb-6">
          <h2 className="text-lg font-extrabold tracking-tight">Yabetskifle Admin</h2>
          <p className="text-xs text-muted-foreground">Content Management</p>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 flex-1">
          {adminNavItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Back to Portfolio link at bottom */}
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-border/50 mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
