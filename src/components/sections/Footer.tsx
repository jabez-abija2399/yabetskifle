import { SiteSettings, Profile } from "@/types/portfolio"
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { SiteCopy, t } from "@/lib/copy"

interface Props {
  settings: SiteSettings | null
  profile?: Profile | null
  copy?: SiteCopy
}

export const Footer = ({ settings, profile, copy }: Props) => {
  const socials = profile?.social_links || {}
  const year = new Date().getFullYear()
  const fullName = profile?.full_name || "Yabets Kifle"

  return (
    <footer className="mt-24 border-t border-border bg-card/60 pt-16 pb-12 px-6 md:px-12 lg:px-16 xl:px-24">
      <div className="max-w-[1600px] mx-auto space-y-12">
        {/* Top: Structured CTA & Sitemap */}
        <div className="grid md:grid-cols-12 gap-10 pb-12 border-b border-border">
          <div className="md:col-span-7 space-y-4">
            <div className="font-mono text-xs text-[#2D5F6B] dark:text-[#3E7987]">
              {t(copy, "footer.cta_eyebrow", "08. Ready to collaborate?")}
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              {t(copy, "footer.cta_title", "Let's engineer something robust together.")}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md font-sans">
              Open for full-time engineering roles, high-impact contracts, and design systems architecture.
            </p>
            <div className="pt-2">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-[#2D5F6B] text-white dark:bg-[#3E7987] dark:text-background h-11 px-5 rounded-xs font-mono text-xs font-medium hover:bg-[#234b54] transition-colors"
              >
                <span>[ {t(copy, "footer.cta_button", "Initiate project discussion")} ]</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-8 md:justify-self-end">
            <div className="space-y-3 font-mono text-xs">
              <span className="text-muted-foreground block text-[11px]">
                {t(copy, "footer.sitemap_label", "Index map")}
              </span>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-[#2D5F6B] transition-colors">01. Home</Link></li>
                <li><Link href="/projects" className="hover:text-[#2D5F6B] transition-colors">02. Projects</Link></li>
                <li><Link href="/blog" className="hover:text-[#2D5F6B] transition-colors">03. Journal</Link></li>
                <li><Link href="/#about" className="hover:text-[#2D5F6B] transition-colors">04. About</Link></li>
                <li><Link href="/#contact" className="hover:text-[#2D5F6B] transition-colors">05. Contact</Link></li>
              </ul>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <span className="text-muted-foreground block text-[11px]">
                {t(copy, "footer.elsewhere_label", "Endpoints")}
              </span>
              <ul className="space-y-2">
                {socials.github && (
                  <li>
                    <a href={socials.github} target="_blank" rel="noreferrer" className="hover:text-[#2D5F6B] transition-colors inline-flex items-center gap-1">
                      GitHub <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </li>
                )}
                {socials.linkedin && (
                  <li>
                    <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#2D5F6B] transition-colors inline-flex items-center gap-1">
                      LinkedIn <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </li>
                )}
                {socials.twitter && (
                  <li>
                    <a href={socials.twitter} target="_blank" rel="noreferrer" className="hover:text-[#2D5F6B] transition-colors inline-flex items-center gap-1">
                      Twitter <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </li>
                )}
                {socials.email && (
                  <li>
                    <a href={`mailto:${socials.email}`} className="hover:text-[#2D5F6B] transition-colors inline-flex items-center gap-1">
                      Email <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Colophon Block */}
        <div className="grid sm:grid-cols-3 gap-6 p-4 border border-border bg-secondary/40 rounded-xs font-mono text-xs text-muted-foreground">
          <div>
            <span className="block text-[10px] text-muted-foreground/80">System & Engine</span>
            <span className="text-foreground">Next.js 16 · React 18 · TypeScript</span>
          </div>
          <div>
            <span className="block text-[10px] text-muted-foreground/80">Design Specification</span>
            <span className="text-foreground">Systems, not screens · Field-notebook</span>
          </div>
          <div className="sm:text-right">
            <span className="block text-[10px] text-muted-foreground/80">System ID</span>
            <span className="text-[#2D5F6B] dark:text-[#3E7987]">YK-{year}-PROD</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border font-mono text-xs text-muted-foreground">
          <p>
            © {year} {fullName}. {settings?.footer_text || "Engineered with precision."}
          </p>
          <div className="flex items-center gap-2">
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="w-8 h-8 border border-border rounded-xs flex items-center justify-center hover:border-foreground hover:text-foreground transition-colors">
                <FaGithub className="w-3.5 h-3.5" />
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-8 h-8 border border-border rounded-xs flex items-center justify-center hover:border-foreground hover:text-foreground transition-colors">
                <FaLinkedin className="w-3.5 h-3.5" />
              </a>
            )}
            {socials.twitter && (
              <a href={socials.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="w-8 h-8 border border-border rounded-xs flex items-center justify-center hover:border-foreground hover:text-foreground transition-colors">
                <FaTwitter className="w-3.5 h-3.5" />
              </a>
            )}
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-8 h-8 border border-border rounded-xs flex items-center justify-center hover:border-foreground hover:text-foreground transition-colors">
                <FaInstagram className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
