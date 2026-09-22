"use client"

import { useState } from "react"
import { PortfolioService } from "@/services/portfolio"
import { Profile } from "@/types/portfolio"
import { toast } from "sonner"
import { Loader2, ArrowUpRight, Send, Mail } from "lucide-react"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"
import { SiteCopy, t } from "@/lib/copy"

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
      toast.success(t(copy, "contact.form.success", "Dispatch sent successfully."))
      form.reset()
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Something went wrong."
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="px-6 md:px-12 lg:px-16 xl:px-24 scroll-mt-24">
      <div className="max-w-[1600px] mx-auto">
        {/* Section header — Sentence case */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-border">
          <div className="space-y-2">
            <div className="font-mono text-xs text-[#2D5F6B] dark:text-[#3E7987]">
              {t(copy, "contact.eyebrow", "07. Communications & inquiry")}
            </div>
            <h2 className="text-heading-section font-semibold tracking-tight text-foreground">
              {t(copy, "contact.title", "Initiate project or discuss open roles")}
            </h2>
          </div>
          <p className="font-mono text-xs text-muted-foreground max-w-sm">
            {t(copy, "contact.subtitle", "Have a technical engagement or full-time opportunity? Direct transmissions are reviewed promptly.")}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left / Direct dispatch rail */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Direct Email block */}
            <a
              href={`mailto:${email}`}
              className="group block border border-[#2D5F6B]/35 bg-card p-6 md:p-8 rounded-xs corner-ticks hover:border-[#2D5F6B] transition-colors"
            >
              <div className="flex items-center justify-between font-mono text-xs text-muted-foreground border-b border-border pb-3 mb-4">
                <span className="flex items-center gap-1.5 text-foreground font-medium">
                  <Mail className="w-3.5 h-3.5 text-[#2D5F6B] dark:text-[#3E7987]" />
                  <span>{t(copy, "contact.email_label", "Direct protocol")}</span>
                </span>
                <span>inbox</span>
              </div>
              <p className="font-mono text-xl sm:text-2xl text-foreground font-medium break-words leading-tight">
                {email}
              </p>
              <p className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-[#2D5F6B] dark:text-[#3E7987] font-medium group-hover:underline">
                <span>[ {t(copy, "contact.email_cta", "Transmit email directly")} ]</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </p>
            </a>

            {/* Social channels spec */}
            <div className="border border-border bg-card p-6 md:p-8 rounded-xs corner-ticks space-y-5">
              <div className="flex items-center justify-between font-mono text-xs text-muted-foreground border-b border-border pb-3">
                <span>{t(copy, "contact.socials_label", "External verification & channels")}</span>
                <span>net.spec</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {profile?.social_links?.github && (
                  <a
                    href={profile.social_links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-border bg-secondary px-3.5 py-2 rounded-xs font-mono text-xs text-foreground hover:border-[#2D5F6B] transition-colors"
                  >
                    <FaGithub className="w-3.5 h-3.5" /> GitHub
                  </a>
                )}
                {profile?.social_links?.linkedin && (
                  <a
                    href={profile.social_links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-border bg-secondary px-3.5 py-2 rounded-xs font-mono text-xs text-foreground hover:border-[#2D5F6B] transition-colors"
                  >
                    <FaLinkedin className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                )}
                {profile?.social_links?.twitter && (
                  <a
                    href={profile.social_links.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-border bg-secondary px-3.5 py-2 rounded-xs font-mono text-xs text-foreground hover:border-[#2D5F6B] transition-colors"
                  >
                    <FaTwitter className="w-3.5 h-3.5" /> Twitter
                  </a>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border font-mono text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">{t(copy, "contact.based_label", "Based")}</span>
                  <span className="font-medium text-foreground">{t(copy, "contact.based_value", "Addis Ababa")}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">{t(copy, "contact.working_label", "Availability")}</span>
                  <span className="font-medium text-foreground">{t(copy, "contact.working_value", "Global · Remote")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right / Dispatch form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 border border-border bg-card p-6 md:p-8 rounded-xs corner-ticks space-y-5"
          >
            <div className="flex items-center justify-between font-mono text-xs text-muted-foreground border-b border-border pb-3">
              <span className="flex items-center gap-1.5 text-foreground font-medium">
                <Send className="w-3.5 h-3.5 text-[#2D5F6B] dark:text-[#3E7987]" />
                <span>Transmit form</span>
              </span>
              <span>form.post</span>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-muted-foreground block">
                  {t(copy, "contact.form.name_label", "01. Name / Company")}
                </label>
                <input
                  name="name"
                  required
                  placeholder={t(copy, "contact.form.name_ph", "Jane Doe")}
                  className="w-full h-11 px-3.5 rounded-xs border border-border bg-background focus:border-[#2D5F6B] focus:outline-none transition-colors font-mono text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-muted-foreground block">
                  {t(copy, "contact.form.email_label", "02. Return email")}
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder={t(copy, "contact.form.email_ph", "jane@company.com")}
                  className="w-full h-11 px-3.5 rounded-xs border border-border bg-background focus:border-[#2D5F6B] focus:outline-none transition-colors font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs text-muted-foreground block">
                {t(copy, "contact.form.subject_label", "03. Topic / Project scope")}
              </label>
              <input
                name="subject"
                required
                placeholder={t(copy, "contact.form.subject_ph", "Frontend role, Next.js architecture, product contract…")}
                className="w-full h-11 px-3.5 rounded-xs border border-border bg-background focus:border-[#2D5F6B] focus:outline-none transition-colors font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs text-muted-foreground block">
                {t(copy, "contact.form.message_label", "04. Specifications & requirements")}
              </label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder={t(copy, "contact.form.message_ph", "Describe your requirements, stack, timeline, and goals.")}
                className="w-full p-3.5 rounded-xs border border-border bg-background focus:border-[#2D5F6B] focus:outline-none transition-colors resize-none font-sans text-xs sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[#2D5F6B] text-white dark:bg-[#3E7987] dark:text-background rounded-xs font-mono text-xs font-medium hover:bg-[#234b54] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{t(copy, "contact.form.submitting", "Transmitting…")}</span>
                </>
              ) : (
                <>
                  <span>[ {t(copy, "contact.form.submit", "Send dispatch message")} ]</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
