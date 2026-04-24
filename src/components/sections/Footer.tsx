import { SiteSettings } from "@/types/portfolio"
import { ArrowUp } from "lucide-react"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"
import Link from "next/link"

interface Props {
  settings: SiteSettings | null
}

export const Footer = ({ settings }: Props) => {
  return (
    <footer className="py-20 px-6 border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        
        {/* Branding & Legal */}
        <div className="space-y-4 text-center md:text-left">
           <h3 className="text-2xl font-black italic tracking-tighter">
              {settings?.site_name || "YABETS."}
           </h3>
           <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">
              {settings?.footer_text || `© ${new Date().getFullYear()}. All rights reserved.`}
           </p>
        </div>

        {/* Quick Links */}
        <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-zinc-400">
           <a href="#" className="hover:text-primary transition-colors">Top</a>
           <a href="#work" className="hover:text-primary transition-colors">Work</a>
           <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
           <Link href="/admin" className="hover:text-primary transition-colors opacity-50">Admin</Link>
        </div>

        {/* Socials */}
        <div className="flex items-center gap-4">
           <a href="#" className="p-3 rounded-xl bg-muted hover:bg-primary hover:text-white transition-all">
              <FaLinkedin className="w-5 h-5" />
           </a>
           <a href="#" className="p-3 rounded-xl bg-muted hover:bg-primary hover:text-white transition-all"><FaGithub className="w-5 h-5" /></a>
           <a href="#" className="p-3 rounded-xl bg-muted hover:bg-primary hover:text-white transition-all"><FaTwitter className="w-5 h-5" /></a>
        </div>
      </div>
    </footer>
  )
}
