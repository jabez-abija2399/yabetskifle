"use client"

import { usePathname } from "next/navigation"
import { AdminNav, MobileNav } from "./AdminNav"

export function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Login renders bare — no sidebar chrome.
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <a
        href="#admin-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded-xs focus:border focus:border-accent focus:bg-background focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>

      <AdminNav />

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav />
        <main id="admin-content" className="flex-1 p-4 sm:p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  )
}
