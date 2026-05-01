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
    { name: t(copy, "nav.work", "Work"), href: "/projects" },
    { name: t(copy, "nav.journal", "Journal"), href: "/blog" },
    { name: t(copy, "nav.about", "About"), href: "/#about" },
    { name: t(copy, "nav.contact", "Contact"), href: "/#contact" },
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

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  if (pathname?.startsWith("/admin")) return null

  return (
    <>
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

          {/* Desktop nav */}
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

          {/* Right side: theme + CTA + mobile menu trigger */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="/#contact"
              className="hidden sm:inline-flex items-center gap-1.5 bg-foreground text-background px-4 h-9 rounded-full text-sm font-medium hover:bg-signal hover:text-signal-foreground transition-colors"
            >
              {t(copy, "nav.cta", "Hire me")}
            </a>
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-border hover:border-foreground transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen mobile menu overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] md:hidden bg-background flex flex-col"
          >
            {/* Background flair */}
            <div className="absolute inset-0 bg-grid text-foreground/40 pointer-events-none" />
            <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-signal/15 blur-[120px] rounded-full pointer-events-none" />

            {/* Top bar (matches Navbar layout) */}
            <div className="relative px-5 pt-5 flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="font-display text-xl tracking-tight"
              >
                Yabets<span className="text-signal">.</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border hover:border-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Links */}
            <nav className="relative flex-1 flex flex-col justify-center px-8 gap-1">
              {navLinks.map((link, i) => {
                const num = String(i + 1).padStart(2, "0")
                const active =
                  link.href === pathname ||
                  (link.href.startsWith("/#") && pathname === "/") ||
                  (link.href !== "/" && pathname?.startsWith(link.href))
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "group flex items-baseline gap-4 py-3 border-b border-border",
                        active && "text-signal"
                      )}
                    >
                      <span className="font-mono text-xs text-muted-foreground">{num}</span>
                      <span className="font-display text-5xl leading-tight flex-1">
                        {link.name}
                      </span>
                      <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Footer CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="relative px-8 pb-10 pt-6 border-t border-border space-y-4"
            >
              <Link
                href="/#contact"
                onClick={() => setIsMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 bg-foreground text-background h-13 py-4 rounded-full text-sm font-medium"
              >
                {t(copy, "nav.cta", "Hire me")} <ArrowUpRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-muted-foreground text-center font-mono uppercase tracking-wider">
                {t(copy, "hero.status_text", "Open to work")}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
