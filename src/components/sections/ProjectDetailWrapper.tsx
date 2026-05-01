"use client"

import { useEffect, useState } from "react"
import { PortfolioService } from "@/services/portfolio"
import { Project } from "@/types/portfolio"
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react"
import { FaGithub } from "react-icons/fa"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"

interface Props {
  id: string
}

const ensureArray = (data: unknown): string[] => {
  if (Array.isArray(data)) return data as string[]
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) return parsed
      return data.split(/\n|,/).map((s) => s.trim()).filter(Boolean)
    } catch {
      return data.split(/\n|,/).map((s) => s.trim()).filter(Boolean)
    }
  }
  return []
}

export const ProjectDetailWrapper = ({ id }: Props) => {
  const [project, setProject] = useState<Project | null>(null)
  const [copy, setCopy] = useState<SiteCopy>({})
  const [isLoading, setIsLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    Promise.all([
      PortfolioService.getProjectById(id),
      PortfolioService.getSiteCopy().catch(() => ({})),
    ]).then(([data, copyData]) => {
      if (data) setProject(data)
      setCopy(copyData)
      setIsLoading(false)
    })
  }, [id])

  const next = () => {
    if (!project?.images) return
    setDirection(1)
    setCurrentImage((p) => (p + 1) % project.images.length)
  }
  const prev = () => {
    if (!project?.images) return
    setDirection(-1)
    setCurrentImage((p) => (p - 1 + project.images.length) % project.images.length)
  }

  if (isLoading)
    return (
      <div className="px-6 md:px-12 py-32 max-w-7xl mx-auto animate-pulse">
        <div className="h-4 w-32 bg-secondary rounded-full mb-8" />
        <div className="h-12 w-2/3 bg-secondary rounded-full mb-6" />
        <div className="h-4 w-1/2 bg-secondary rounded-full mb-12" />
        <div className="aspect-video bg-secondary rounded-3xl" />
      </div>
    )

  if (!project)
    return (
      <div className="text-center py-32">
        <p className="font-display text-3xl">Project not found.</p>
        <Link href="/projects" className="inline-flex items-center gap-2 mt-6 text-sm font-medium hover:text-signal transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to all projects
        </Link>
      </div>
    )

  const features = ensureArray(project.key_features)
  const learned = ensureArray(project.what_i_learned)

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? 60 : -60, opacity: 0 }),
  }

  return (
    <div className="pb-24 md:pb-32">
      {/* Zoom modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-100 bg-foreground/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <button
            aria-label="Close"
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-background/10 hover:bg-background/20 backdrop-blur border border-background/20 flex items-center justify-center text-background"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative w-full h-full max-w-7xl">
            <Image
              src={project.images[currentImage]}
              alt={project.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="px-6 md:px-12 pt-28 md:pt-32 pb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            {t(copy, "project.back_link", "All projects")}
          </Link>
          <p className="eyebrow hidden md:block">{t(copy, "project.kicker", "Case study")}</p>
        </div>
      </div>

      {/* Title block */}
      <header className="px-6 md:px-12 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-8 border-b border-border pb-10">
            <div className="space-y-5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground">
                  {project.project_type || "Project"}
                </span>
                {project.featured && (
                  <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-signal text-signal-foreground">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="font-display text-heading-hero leading-[0.9]">
                {project.title}
                <span className="text-signal">.</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl">
                {project.description}
              </p>
            </div>

            <div className="hidden md:flex flex-col gap-3 shrink-0">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-foreground text-background h-12 px-5 rounded-full text-sm font-medium hover:bg-signal hover:text-signal-foreground transition-colors"
                >
                  {t(copy, "project.live_cta", "Visit live site")} <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-border h-12 px-5 rounded-full text-sm font-medium hover:border-foreground transition-colors"
                >
                  <FaGithub className="w-4 h-4" /> {t(copy, "project.source_cta", "Source")}
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero image gallery */}
      {project.images?.length > 0 && (
        <section className="px-6 md:px-12 mb-16 md:mb-24">
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              <div
                onClick={() => setIsZoomed(true)}
                className="group relative aspect-video rounded-3xl overflow-hidden border border-border bg-secondary cursor-zoom-in"
              >
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentImage}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 280, damping: 32 },
                      opacity: { duration: 0.2 },
                    }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={project.images[currentImage]}
                      alt={`${project.title} — frame ${currentImage + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1280px) 100vw, 1280px"
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
                  <span className="bg-background text-foreground text-xs font-medium px-4 py-2 rounded-full">
                    Click to view full
                  </span>
                </div>

                <div className="absolute bottom-5 right-5 bg-foreground/80 text-background text-xs font-mono px-3 py-1.5 rounded-full backdrop-blur">
                  {currentImage + 1} / {project.images.length}
                </div>
              </div>

              {project.images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    aria-label="Previous"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/90 backdrop-blur border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors shadow-md"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/90 backdrop-blur border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-colors shadow-md"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {project.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pt-5 pb-2 no-scrollbar">
                {project.images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => {
                      setDirection(i > currentImage ? 1 : -1)
                      setCurrentImage(i)
                    }}
                    className={`relative shrink-0 w-28 aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                      i === currentImage
                        ? "border-foreground"
                        : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Thumb ${i + 1}`} fill className="object-cover" sizes="112px" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Body grid */}
      <div className="px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 md:gap-16">
          {/* Main column */}
          <div className="lg:col-span-8 space-y-16 md:space-y-20">
            {/* Purpose */}
            {project.purpose && (
              <section className="space-y-5">
                <p className="eyebrow">{t(copy, "project.brief_eyebrow", "— The brief")}</p>
                <h2 className="font-display text-3xl md:text-4xl leading-tight">
                  {renderRichTitle(t(copy, "project.brief_title", "Why this *existed*."))}
                </h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl">
                  {project.purpose}
                </p>
              </section>
            )}

            {/* Features */}
            {features.length > 0 && (
              <section className="space-y-6">
                <p className="eyebrow">{t(copy, "project.features_eyebrow", "— What it does")}</p>
                <h2 className="font-display text-3xl md:text-4xl leading-tight">
                  {renderRichTitle(t(copy, "project.features_title", "Key *features*."))}
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3 pt-2">
                  {features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 bg-card border border-border rounded-2xl px-5 py-4"
                    >
                      <span className="font-mono text-xs text-muted-foreground pt-0.5 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Learned */}
            {learned.length > 0 && (
              <section className="space-y-6">
                <p className="eyebrow">{t(copy, "project.learned_eyebrow", "— Reflection")}</p>
                <h2 className="font-display text-3xl md:text-4xl leading-tight">
                  {renderRichTitle(t(copy, "project.learned_title", "What I *took away*."))}
                </h2>
                <div className="space-y-4 pt-2">
                  {learned.map((item, i) => (
                    <p
                      key={i}
                      className="text-base md:text-lg leading-relaxed text-foreground/90 text-pretty max-w-2xl border-l-2 border-signal pl-5"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-6">
              <div className="bg-card border border-border rounded-3xl p-7 space-y-7">
                <div>
                  <p className="eyebrow">{t(copy, "project.role_label", "My role")}</p>
                  <p className="text-base font-medium mt-1">{project.my_role || "Designer & Developer"}</p>
                </div>

                <div>
                  <p className="eyebrow">{t(copy, "project.type_label", "Project type")}</p>
                  <p className="text-base font-medium mt-1">{project.project_type || "Production project"}</p>
                </div>

                <div>
                  <p className="eyebrow">{t(copy, "project.stack_label", "Tech stack")}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile actions (sidebar already has links on desktop) */}
              <div className="md:hidden flex flex-col gap-3">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-foreground text-background h-12 rounded-full text-sm font-medium"
                  >
                    {t(copy, "project.live_cta", "Visit live site")} <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-border h-12 rounded-full text-sm font-medium"
                  >
                    <FaGithub className="w-4 h-4" /> {t(copy, "project.source_cta", "Source")}
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 md:px-12 pt-24 mt-16 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pt-12">
          <div className="space-y-3">
            <p className="eyebrow">{t(copy, "project.up_next_eyebrow", "— Up next")}</p>
            <h3 className="font-display text-3xl md:text-5xl leading-tight">
              {renderRichTitle(t(copy, "project.up_next_title", "Browse more *work*"))}
            </h3>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 bg-foreground text-background h-12 px-6 rounded-full text-sm font-medium hover:bg-signal hover:text-signal-foreground transition-colors"
          >
            {t(copy, "project.back_link", "All projects")} <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
