"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "../ui/ThemeToggle"
import { SiteCopy, t } from "@/lib/copy"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { Magnetic } from "@/components/interactive/Magnetic"

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

  const isActive = (href: string) =>
    !href.startsWith("/#") && (href === pathname || (href !== "/" && pathname?.startsWith(href)))

  return (
    <>
      {/* Floating glass bar — sits above content, never full-bleed */}
      <header className="pointer-events-none fixed inset-x-0 top-4 z-50 px-4">
        <div
          className={cn(
            "pointer-events-auto mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 rounded-full border pl-5 pr-2 transition-all duration-300",
            isScrolled
              ? "border-border bg-background/80 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.5)] backdrop-blur-xl"
              : "border-border/60 bg-background/50 backdrop-blur-md"
          )}
        >
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground transition-transform group-hover:rotate-12">
              YK
            </span>
            <span className="hidden sm:inline">Yabets Kifle</span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm transition-colors",
                  isActive(link.href)
                    ? "bg-foreground/10 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right rail */}
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 px-2 text-xs text-muted-foreground lg:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span>Available</span>
            </div>

            <ThemeToggle size="compact" />

            <Magnetic className="hidden sm:inline-block">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
              >
                {t(copy, "nav.cta", "Let's talk")}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Magnetic>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border md:hidden"
            >
              <Menu className="h-4 w-4 text-foreground" />
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
            className="fixed inset-0 z-[60] flex flex-col bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex h-20 items-center justify-between px-6">
              <span className="text-sm font-semibold text-foreground">Yabets Kifle</span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border"
              >
                <X className="h-4 w-4 text-foreground" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-2 px-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.35 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "group flex items-center justify-between border-b border-border py-4 text-4xl font-semibold tracking-tight",
                      isActive(link.href) ? "text-accent" : "text-foreground"
                    )}
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-muted-foreground">{link.num}</span>
                      {link.name}
                    </span>
                    <ArrowUpRight className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="px-6 pb-8">
              <Link
                href="/#contact"
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-4 text-sm font-medium text-accent-foreground"
              >
                {t(copy, "nav.cta", "Let's talk")} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
