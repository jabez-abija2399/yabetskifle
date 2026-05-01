"use client"

import { useState } from "react"
import { PortfolioService } from "@/services/portfolio"
import { Profile } from "@/types/portfolio"
import { toast } from "sonner"
import { Loader2, ArrowUpRight } from "lucide-react"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"

interface Props {
  profile?: Profile | null
  copy?: SiteCopy
}

export const ContactSection = ({ profile, copy }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const email =
    profile?.social_links?.email ||
    "yabetskifle@gmail.com"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    try {
      await PortfolioService.submitMessage({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
      })
      toast.success(t(copy, "contact.form.success", "Thanks — your message landed safely."))
      form.reset()
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Something went wrong."
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="px-6 md:px-12 lg:px-16 xl:px-24 scroll-mt-32">
      <div className="max-w-[1600px] mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between gap-8 mb-12 md:mb-16 border-b border-border pb-8">
          <div className="space-y-3">
            <p className="eyebrow">{t(copy, "contact.eyebrow", "— 10 / Contact")}</p>
            <h2 className="text-heading-section">
              {renderRichTitle(t(copy, "contact.title", "Let's build *something*"))}
            </h2>
          </div>
          <p className="hidden md:block text-sm text-muted-foreground max-w-xs text-pretty">
            {t(copy, "contact.subtitle", "Have a project in mind, or just want to say hello? I read every message.")}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
          {/* Left rail */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <a
              href={`mailto:${email}`}
              className="group block bg-foreground text-background rounded-3xl p-8 md:p-10 hover:bg-signal hover:text-signal-foreground transition-colors"
            >
              <p className="eyebrow opacity-70 mb-4">{t(copy, "contact.email_label", "Email me directly")}</p>
              <p className="font-display text-3xl md:text-4xl break-words leading-tight">
                {email}
              </p>
              <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
                {t(copy, "contact.email_cta", "Send a note")}
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </p>
            </a>

            <div className="bg-card border border-border rounded-3xl p-8 md:p-10 space-y-6">
              <p className="eyebrow">{t(copy, "contact.socials_label", "Find me on")}</p>
              <div className="flex flex-wrap gap-3">
                {profile?.social_links?.github && (
                  <a
                    href={profile.social_links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-border h-11 px-5 rounded-full text-sm font-medium hover:border-foreground transition-colors"
                  >
                    <FaGithub className="w-4 h-4" /> GitHub
                  </a>
                )}
                {profile?.social_links?.linkedin && (
                  <a
                    href={profile.social_links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-border h-11 px-5 rounded-full text-sm font-medium hover:border-foreground transition-colors"
                  >
                    <FaLinkedin className="w-4 h-4" /> LinkedIn
                  </a>
                )}
                {profile?.social_links?.twitter && (
                  <a
                    href={profile.social_links.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-border h-11 px-5 rounded-full text-sm font-medium hover:border-foreground transition-colors"
                  >
                    <FaTwitter className="w-4 h-4" /> Twitter
                  </a>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="eyebrow">{t(copy, "contact.based_label", "Based")}</p>
                  <p className="text-sm font-medium mt-1">{t(copy, "contact.based_value", "Addis Ababa")}</p>
                </div>
                <div>
                  <p className="eyebrow">{t(copy, "contact.working_label", "Working")}</p>
                  <p className="text-sm font-medium mt-1">{t(copy, "contact.working_value", "Globally · Remote")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 bg-card border border-border rounded-3xl p-8 md:p-10 space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="eyebrow">{t(copy, "contact.form.name_label", "Your name")}</label>
                <input
                  name="name"
                  required
                  placeholder={t(copy, "contact.form.name_ph", "Jane Doe")}
                  className="w-full h-12 px-4 rounded-2xl border border-border bg-background focus:border-foreground outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="eyebrow">{t(copy, "contact.form.email_label", "Email")}</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder={t(copy, "contact.form.email_ph", "jane@studio.com")}
                  className="w-full h-12 px-4 rounded-2xl border border-border bg-background focus:border-foreground outline-none transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="eyebrow">{t(copy, "contact.form.subject_label", "Subject")}</label>
              <input
                name="subject"
                required
                placeholder={t(copy, "contact.form.subject_ph", "A new product, a hire, an idea…")}
                className="w-full h-12 px-4 rounded-2xl border border-border bg-background focus:border-foreground outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="eyebrow">{t(copy, "contact.form.message_label", "Message")}</label>
              <textarea
                name="message"
                required
                rows={6}
                placeholder={t(copy, "contact.form.message_ph", "Tell me about the project, timeline, and what success looks like.")}
                className="w-full p-4 rounded-2xl border border-border bg-background focus:border-foreground outline-none transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-13 py-3.5 rounded-full bg-foreground text-background font-medium text-sm hover:bg-signal hover:text-signal-foreground transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> {t(copy, "contact.form.submitting", "Sending…")}
                </>
              ) : (
                <>
                  {t(copy, "contact.form.submit", "Send message")} <ArrowUpRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
