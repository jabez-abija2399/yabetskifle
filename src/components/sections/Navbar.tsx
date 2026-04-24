"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Listen for scroll to add background blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Expertise", href: "#services" },
    { name: "Work", href: "#work" },
    { name: "Journey", href: "#experience" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? "py-4 bg-background/80 backdrop-blur-xl border-b border-border" : "py-8 bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-black italic tracking-tighter group flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white italic group-hover:rotate-12 transition-transform">Y</div>
           <span>YABETS.</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
           {navLinks.map((link) => (
             <a 
               key={link.name} 
               href={link.href} 
               className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors"
             >
                {link.name}
             </a>
           ))}
           <Button size="sm" className="rounded-full px-6 font-bold gap-2">
              Get in Touch <ArrowRight className="w-4 h-4" />
           </Button>
        </div>

        {/* Mobile Toggle */}
        <button 
           className="md:hidden p-2 rounded-xl bg-muted"
           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
           {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-border p-6 flex flex-col gap-6 md:hidden animate-in fade-in slide-in-from-top-4">
           {navLinks.map((link) => (
             <a 
               key={link.name} 
               href={link.href} 
               onClick={() => setIsMobileMenuOpen(false)}
               className="text-xl font-black italic tracking-tighter"
             >
                {link.name}
             </a>
           ))}
        </div>
      )}
    </nav>
  )
}
