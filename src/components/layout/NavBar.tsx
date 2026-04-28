"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Journal", href: "/blog" },
  { name: "About", href: "/#about" },
  { name: "Contact", href: "/#contact" },
]

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Track scroll to change background from transparent to blur
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 🛡️ Hide Navbar on Admin & Project Detail pages
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/projects/")) return null;

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border py-3" : "bg-transparent"
    )}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
          YABETS<span className="text-primary">.K</span>
        </Link>

        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/admin">
            <Button variant="default" size="sm" className="rounded-full px-5">
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
