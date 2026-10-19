"use client"

import Image from "next/image"
import { Profile } from "@/types/portfolio"
import { ArrowDown, ArrowUpRight, Download, MapPin } from "lucide-react"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"
import { motion, Variants } from "framer-motion"
import { SiteCopy, t } from "@/lib/copy"

interface Props {
  profile: Profile
  copy?: SiteCopy
  resumeUrl?: string
  stats?: { value: string; label: string }[]
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const Hero = ({ profile, copy, resumeUrl, stats = [] }: Props) => {
  const fullName = profile.full_name || "Yabets Kifle"
  const year = new Date().getFullYear()
  const statusText = t(copy, "hero.status_text", `Open to roles · Full-time · Contract · Remote`)
  const githubUrl = profile.social_links?.github || "https://github.com/jabez-abija2399"
  const resumeHref = resumeUrl || profile.resume_url
  const stackTags = profile.availability_tags?.length
    ? profile.availability_tags
    : ["Next.js", "TypeScript", "React", "Tailwind", "Supabase"]

  return (
    <section id="hero" className="relative overflow-hidden pt-32 pb-0 md:pt-40">
      {/* Ambient backdrop — volt + violet glow over a faint dot grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-aurora" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-70" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 md:px-10 lg:grid-cols-12 lg:gap-12">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-7 lg:col-span-7">
          <motion.div variants={item}>
            <span className="eyebrow-chip">{statusText}</span>
          </motion.div>

          <motion.h1 variants={item} className="text-heading-hero text-gradient font-semibold">
            {fullName}
          </motion.h1>

          <motion.p variants={item} className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl text-pretty">
            {profile.bio || "Engineering high-performance web applications, scalable design systems, and thoughtful end-to-end interfaces with React, Next.js, and TypeScript."}
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#work"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground transition-all hover:-translate-y-px hover:bg-accent-hover hover:shadow-[0_12px_32px_-10px_var(--glow)]"
            >
              View selected work
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href="#contact"
              className="inline-flex h-12 items-center rounded-full border border-border bg-card/60 px-6 text-sm text-foreground backdrop-blur-sm transition-colors hover:border-foreground/40"
            >
              Start a conversation
            </a>

            {resumeHref && (
              <a
                href={resumeHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Download className="h-4 w-4" />
                Résumé
              </a>
            )}
          </motion.div>

          <motion.div variants={item} className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-sm text-muted-foreground">
            {profile.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </span>
            )}
            <span className="inline-flex items-center gap-3">
              <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" className="transition-colors hover:text-foreground">
                <FaGithub className="h-4 w-4" />
              </a>
              {profile.social_links?.linkedin && (
                <a href={profile.social_links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-foreground">
                  <FaLinkedin className="h-4 w-4" />
                </a>
              )}
              {profile.social_links?.twitter && (
                <a href={profile.social_links.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="transition-colors hover:text-foreground">
                  <FaTwitter className="h-4 w-4" />
                </a>
              )}
            </span>
          </motion.div>
        </motion.div>

        {/* Portrait card with floating role chip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:col-span-5"
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-[0_40px_80px_-40px_var(--glow)]">
            <Image
              src={profile.avatar_url || "/placeholder.svg"}
              alt={fullName}
              fill
              priority
              className="object-cover transition-transform duration-700 hover:scale-[1.02]"
              sizes="(max-width: 1024px) 90vw, 440px"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent p-6 pt-24">
              <p className="text-lg font-semibold text-foreground">{profile.role_title || "Frontend Developer"}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile.experience_years ? `${profile.experience_years}+ years shipping` : "Shipping production software"}
              </p>
            </div>
          </div>

          <div className="absolute -bottom-5 -left-4 hidden items-center gap-3 rounded-2xl border border-border bg-card/90 px-4 py-3 shadow-xl backdrop-blur-md sm:flex">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            <span className="text-sm font-medium text-foreground">Available · {year}</span>
          </div>
        </motion.div>
      </div>

      {/* Stats — every number is pulled from the database */}
      {stats.length > 0 && (
        <div className="relative mx-auto mt-20 max-w-6xl px-6 md:px-10">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-card/80 px-6 py-6 backdrop-blur-sm">
                <dt className="text-sm text-muted-foreground">{s.label}</dt>
                <dd className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Marquee of the stack */}
      <div className="relative mt-16 overflow-hidden border-y border-border py-4">
        <div className="flex w-max animate-marquee items-center gap-12 text-sm text-muted-foreground">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center gap-12" aria-hidden={dup === 1}>
              {stackTags.map((tag) => (
                <span key={`${dup}-${tag}`} className="flex items-center gap-12 whitespace-nowrap font-mono">
                  <span>{tag}</span>
                  <span className="text-accent">●</span>
                </span>
              ))}
              <span className="flex items-center gap-2 font-mono text-foreground">
                Scroll for case studies <ArrowDown className="h-3.5 w-3.5" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
