"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, User, Briefcase, Settings, 
  MessageSquare, Star, GraduationCap, Award, 
  FileText, Languages, Mic2, Heart, ShieldCheck,
  Package, HelpCircle
} from "lucide-react"

// 🛡️ PERMISSION LIST: Only include routes that are implemented and allowed
const ALLOWED_ROUTES = [
  "/admin",
  "/admin/profile",
  "/admin/projects",
  "/admin/services",
  "/admin/experiences",
  "/admin/testimonials",
  "/admin/messages",
  "/admin/settings",
  "/admin/posts",
  "/admin/faq",
  "/admin/languages",
]

const navGroups = [
  {
    title: "Core Content",
    items: [
      { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
      { name: "Profile", href: "/admin/profile", icon: <User className="w-4 h-4" /> },
      { name: "Projects", href: "/admin/projects", icon: <Briefcase className="w-4 h-4" /> },
      { name: "Services", href: "/admin/services", icon: <Package className="w-4 h-4" /> },
      { name: "Experience", href: "/admin/experiences", icon: <GraduationCap className="w-4 h-4" /> },
    ]
  },
  {
    title: "Community",
    items: [
      { name: "Messages", href: "/admin/messages", icon: <MessageSquare className="w-4 h-4" /> },
      { name: "Testimonials", href: "/admin/testimonials", icon: <Star className="w-4 h-4" /> },
    ]
  },
  {
    title: "Journal & Setup",
    items: [
      { name: "Blog Posts", href: "/admin/posts", icon: <FileText className="w-4 h-4" /> },
      { name: "FAQs", href: "/admin/faq", icon: <HelpCircle className="w-4 h-4" /> },
      { name: "Languages", href: "/admin/languages", icon: <Languages className="w-4 h-4" /> },
      { name: "Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
    ]
  }
]

export const AdminNav = () => {
  const pathname = usePathname()

  return (
    <nav className="w-64 border-r border-border h-screen sticky top-0 p-6 space-y-8 bg-card/50 backdrop-blur-sm overflow-y-auto">
      <div className="flex items-center gap-2 px-2 mb-10">
         <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white italic font-black">Y</div>
         <span className="font-black italic tracking-tighter">ADMIN PANEL</span>
      </div>

      <div className="space-y-6">
        {navGroups.map((group) => {
          // Filter out items that are not in the ALLOWED_ROUTES
          const allowedItems = group.items.filter(item => ALLOWED_ROUTES.includes(item.href))
          
          // Don't render the group title if no items are allowed
          if (allowedItems.length === 0) return null

          return (
            <div key={group.title} className="space-y-2">
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] px-2 font-mono">
                {group.title}
              </p>
              <div className="space-y-1">
                {allowedItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                        isActive 
                          ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
