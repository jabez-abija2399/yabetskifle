import { SiteSettings, Profile } from "@/types/portfolio"
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa"
import Link from "next/link"

interface Props {
  settings: SiteSettings | null
  profile?: Profile | null
}

export const Footer = ({ settings, profile }: Props) => {
  const socials = profile?.social_links || {}

  return (
    <footer className="py-20 px-6 border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        
        {/* Branding & Legal */}
        <div className="space-y-4 text-center md:text-left">
           <h3 className="text-2xl font-black italic tracking-tighter">
              {settings?.site_name || "YABETS.K"}
           </h3>
           <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
              {settings?.footer_text || `© ${new Date().getFullYear()} Crafted by Yabets Kifle.`}
           </p>
        </div>

        {/* Quick Links */}
        <ul className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
           <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
           <li><Link href="/projects" className="hover:text-primary transition-colors">Projects</Link></li>
           <li><Link href="/blog" className="hover:text-primary transition-colors">Journal</Link></li>
           <li><Link href="/#about" className="hover:text-primary transition-colors">About</Link></li>
           {/* <li><Link href="/admin" className="hover:text-primary transition-colors opacity-30">Management</Link></li> */}
        </ul>

        {/* Dynamic Socials */}
        <div className="flex items-center gap-3">
           {socials.linkedin && (
             <a href={socials.linkedin} target="_blank" className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <FaLinkedin className="w-4 h-4" />
             </a>
           )}
           {socials.github && (
             <a href={socials.github} target="_blank" className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <FaGithub className="w-4 h-4" />
             </a>
           )}
           {socials.twitter && (
             <a href={socials.twitter} target="_blank" className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <FaTwitter className="w-4 h-4" />
             </a>
           )}
           {socials.instagram && (
             <a href={socials.instagram} target="_blank" className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <FaInstagram className="w-4 h-4" />
             </a>
           )}
        </div>
      </div>
    </footer>
  )
}
