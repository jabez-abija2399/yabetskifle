"use client"

import Image from "next/image"
import { Profile } from "@/types/portfolio"
import { ArrowUpRight, Download } from "lucide-react"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"
import { motion, Variants } from "framer-motion"
import { ViewTracker } from "@/components/analytics/ViewTracker"
import { SiteCopy, t } from "@/lib/copy"

interface Props {
  profile: Profile
  copy?: SiteCopy
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export const Hero = ({ profile, copy }: Props) => {
  const firstName = (profile.full_name || "Yabets").split(" ")[0]
  const lastName = (profile.full_name || "Yabets Kifle").split(" ").slice(1).join(" ") || "Kifle"
  const year = new Date().getFullYear()
  const statusText = t(copy, "hero.status_text", `Open to work — Full-time · Contract · Freelance · ${year}`)

  return (
    <section className="relative min-h-[100svh] overflow-hidden flex flex-col">
      <ViewTracker path="/" />

      {/* Background */}
      <div className="absolute inset-0 bg-grid text-foreground/40 pointer-events-none -z-10" />
      <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-signal/20 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] bg-foreground/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Top frame: meta */}
      <div className="px-6 md:px-12 pt-28 md:pt-32">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto w-full"
        >
          <motion.div variants={item} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-signal animate-ping opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-signal" />
              </span>
              <span className="eyebrow">{statusText}</span>
            </div>
            <span className="eyebrow hidden md:inline-block">{t(copy, "hero.label_right", "Portfolio · 2026")}</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Center: massive display name */}
      <div className="flex-1 flex items-center px-6 md:px-12 py-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto w-full grid grid-cols-12 gap-6 md:gap-8 items-end"
        >
          {/* Left: avatar + role meta */}
          <motion.div variants={item} className="col-span-12 md:col-span-4 lg:col-span-3 space-y-6">
            <div className="relative w-28 h-28 md:w-32 md:h-32 group">
              <div className="absolute inset-0 bg-signal/30 blur-2xl rounded-full transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-border bg-card shadow-xl">
                <Image
                  src={profile.avatar_url || "/placeholder.jpg"}
                  alt={profile.full_name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 112px, 128px"
                />
              </div>
            </div>

            <div className="space-y-2 max-w-xs">
              <p className="eyebrow">{t(copy, "hero.role_eyebrow", "Currently")}</p>
              <p className="text-base md:text-lg font-medium leading-snug text-foreground">
                {profile.role_title}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 max-w-xs pt-1">
              {(profile.availability_tags && profile.availability_tags.length > 0
                ? profile.availability_tags
                : ["Full-time", "Contract", "Freelance", "Remote", "Hybrid", "On-site"]
              ).map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-medium px-2.5 py-1 rounded-full border border-border text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: name display */}
          <motion.div variants={item} className="col-span-12 md:col-span-8 lg:col-span-9">
            <h1 className="text-heading-hero font-display leading-[0.85]">
              <span className="block italic text-foreground/90">{firstName}</span>
              <span className="block">
                {lastName}
                <span className="text-signal">.</span>
              </span>
            </h1>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom frame: bio + actions + socials */}
      <div className="px-6 md:px-12 pb-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto w-full grid grid-cols-12 gap-8 items-end border-t border-border pt-8"
        >
          {/* Bio */}
          <motion.div variants={item} className="col-span-12 md:col-span-6 lg:col-span-5">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty max-w-md">
              {profile.bio}
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div variants={item} className="col-span-12 md:col-span-3 lg:col-span-4 flex flex-wrap gap-3">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 bg-foreground text-background px-6 h-12 rounded-full font-medium text-sm hover:bg-signal hover:text-signal-foreground transition-colors"
            >
              {t(copy, "hero.cta_primary", "View Work")}
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-border px-6 h-12 rounded-full font-medium text-sm hover:border-foreground transition-colors"
            >
              {t(copy, "hero.cta_secondary", "Get in Touch")}
            </a>
            {profile.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 h-12 rounded-full font-medium text-sm hover:text-foreground text-muted-foreground transition-colors"
              >
                <Download className="w-4 h-4" /> {t(copy, "hero.cta_resume", "Resume")}
              </a>
            )}
          </motion.div>

          {/* Socials */}
          <motion.div variants={item} className="col-span-12 md:col-span-3 flex md:justify-end items-center gap-2">
            {profile.social_links?.github && (
              <a
                href={profile.social_links.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                <FaGithub className="w-4 h-4" />
              </a>
            )}
            {profile.social_links?.linkedin && (
              <a
                href={profile.social_links.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
            )}
            {profile.social_links?.twitter && (
              <a
                href={profile.social_links.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
