"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, User, Briefcase, Settings, 
  MessageSquare, Star, GraduationCap, Award, 
  FileText, Languages, Mic2, Heart, ShieldCheck 
} from "lucide-react"

const navGroups = [
  {
    title: "Core Content",
    items: [
      { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
      { name: "Profile", href: "/admin/profile", icon: <User className="w-4 h-4" /> },
      { name: "Projects", href: "/admin/projects", icon: <Briefcase className="w-4 h-4" /> },
    ]
  },
  {
    title: "Resume & Career",
    items: [
      { name: "Experience", href: "/admin/experience", icon: <ShieldCheck className="w-4 h-4" /> },
      { name: "Education", href: "/admin/education", icon: <GraduationCap className="w-4 h-4" /> },
      { name: "Certifications", href: "/admin/certifications", icon: <Award className="w-4 h-4" /> },
      { name: "Skills/Services", href: "/admin/services", icon: <Star className="w-4 h-4" /> },
    ]
  },
  {
    title: "Public & Social",
    items: [
      { name: "Testimonials", href: "/admin/testimonials", icon: <Heart className="w-4 h-4" /> },
      { name: "Speaking", href: "/admin/speaking", icon: <Mic2 className="w-4 h-4" /> },
      { name: "Blog Posts", href: "/admin/posts", icon: <FileText className="w-4 h-4" /> },
      { name: "Languages", href: "/admin/languages", icon: <Languages className="w-4 h-4" /> },
    ]
  },
  {
    title: "System",
    items: [
      { name: "Messages", href: "/admin/messages", icon: <MessageSquare className="w-4 h-4" /> },
      { name: "Site Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
    ]
  }
]

export const AdminNav = () => {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col p-4 space-y-8 overflow-y-auto">
      <div className="px-4 py-2">
        <h1 className="text-xl font-black tracking-tighter text-primary">ADMIN CONSOLE</h1>
      </div>

      <nav className="flex-1 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <p className="px-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
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
        ))}
      </nav>
    </div>
  )
}
