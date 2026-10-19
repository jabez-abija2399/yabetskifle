"use client"

import { useState } from "react"
import { PortfolioService } from "@/services/portfolio"
import { Profile } from "@/types/portfolio"
import { toast } from "sonner"
import { Loader2, ArrowUpRight, Mail, MapPin, Clock } from "lucide-react"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"
import { SectionHeader } from "@/components/ui/SectionHeader"

interface Props {
  profile?: Profile | null
  copy?: SiteCopy
  contactEmail?: string
}

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"

const labelClass = "block text-sm font-medium text-foreground"

export const ContactSection = ({ profile, copy, contactEmail }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const email =
    contactEmail ||
    profile?.social_links?.email ||
    "yabetskifle@gmail.com"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    // Honeypot — bots fill hidden fields; humans never see them
    if (formData.get("company_website")) {
      setIsSubmitting(false)
      return
    }
    try {
      await PortfolioService.submitMessage({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
      })
      toast.success(t(copy, "contact.form.success", "Message sent — thank you. I'll reply soon."))
      form.reset()
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Something went wrong."
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const socials = [
    { href: profile?.social_links?.github, label: "GitHub", Icon: FaGithub },
    { href: profile?.social_links?.linkedin, label: "LinkedIn", Icon: FaLinkedin },
    { href: profile?.social_links?.twitter, label: "Twitter", Icon: FaTwitter },
  ].filter((s): s is { href: string; label: string; Icon: typeof FaGithub } => Boolean(s.href))

  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-28 px-6 md:px-10">
      <SectionHeader
        eyebrow={t(copy, "contact.eyebrow", "Contact")}
        title={renderRichTitle(t(copy, "contact.title", "Let's build something *remarkable*"), "text-accent")}
        subtitle={t(copy, "contact.subtitle", "Full-time roles, contracts, or a product that needs a sharp frontend. Tell me about it.")}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left — direct channels */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <a
            href={`mailto:${email}`}
            className="group relative block overflow-hidden rounded-3xl border border-border bg-card p-7 md:p-8 transition-colors hover:border-accent/60"
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-aurora opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative space-y-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <Mail className="h-5 w-5" />
              </span>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{t(copy, "contact.email_label", "Email me directly")}</p>
                <p className="break-all text-xl font-semibold tracking-tight text-foreground md:text-2xl">{email}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                {t(copy, "contact.email_cta", "Open your mail app")}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </a>

          <div className="rounded-3xl border border-border bg-card p-7 md:p-8">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="space-y-1">
                <p className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {t(copy, "contact.based_label", "Based in")}</p>
                <p className="font-medium text-foreground">{t(copy, "contact.based_value", profile?.location || "Addis Ababa")}</p>
              </div>
              <div className="space-y-1">
                <p className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {t(copy, "contact.working_label", "Availability")}</p>
                <p className="font-medium text-foreground">{t(copy, "contact.working_value", "Global · Remote")}</p>
              </div>
            </div>

            {socials.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2.5 border-t border-border pt-6">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — message form */}
        <form
          onSubmit={handleSubmit}
          className="relative space-y-5 rounded-3xl border border-border bg-card p-7 md:p-8 lg:col-span-7"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="contact-name" className={labelClass}>
                {t(copy, "contact.form.name_label", "Name")}
              </label>
              <input
                id="contact-name"
                name="name"
                required
                autoComplete="name"
                placeholder={t(copy, "contact.form.name_ph", "Jane Doe")}
                className={fieldClass}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="contact-email" className={labelClass}>
                {t(copy, "contact.form.email_label", "Email")}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={t(copy, "contact.form.email_ph", "jane@company.com")}
                className={fieldClass}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-subject" className={labelClass}>
              {t(copy, "contact.form.subject_label", "Topic")}
            </label>
            <input
              id="contact-subject"
              name="subject"
              required
              placeholder={t(copy, "contact.form.subject_ph", "Frontend role, Next.js architecture, product contract…")}
              className={fieldClass}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-message" className={labelClass}>
              {t(copy, "contact.form.message_label", "Message")}
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={6}
              placeholder={t(copy, "contact.form.message_ph", "Tell me about the work, the stack, the timeline, and what success looks like.")}
              className={`${fieldClass} resize-none`}
            />
          </div>

          {/* Honeypot — hidden from humans, bots fill it and get dropped */}
          <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="contact-website">Company website</label>
            <input id="contact-website" name="company_website" tabIndex={-1} autoComplete="off" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent text-sm font-medium text-accent-foreground transition-all hover:-translate-y-px hover:bg-accent-hover disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t(copy, "contact.form.submitting", "Sending…")}</span>
              </>
            ) : (
              <>
                <span>{t(copy, "contact.form.submit", "Send message")}</span>
                <ArrowUpRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
