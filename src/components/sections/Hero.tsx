"use client"

import Image from "next/image"
import { Profile } from "@/types/portfolio"
import { Download, Terminal, Code2 } from "lucide-react"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"
import { motion, Variants } from "framer-motion"
import { SiteCopy, t } from "@/lib/copy"

interface Props {
  profile: Profile
  copy?: SiteCopy
  resumeUrl?: string
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export const Hero = ({ profile, copy, resumeUrl }: Props) => {
  const fullName = profile.full_name || "Yabets Kifle"
  const year = new Date().getFullYear()
  const statusText = t(copy, "hero.status_text", `Open to roles — Full-time · Contract · Remote · ${year}`)
  const githubUrl = profile.social_links?.github || "https://github.com/jabez-abija2399"
  const resumeHref = resumeUrl || profile.resume_url

  return (
    <section id="hero" className="relative min-h-[90svh] flex flex-col justify-between border-b border-border bg-schematic-grid pt-24 pb-12">
      {/* Top technical annotation strip */}
      <div className="px-6 md:px-12 lg:px-16 xl:px-24 mb-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-[1600px] mx-auto w-full"
        >
          <motion.div
            variants={item}
            className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-border/80 font-mono text-xs text-muted-foreground"
          >
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-signal" />
              </span>
              <span>{statusText}</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="hidden sm:inline">loc: {profile.location || "Addis Ababa // UTC+3"}</span>
              <span className="hidden md:inline border-l border-border/80 pl-6">spec: production web architecture</span>
              <span className="text-accent font-medium">v{year}.sys</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Main hero grid */}
      <div className="flex-1 flex items-center px-6 md:px-12 lg:px-16 xl:px-24 py-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-[1600px] mx-auto w-full grid grid-cols-12 gap-8 lg:gap-14 items-center"
        >
          {/* Left / Main technical brief */}
          <motion.div
            variants={item}
            className="col-span-12 lg:col-span-8 space-y-6"
          >
            {/* Role indicator */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-border bg-card font-mono text-xs text-muted-foreground rounded-xs">
              <Terminal className="w-3.5 h-3.5 text-accent" />
              <span>{profile.role_title || "Frontend Developer · Full-stack with Next.js"}</span>
            </div>

            {/* Engineer name in intentional architectural type scale */}
            <h1 className="text-heading-hero tracking-tight text-foreground font-semibold">
              {fullName}
            </h1>

            {/* One precise sentence about what I build */}
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl text-pretty font-normal">
              {profile.bio || "Engineering high-performance web applications, scalable design systems, and thoughtful end-to-end user interfaces with React, Next.js, and TypeScript."}
            </p>

            {/* Direct links to GitHub and Live projects IMMEDIATELY visible on first paint */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 h-11 rounded-xs font-mono text-xs font-medium hover:bg-accent-hover transition-colors"
              >
                <span>[ → Live projects ]</span>
              </a>

              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-border bg-card px-4 h-11 rounded-xs font-mono text-xs text-foreground hover:border-accent hover:text-accent transition-colors"
              >
                <FaGithub className="w-3.5 h-3.5" />
                <span>[ GitHub profile ↗ ]</span>
              </a>

              {resumeHref && (
                <a
                  href={resumeHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-border bg-card px-4 h-11 rounded-xs font-mono text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Resume</span>
                </a>
              )}

              <a
                href="#contact"
                className="inline-flex items-center gap-2 border border-dashed border-border px-4 h-11 rounded-xs font-mono text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                <span>Dispatch message</span>
              </a>
            </div>

            {/* Availability badges */}
            <div className="pt-3 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <span className="text-muted-foreground/60">stack:</span>
              {(profile.availability_tags && profile.availability_tags.length > 0
                ? profile.availability_tags
                : ["Next.js", "TypeScript", "React", "Tailwind", "Supabase", "REST/GraphQL"]
              ).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 border border-accent/30 bg-card rounded-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right / Engineer's Field-Notebook Spec Card */}
          <motion.div
            variants={item}
            className="col-span-12 lg:col-span-4"
          >
            <div className="relative border border-accent/30 bg-card p-4 sm:p-5 rounded-xs corner-ticks">
              {/* Header metadata bar */}
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4 font-mono text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 text-foreground font-medium">
                  <Code2 className="w-3.5 h-3.5 text-accent" />
                  <span>system.profile</span>
                </span>
                <span className="text-[10px] text-muted-foreground/80">#ID-{profile.id?.slice(0, 6) || "YK-01"}</span>
              </div>

              {/* Photo in crisp technical framing */}
              <div className="relative aspect-4/3 w-full border border-border bg-secondary overflow-hidden rounded-xs mb-4">
                <Image
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={fullName}
                  fill
                  className="object-cover grayscale contrast-105 hover:grayscale-0 transition-all duration-300"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 360px"
                />
                <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-xs border border-border px-2 py-0.5 text-[10px] font-mono text-foreground">
                  fig 01. portrait
                </div>
              </div>

              {/* Field spec breakdown */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Discipline</span>
                  <span className="text-foreground font-medium">Frontend & Systems</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="text-foreground font-medium">{profile.experience_years || 2}+ years shipping code</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Location</span>
                  <span className="text-foreground">{profile.location || "Addis Ababa"}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-accent font-medium">Active & shipping</span>
                </div>
              </div>

              {/* Social dispatch row */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
                <span className="text-[11px] font-mono text-muted-foreground">Channels:</span>
                <div className="flex items-center gap-2">
                  {profile.social_links?.github && (
                    <a
                      href={profile.social_links.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub"
                      className="w-8 h-8 border border-border rounded-xs flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                    >
                      <FaGithub className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {profile.social_links?.linkedin && (
                    <a
                      href={profile.social_links.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      className="w-8 h-8 border border-border rounded-xs flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                    >
                      <FaLinkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {profile.social_links?.twitter && (
                    <a
                      href={profile.social_links.twitter}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Twitter"
                      className="w-8 h-8 border border-border rounded-xs flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                    >
                      <FaTwitter className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom technical footer rail */}
      <div className="px-6 md:px-12 lg:px-16 xl:px-24 pt-4">
        <div className="max-w-[1600px] mx-auto w-full flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-accent">↓</span>
            <span>Scroll for technical index & case studies</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>[SYS_ARCH // REACT · NEXT · TS]</span>
          </div>
        </div>
      </div>
    </section>
  )
}
