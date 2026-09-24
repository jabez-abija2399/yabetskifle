"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import {
  LayoutDashboard, Briefcase, Package, GraduationCap, Star,
  FileText, MessageSquare, HelpCircle, Languages,
  User, AwardIcon, School,
  Columns, Type, Settings, Wand2,
  ShieldCheck, Menu, X, BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

interface NavItem {
  name: string
  href: string
  icon: ReactNode
}

interface NavGroup {
  index: string
  title: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    index: "01",
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="size-4" /> },
      { name: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="size-4" /> },
    ],
  },
  {
    index: "02",
    title: "Content",
    items: [
      { name: "Projects", href: "/admin/projects", icon: <Briefcase className="size-4" /> },
      { name: "Services", href: "/admin/services", icon: <Package className="size-4" /> },
      { name: "Experience", href: "/admin/experiences", icon: <GraduationCap className="size-4" /> },
      { name: "Testimonials", href: "/admin/testimonials", icon: <Star className="size-4" /> },
    ],
  },
  {
    index: "03",
    title: "Voice",
    items: [
      { name: "Posts", href: "/admin/posts", icon: <FileText className="size-4" /> },
      { name: "Messages", href: "/admin/messages", icon: <MessageSquare className="size-4" /> },
      { name: "FAQs", href: "/admin/faq", icon: <HelpCircle className="size-4" /> },
      { name: "Languages", href: "/admin/languages", icon: <Languages className="size-4" /> },
    ],
  },
  {
    index: "04",
    title: "Identity",
    items: [
      { name: "Profile", href: "/admin/profile", icon: <User className="size-4" /> },
      { name: "Skills", href: "/admin/skills", icon: <AwardIcon className="size-4" /> },
      { name: "Education", href: "/admin/education", icon: <School className="size-4" /> },
      { name: "Certifications", href: "/admin/certifications", icon: <AwardIcon className="size-4" /> },
    ],
  },
  {
    index: "05",
    title: "System",
    items: [
      { name: "Sections", href: "/admin/sections", icon: <Columns className="size-4" /> },
      { name: "Site copy", href: "/admin/copy", icon: <Type className="size-4" /> },
      { name: "Settings", href: "/admin/settings", icon: <Settings className="size-4" /> },
      { name: "Apply Studio", href: "/admin/apply", icon: <Wand2 className="size-4" /> },
    ],
  },
]

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin"
  return pathname === href || pathname.startsWith(`${href}/`)
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-2 px-2" aria-label="Admin home">
      <span className="flex size-7 items-center justify-center rounded-xs bg-primary text-xs font-black text-primary-foreground italic">
        Y
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-foreground">
        Admin
      </span>
    </Link>
  )
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Admin" className="flex-1 space-y-5 overflow-y-auto py-1">
      {NAV_GROUPS.map((group) => (
        <div key={group.index} className="space-y-1">
          <p className="px-2 label-mono text-muted-foreground">
            {group.index} / {group.title}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-8 items-center gap-2.5 border-l-2 px-2.5 text-[13px] transition-colors",
                    active
                      ? "border-accent bg-secondary font-medium text-foreground"
                      : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground"
                  )}
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
  )
}

function NavFooter({ onNavigate }: { onNavigate?: () => void }) {
  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    )
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <div className="shrink-0 space-y-3 border-t border-border pt-4">
      <div className="space-y-1.5">
        <p className="px-2 label-mono text-muted-foreground">
          Appearance
        </p>
        <div className="px-2">
          <ThemeToggle size="full" />
        </div>
      </div>
      <button
        onClick={() => {
          onNavigate?.()
          handleLogout()
        }}
        className="flex h-8 w-full items-center gap-2.5 border-l-2 border-transparent px-2.5 text-[13px] text-muted-foreground transition-colors hover:border-signal hover:bg-destructive/5 hover:text-destructive"
      >
        <ShieldCheck className="size-4" />
        Sign out
      </button>
    </div>
  )
}

function BrandRow() {
  return (
    <div className="mb-6 shrink-0">
      <Brand />
    </div>
  )
}

/** Desktop sidebar. */
export function AdminNav() {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-card/50 p-4 lg:flex">
      <BrandRow />
      <NavLinks />
      <div className="mt-6">
        <NavFooter />
      </div>
    </aside>
  )
}

/** Mobile top bar + drawer. */
export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const [lastPath, setLastPath] = useState(pathname)

  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <div className="lg:hidden">
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          aria-expanded={open}
          className="flex size-9 items-center justify-center rounded-xs border border-border text-muted-foreground hover:text-foreground"
        >
          <Menu className="size-4" />
        </button>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-label="Navigation"
            className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-background p-4 animate-in slide-in-from-left duration-200"
          >
            <div className="mb-6 flex shrink-0 items-center justify-between">
              <Brand />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="flex size-9 items-center justify-center rounded-xs border border-border text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <div className="mt-6">
              <NavFooter onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
