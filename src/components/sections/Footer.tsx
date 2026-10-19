import { SiteSettings, Profile } from "@/types/portfolio"
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"

interface Props {
  settings: SiteSettings | null
  profile?: Profile | null
  copy?: SiteCopy
}

export const Footer = ({ settings, profile, copy }: Props) => {
  const socials = profile?.social_links || {}
  const year = new Date().getFullYear()
  const fullName = profile?.full_name || "Yabets Kifle"

  const endpoints = [
    socials.github && { href: socials.github, label: "GitHub" },
    socials.linkedin && { href: socials.linkedin, label: "LinkedIn" },
    socials.twitter && { href: socials.twitter, label: "Twitter" },
    socials.instagram && { href: socials.instagram, label: "Instagram" },
    socials.email && { href: `mailto:${socials.email}`, label: "Email" },
  ].filter((e): e is { href: string; label: string } => Boolean(e))

  const iconLinks = [
    { href: socials.github, label: "GitHub", Icon: FaGithub },
    { href: socials.linkedin, label: "LinkedIn", Icon: FaLinkedin },
    { href: socials.twitter, label: "Twitter", Icon: FaTwitter },
    { href: socials.instagram, label: "Instagram", Icon: FaInstagram },
    { href: socials.email && `mailto:${socials.email}`, label: "Email", Icon: FaEnvelope },
  ].filter((s): s is { href: string; label: string; Icon: typeof FaGithub } => Boolean(s.href))

  const sitemap = [
    { href: "/", label: t(copy, "footer.nav_home", "Home") },
    { href: "/projects", label: t(copy, "footer.nav_projects", "Work") },
    { href: "/blog", label: t(copy, "footer.nav_journal", "Journal") },
    { href: "/#about", label: t(copy, "footer.nav_about", "About") },
    { href: "/#contact", label: t(copy, "footer.nav_contact", "Contact") },
  ]

  return (
    <footer className="relative mt-32 overflow-hidden border-t border-border pb-10 pt-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-aurora opacity-60" />

      <div className="relative mx-auto max-w-6xl space-y-16 px-6 md:px-10">
        {/* Closing call to action */}
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-border bg-card/70 p-8 backdrop-blur-sm md:flex-row md:items-center md:p-12">
          <div className="max-w-2xl space-y-4">
            <span className="eyebrow-chip">{t(copy, "footer.cta_eyebrow", "Available for work")}</span>
            <h3 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl text-balance">
              {renderRichTitle(t(copy, "footer.cta_title", "Let's engineer something *remarkable* together."), "text-accent")}
            </h3>
          </div>
          <a
            href="#contact"
            className="group inline-flex h-14 shrink-0 items-center gap-2 rounded-full bg-accent px-7 text-sm font-medium text-accent-foreground transition-all hover:-translate-y-px hover:bg-accent-hover hover:shadow-[0_12px_32px_-10px_var(--glow)]"
          >
            {t(copy, "footer.cta_button", "Start a project")}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Sitemap + endpoints */}
        <div className="grid gap-10 md:grid-cols-12">
          <div className="space-y-4 md:col-span-5">
            <p className="text-2xl font-semibold tracking-tight text-foreground">{fullName}</p>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {profile?.role_title || "Frontend engineer building fast, thoughtful web products."}
            </p>
            {iconLinks.length > 0 && (
              <div className="flex items-center gap-2 pt-2">
                {iconLinks.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-7 md:justify-self-end">
            <div className="space-y-4">
              <p className="text-sm font-medium text-foreground">{t(copy, "footer.sitemap_label", "Explore")}</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {sitemap.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition-colors hover:text-foreground">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium text-foreground">{t(copy, "footer.elsewhere_label", "Elsewhere")}</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {endpoints.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                    >
                      {item.label} <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {year} {fullName}. {settings?.footer_text || "Built with care."}
          </p>
          <p className="font-mono text-xs">Next.js · React · TypeScript</p>
        </div>
      </div>
    </footer>
  )
}
