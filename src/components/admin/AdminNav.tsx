"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, User, Briefcase, Settings,
  MessageSquare, Star, GraduationCap,
  FileText, Languages, ShieldCheck,
  Package, HelpCircle, Columns,
  AwardIcon, Type
} from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

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
  "/admin/sections",
  "/admin/skills",
  "/admin/copy",
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
      { name: "Skills", href: "/admin/skills", icon: <AwardIcon className="w-4 h-4" /> },
    ]
  },
  {
    title: "Structure & Copy",
    items: [
      { name: "Site Copy", href: "/admin/copy", icon: <Type className="w-4 h-4" /> },
      { name: "Section Manager", href: "/admin/sections", icon: <Columns className="w-4 h-4 text-primary" /> },
      { name: "Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
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
    title: "Intellectual Property",
    items: [
      { name: "Blog Posts", href: "/admin/posts", icon: <FileText className="w-4 h-4" /> },
      { name: "FAQs", href: "/admin/faq", icon: <HelpCircle className="w-4 h-4" /> },
      { name: "Languages", href: "/admin/languages", icon: <Languages className="w-4 h-4" /> },
    ]
  }
]

export const AdminNav = () => {
  const pathname = usePathname()

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    )
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <nav className="w-64 border-r border-border h-screen sticky top-0 p-6 flex flex-col bg-card/50 backdrop-blur-sm">
      {/* Brand Branding */}
      <div className="flex items-center gap-2 px-2 mb-10 shrink-0">
         <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white italic font-black">Y</div>
         <span className="font-black italic tracking-tighter uppercase">Admin Panel</span>
      </div>

      {/* Main Nav Items */}
      <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2 mb-6">
        {navGroups.map((group) => {
          const allowedItems = group.items.filter(item => ALLOWED_ROUTES.includes(item.href))
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

      {/* THEME + SIGN OUT */}
      <div className="pt-6 border-t border-border mt-auto shrink-0 space-y-3">
         <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-1">Appearance</p>
            <ThemeToggle size="full" />
         </div>
         <button
           onClick={handleLogout}
           className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-full text-xs font-medium text-destructive hover:bg-destructive/10 transition-all border border-transparent hover:border-destructive/20"
         >
            <ShieldCheck className="w-3.5 h-3.5" /> Sign out
         </button>
      </div>
    </nav>
  )
}
