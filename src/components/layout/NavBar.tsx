"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "../ui/ThemeToggle"
import { SiteCopy, t } from "@/lib/copy"

interface Props {
  copy?: SiteCopy
}

export const Navbar = ({ copy }: Props) => {
  const navLinks = [
    { name: t(copy, "nav.work", "Work"), href: "/projects" },
    { name: t(copy, "nav.journal", "Journal"), href: "/blog" },
    { name: t(copy, "nav.about", "About"), href: "/#about" },
    { name: t(copy, "nav.contact", "Contact"), href: "/#contact" },
  ]
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (pathname?.startsWith("/admin")) return null

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "py-3" : "py-5"
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between px-5 md:px-7 transition-all duration-300",
          isScrolled
            ? "max-w-3xl bg-background/70 backdrop-blur-xl border border-border rounded-full shadow-lg shadow-foreground/5 py-2.5"
            : "max-w-7xl py-2"
        )}
      >
        <Link
          href="/"
          className="font-display text-xl tracking-tight hover:opacity-80 transition-opacity"
        >
          Yabets<span className="text-signal">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active =
              link.href === pathname ||
              (link.href.startsWith("/#") && pathname === "/") ||
              (link.href !== "/" && pathname?.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors",
                  active
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.name}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="/#contact"
            className="hidden sm:inline-flex items-center gap-1.5 bg-foreground text-background px-4 h-9 rounded-full text-sm font-medium hover:bg-signal hover:text-signal-foreground transition-colors"
          >
            {t(copy, "nav.cta", "Hire me")}
          </a>
        </div>
      </div>
    </nav>
  )
}
