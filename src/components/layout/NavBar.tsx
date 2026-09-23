"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "../ui/ThemeToggle"
import { SiteCopy, t } from "@/lib/copy"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

interface Props {
  copy?: SiteCopy
}

export const Navbar = ({ copy }: Props) => {
  const navLinks = [
    { num: "01", name: t(copy, "nav.work", "Work"), href: "/projects" },
    { num: "02", name: t(copy, "nav.journal", "Journal"), href: "/blog" },
    { num: "03", name: t(copy, "nav.about", "About"), href: "/#about" },
    { num: "04", name: t(copy, "nav.contact", "Contact"), href: "/#contact" },
  ]
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Lock body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  // Close menu on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Close menu on route change (adjust state during render — no effect needed)
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    if (isMenuOpen) setIsMenuOpen(false)
  }

  if (pathname?.startsWith("/admin")) return null

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b",
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-border shadow-xs"
            : "bg-background/80 backdrop-blur-xs border-border/70"
        )}
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 md:px-12 lg:px-16 xl:px-24 h-16">
          {/* Brand mark / Technical identifier */}
          <Link
            href="/"
            className="flex items-center gap-3 font-mono text-sm tracking-tight text-foreground hover:text-accent transition-colors"
          >
            <span className="font-semibold text-foreground">Yabets Kifle</span>
            <span className="text-muted-foreground/60 hidden sm:inline">/</span>
            <span className="text-xs text-muted-foreground hidden sm:inline font-normal">sys.engineer</span>
          </Link>

          {/* Desktop nav — Monospace technical index links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const active =
                !link.href.startsWith("/#") &&
                (link.href === pathname ||
                  (link.href !== "/" && pathname?.startsWith(link.href)))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-mono text-xs transition-colors flex items-center gap-1.5 py-1",
                    active
                      ? "text-accent font-medium border-b border-accent"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="text-[10px] text-muted-foreground/70">{link.num}.</span>
                  <span>{link.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right rail: Status dot + Theme toggle + Contact CTA */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Status indicator — Muted rust-red accent used specifically here */}
            <div className="hidden lg:flex items-center gap-2 border border-border px-2.5 py-1 rounded-sm bg-card text-xs font-mono text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-signal" />
              </span>
              <span className="text-[11px]">available</span>
            </div>

            <ThemeToggle size="compact" />

            <Link
              href="/#contact"
              className="hidden sm:inline-flex items-center gap-1.5 border border-accent text-accent px-3.5 py-1.5 rounded-sm font-mono text-xs hover:bg-accent hover:text-accent-foreground dark:hover:text-background transition-colors"
            >
              {t(copy, "nav.cta", "Initiate contact")}
            </Link>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              className="md:hidden inline-flex items-center justify-center w-9 h-9 border border-border rounded-sm hover:border-foreground transition-colors"
            >
              <Menu className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] md:hidden bg-background/98 flex flex-col backdrop-blur-md"
          >
            {/* Top bar */}
            <div className="px-6 h-16 border-b border-border flex items-center justify-between">
              <div className="font-mono text-sm text-foreground">
                <span className="font-semibold">Yabets Kifle</span>
                <span className="text-xs text-muted-foreground ml-2">[index]</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex items-center justify-center w-9 h-9 border border-border rounded-sm hover:border-foreground transition-colors"
              >
                <X className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-6 py-10 flex flex-col justify-center space-y-4">
              {navLinks.map((link) => {
                const active =
                  !link.href.startsWith("/#") &&
                  (link.href === pathname ||
                    (link.href !== "/" && pathname?.startsWith(link.href)))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-baseline justify-between py-3 border-b border-border text-left group",
                      active ? "text-accent" : "text-foreground"
                    )}
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-muted-foreground">{link.num}.</span>
                      <span className="text-2xl font-medium">{link.name}</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="px-6 pb-8 pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>Status</span>
                <span className="flex items-center gap-1.5 text-foreground">
                  <span className="inline-block w-2 h-2 rounded-full bg-signal" />
                  Open to work
                </span>
              </div>
              <Link
                href="/#contact"
                onClick={() => setIsMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 border border-accent bg-accent text-accent-foreground py-3 rounded-sm font-mono text-xs font-medium"
              >
                {t(copy, "nav.cta", "Initiate contact")} <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
