import { SiteSettings, Profile } from "@/types/portfolio"
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { SiteCopy, t, renderRichLines } from "@/lib/copy"

interface Props {
  settings: SiteSettings | null
  profile?: Profile | null
  copy?: SiteCopy
}

export const Footer = ({ settings, profile, copy }: Props) => {
  const socials = profile?.social_links || {}
  const year = new Date().getFullYear()
  const fullName = profile?.full_name || "Yabets Kifle"
  const lastName = fullName.split(" ").slice(1).join(" ") || "Kifle"
  const firstName = fullName.split(" ")[0] || "Yabets"

  return (
    <footer className="relative mt-32 px-6 md:px-12 lg:px-16 xl:px-24 pt-20 pb-10 border-t border-border bg-card/40 overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        {/* Top: editorial CTA */}
        <div className="grid md:grid-cols-12 gap-10 pb-16 border-b border-border">
          <div className="md:col-span-7 space-y-6">
            <p className="eyebrow">{t(copy, "footer.cta_eyebrow", "Have a project in mind?")}</p>
            <h3 className="font-display text-5xl md:text-7xl leading-[0.95]">
              {renderRichLines(t(copy, "footer.cta_title", "Let's make\nsomething *good.*"))}
            </h3>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-foreground text-background h-12 px-6 rounded-full font-medium text-sm hover:bg-signal hover:text-signal-foreground transition-colors mt-4"
            >
              {t(copy, "footer.cta_button", "Start a project")} <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-8 md:justify-self-end">
            <div className="space-y-3">
              <p className="eyebrow">{t(copy, "footer.sitemap_label", "Sitemap")}</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-signal transition-colors">Home</Link></li>
                <li><Link href="/projects" className="hover:text-signal transition-colors">Projects</Link></li>
                <li><Link href="/blog" className="hover:text-signal transition-colors">Journal</Link></li>
                <li><Link href="/#about" className="hover:text-signal transition-colors">About</Link></li>
                <li><Link href="/#contact" className="hover:text-signal transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="eyebrow">{t(copy, "footer.elsewhere_label", "Elsewhere")}</p>
              <ul className="space-y-2 text-sm">
                {socials.github && (
                  <li>
                    <a href={socials.github} target="_blank" rel="noreferrer" className="hover:text-signal transition-colors inline-flex items-center gap-1.5">
                      GitHub <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </li>
                )}
                {socials.linkedin && (
                  <li>
                    <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-signal transition-colors inline-flex items-center gap-1.5">
                      LinkedIn <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </li>
                )}
                {socials.twitter && (
                  <li>
                    <a href={socials.twitter} target="_blank" rel="noreferrer" className="hover:text-signal transition-colors inline-flex items-center gap-1.5">
                      Twitter <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </li>
                )}
                {socials.email && (
                  <li>
                    <a href={`mailto:${socials.email}`} className="hover:text-signal transition-colors inline-flex items-center gap-1.5">
                      Email <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Massive editorial name display */}
        <div className="py-12 select-none pointer-events-none">
          <p className="font-display italic leading-none text-foreground/90 text-[clamp(4rem,18vw,16rem)] tracking-tighter text-center md:text-left">
            {firstName}&nbsp;{lastName}<span className="text-signal not-italic">.</span>
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border text-xs text-muted-foreground">
          <p>
            © {year} {fullName}. {settings?.footer_text ? "" : "All rights reserved."}
            {settings?.footer_text && <span className="ml-2">{settings.footer_text}</span>}
          </p>
          <div className="flex items-center gap-2">
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-foreground hover:text-foreground transition-colors">
                <FaGithub className="w-3.5 h-3.5" />
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-foreground hover:text-foreground transition-colors">
                <FaLinkedin className="w-3.5 h-3.5" />
              </a>
            )}
            {socials.twitter && (
              <a href={socials.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-foreground hover:text-foreground transition-colors">
                <FaTwitter className="w-3.5 h-3.5" />
              </a>
            )}
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-foreground hover:text-foreground transition-colors">
                <FaInstagram className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
