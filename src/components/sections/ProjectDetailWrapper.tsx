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
  initialProject?: Project | null
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

export const ProjectDetailWrapper = ({ id, initialProject = null }: Props) => {
  const [fetched, setFetched] = useState<{ id: string; data: Project | null } | null>(null)
  const [copy, setCopy] = useState<SiteCopy>({})
  const [currentImage, setCurrentImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [direction, setDirection] = useState(0)

  const project = initialProject ?? (fetched?.id === id ? fetched.data : null)
  const isLoading = !initialProject && fetched?.id !== id

  useEffect(() => {
    let cancelled = false
    if (!initialProject) {
      PortfolioService.getProjectById(id).then((data) => {
        if (!cancelled) setFetched({ id, data })
      })
    }
    PortfolioService.getSiteCopy()
      .then((c) => { if (!cancelled) setCopy(c) })
      .catch(() => { if (!cancelled) setCopy({}) })
    return () => {
      cancelled = true
    }
  }, [id, initialProject])

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
      <div className="px-6 md:px-12 lg:px-16 xl:px-24 py-32 max-w-[1600px] mx-auto animate-pulse">
        <div className="h-4 w-32 bg-secondary rounded-xs mb-8" />
        <div className="h-12 w-2/3 bg-secondary rounded-xs mb-6" />
        <div className="h-4 w-1/2 bg-secondary rounded-xs mb-12" />
        <div className="aspect-video bg-secondary rounded-xs border border-border" />
      </div>
    )

  if (!project)
    return (
      <div className="text-center py-32">
        <p className="text-heading-section text-foreground">Project not found.</p>
        <Link href="/projects" className="inline-flex items-center gap-2 mt-6 font-mono text-xs text-muted-foreground hover:text-accent transition-colors">
          <span>[ Back to all projects ]</span>
        </Link>
      </div>
    )

  const features = ensureArray(project.key_features)
  const learned = ensureArray(project.what_i_learned)
  const tagsList = ensureArray(project.tags)

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? 60 : -60, opacity: 0 }),
  }

  return (
    <div className="pb-24 md:pb-32">
      {/* Zoom modal */}
      {isZoomed && project.images?.[currentImage] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} — image preview`}
          className="fixed inset-0 z-100 bg-foreground/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsZoomed(false)
          }}
        >
          <button
            type="button"
            aria-label="Close preview"
            onClick={() => setIsZoomed(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-xs bg-background/10 hover:bg-background/20 border border-background/20 flex items-center justify-center text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
          >
            <X className="w-5 h-5" aria-hidden />
          </button>
          <div className="relative w-full h-full max-w-7xl">
            <Image
              src={project.images[currentImage]}
              alt={`${project.title} — frame ${currentImage + 1} (enlarged)`}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="px-6 md:px-12 lg:px-16 xl:px-24 pt-24 md:pt-28 pb-6">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between border-b border-border pb-4">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>[ {t(copy, "project.back_link", "Return to catalog")} ]</span>
          </Link>
          <p className="eyebrow-chip">
            {t(copy, "project.kicker", "system.spec // case study")}
          </p>
        </div>
      </div>

      {/* Title block */}
      <header className="px-6 md:px-12 lg:px-16 xl:px-24 pb-12 md:pb-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-xs bg-secondary border border-accent/30 text-foreground">
                  {project.project_type || "Production System"}
                </span>
                {project.featured && (
                  <span className="px-2.5 py-1 rounded-xs border border-accent/30 text-accent font-medium">
                    Featured Spec
                  </span>
                )}
              </div>
              <h1 className="text-heading-hero font-semibold tracking-tight text-foreground">
                {project.title}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl font-sans">
                {project.description}
              </p>
            </div>

            <div className="flex flex-wrap md:flex-col gap-3 shrink-0 font-mono text-xs">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground h-11 px-5 rounded-xs font-medium hover:bg-accent-hover transition-colors"
                >
                  <span>[ {t(copy, "project.live_cta", "Launch live system")} ]</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-border bg-card h-11 px-5 rounded-xs text-foreground hover:border-accent transition-colors"
                >
                  <FaGithub className="w-3.5 h-3.5" />
                  <span>[ {t(copy, "project.source_cta", "View repository")} ]</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero image gallery */}
      {project.images?.length > 0 && (
        <section className="px-6 md:px-12 lg:px-16 xl:px-24 mb-16 md:mb-20">
          <div className="max-w-[1600px] mx-auto">
            <div className="relative">
              <div
                onClick={() => setIsZoomed(true)}
                className="group relative aspect-video rounded-xs overflow-hidden border border-border bg-secondary cursor-zoom-in corner-ticks"
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

                <div className="absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
                  <span className="bg-background/90 text-foreground font-mono text-xs px-3 py-1.5 rounded-xs border border-border">
                    [ Click to inspect frame ]
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-xs text-foreground text-xs font-mono px-2.5 py-1 rounded-xs border border-border">
                  frame {currentImage + 1} / {project.images.length}
                </div>
              </div>

              {project.images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    aria-label="Previous frame"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xs bg-background/90 backdrop-blur-xs border border-border flex items-center justify-center hover:border-foreground transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-foreground" />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next frame"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xs bg-background/90 backdrop-blur-xs border border-border flex items-center justify-center hover:border-foreground transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 text-foreground" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {project.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pt-4 pb-2 no-scrollbar">
                {project.images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => {
                      setDirection(i > currentImage ? 1 : -1)
                      setCurrentImage(i)
                    }}
                    className={`relative shrink-0 w-24 aspect-video rounded-xs overflow-hidden border transition-all cursor-pointer ${
                      i === currentImage
                        ? "border-accent ring-1 ring-accent"
                        : "border-border opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Thumb ${i + 1}`} fill className="object-cover" sizes="96px" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Body grid */}
      <div className="px-6 md:px-12 lg:px-16 xl:px-24">
        <div className="max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-10 md:gap-14">
          {/* Main column */}
          <div className="lg:col-span-8 space-y-12 md:space-y-16">
            {/* Purpose */}
            {project.purpose && (
              <section className="space-y-4 border-b border-accent/30 pb-10">
                <div className="eyebrow-chip">
                  {t(copy, "project.brief_eyebrow", "01. Technical brief & problem")}
                </div>
                <h2 className="text-heading-section font-semibold tracking-tight text-foreground">
                  {renderRichTitle(t(copy, "project.brief_title", "Why this was engineered"), "text-accent")}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty max-w-2xl font-sans">
                  {project.purpose}
                </p>
              </section>
            )}

            {/* Features */}
            {features.length > 0 && (
              <section className="space-y-5 border-b border-accent/30 pb-10">
                <div className="eyebrow-chip">
                  {t(copy, "project.features_eyebrow", "02. Implementation specifications")}
                </div>
                <h2 className="text-heading-section font-semibold tracking-tight text-foreground">
                  {renderRichTitle(t(copy, "project.features_title", "Core architecture & functional capabilities"), "text-accent")}
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3 pt-2">
                  {features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 bg-card border border-accent/30 rounded-xs px-4 py-3.5 corner-ticks"
                    >
                      <span className="font-mono text-xs text-accent font-medium pt-0.5 shrink-0">
                        [{String(i + 1).padStart(2, "0")}]
                      </span>
                      <span className="text-xs sm:text-sm font-sans leading-relaxed text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Learned */}
            {learned.length > 0 && (
              <section className="space-y-5">
                <div className="eyebrow-chip">
                  {t(copy, "project.learned_eyebrow", "03. Engineering takeaways")}
                </div>
                <h2 className="text-heading-section font-semibold tracking-tight text-foreground">
                  {renderRichTitle(t(copy, "project.learned_title", "Hardest technical challenges & insights"), "text-accent")}
                </h2>
                <div className="space-y-4 pt-1">
                  {learned.map((item, i) => (
                    <div
                      key={i}
                      className="text-xs sm:text-sm leading-relaxed text-foreground/90 font-sans max-w-2xl border-l-2 border-accent pl-4"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="border border-accent/30 bg-card rounded-xs p-6 corner-ticks space-y-6 font-mono text-xs">
                <div className="border-b border-border pb-3 flex justify-between items-center text-muted-foreground">
                  <span className="text-foreground font-semibold">Metadata manifest</span>
                  <span>spec.tbl</span>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground block text-[11px]">{t(copy, "project.role_label", "Engineering role")}</span>
                  <p className="text-sm font-medium text-foreground">{project.my_role || "Frontend & Full-stack Engineer"}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground block text-[11px]">{t(copy, "project.type_label", "System type")}</span>
                  <p className="text-sm font-medium text-foreground">{project.project_type || "Production Web Application"}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-muted-foreground block text-[11px]">{t(copy, "project.stack_label", "Stack manifest")}</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tagsList.length > 0 ? (
                      tagsList.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 border border-accent/30 bg-secondary rounded-xs text-[11px] text-foreground"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile actions */}
              <div className="md:hidden flex flex-col gap-3 font-mono text-xs">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground h-11 rounded-xs font-medium"
                  >
                    <span>[ {t(copy, "project.live_cta", "Visit live site")} ]</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-border bg-card h-11 rounded-xs font-medium"
                  >
                    <FaGithub className="w-3.5 h-3.5" />
                    <span>[ {t(copy, "project.source_cta", "Source code")} ]</span>
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 md:px-12 lg:px-16 xl:px-24 pt-16 mt-16 border-t border-border">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8">
          <div className="space-y-2">
            <div className="eyebrow-chip">
              {t(copy, "project.up_next_eyebrow", "Catalog traversal")}
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              {renderRichTitle(t(copy, "project.up_next_title", "Browse more case studies"), "text-accent")}
            </h3>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 border border-border bg-card h-11 px-5 rounded-xs font-mono text-xs text-foreground hover:border-accent hover:text-accent transition-colors"
          >
            <span>[ {t(copy, "project.back_link", "All cataloged projects")} ]</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
