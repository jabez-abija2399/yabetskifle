"use client"
import {
  SiNextdotjs, SiTypescript, SiReact, SiNodedotjs,
  SiPostgresql, SiSupabase, SiPrisma, SiDocker,
  SiTailwindcss, SiFigma, SiVercel,
  SiGithub, SiReactquery, SiPython,
  SiMongodb, SiJavascript,
  SiNetlify, SiMui, SiFramer,
} from "react-icons/si"
import { IconType } from "react-icons"
import { Braces } from "lucide-react"

import { SiteCopy, t, renderRichTitle } from "@/lib/copy"

interface SkillCategory {
  category_name: string
  technologies: string[]
}

interface Props {
  skills: SkillCategory[]
  copy?: SiteCopy
}

const getIcon = (name: string): { icon: IconType; color: string } => {
  const n = name.toLowerCase()
  if (n.includes("next")) return { icon: SiNextdotjs, color: "text-foreground" }
  if (n.includes("typescript")) return { icon: SiTypescript, color: "text-[#3178C6]" }
  if (n.includes("javascript") || n === "js") return { icon: SiJavascript, color: "text-[#F7DF1E]" }
  if (n.includes("react query") || n.includes("query")) return { icon: SiReactquery, color: "text-[#FF4154]" }
  if (n.includes("react")) return { icon: SiReact, color: "text-[#61DAFB]" }
  if (n.includes("node")) return { icon: SiNodedotjs, color: "text-[#339933]" }
  if (n.includes("postgre")) return { icon: SiPostgresql, color: "text-[#4169E1]" }
  if (n.includes("supabase")) return { icon: SiSupabase, color: "text-[#3ECF8E]" }
  if (n.includes("mongo")) return { icon: SiMongodb, color: "text-[#47A248]" }
  if (n.includes("prisma")) return { icon: SiPrisma, color: "text-foreground" }
  if (n.includes("docker")) return { icon: SiDocker, color: "text-[#2496ED]" }
  if (n.includes("tailwind")) return { icon: SiTailwindcss, color: "text-[#06B6D4]" }
  if (n.includes("material") || n.includes("mui")) return { icon: SiMui, color: "text-[#007FFF]" }
  if (n.includes("framer")) return { icon: SiFramer, color: "text-[#0055FF]" }
  if (n.includes("figma")) return { icon: SiFigma, color: "text-[#F24E1E]" }
  if (n.includes("vercel")) return { icon: SiVercel, color: "text-foreground" }
  if (n.includes("netlify")) return { icon: SiNetlify, color: "text-[#00C7B7]" }
  if (n.includes("github")) return { icon: SiGithub, color: "text-foreground" }
  if (n.includes("python")) return { icon: SiPython, color: "text-[#3776AB]" }
  return { icon: Braces, color: "text-muted-foreground" }
}

const TechPill = ({ name }: { name: string }) => {
  const { icon: Icon, color } = getIcon(name)
  return (
    <div className="shrink-0 inline-flex items-center gap-3 h-14 px-6 mx-2 rounded-full border border-border bg-card hover:border-foreground/40 transition-colors">
      <Icon className={`w-5 h-5 ${color}`} />
      <span className="font-medium text-sm whitespace-nowrap">{name}</span>
    </div>
  )
}

export const TechStack = ({ skills, copy }: Props) => {
  if (!skills || skills.length === 0) return null

  // Flatten all tech across categories for marquee
  const all = skills.flatMap((c) => c.technologies)
  // Split roughly into two rows
  const half = Math.ceil(all.length / 2)
  const rowA = all.slice(0, half)
  const rowB = all.slice(half).concat(all.slice(0, Math.max(0, half - all.slice(half).length)))

  // Repeat the rows so animation loops smoothly
  const rowARepeated = [...rowA, ...rowA, ...rowA]
  const rowBRepeated = [...rowB, ...rowB, ...rowB]

  return (
    <section id="skills" className="px-6 md:px-12 scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between gap-8 mb-12 md:mb-16 border-b border-border pb-8">
          <div className="space-y-3">
            <p className="eyebrow">{t(copy, "skills.eyebrow", "— 02 / Tools & Stack")}</p>
            <h2 className="text-heading-section">
              {renderRichTitle(t(copy, "skills.title", "Tools of the *trade*"))}
            </h2>
          </div>
          <p className="hidden md:block text-sm text-muted-foreground max-w-xs text-pretty">
            {t(copy, "skills.subtitle", "The technologies I reach for to build modern, reliable, beautiful web products.")}
          </p>
        </div>

        {/* Marquee */}
        <div className="relative -mx-6 md:-mx-12">
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="space-y-5 py-4 overflow-hidden">
            <div className="flex animate-marquee">
              {rowARepeated.map((t, i) => (
                <TechPill key={`a-${i}`} name={t} />
              ))}
            </div>
            <div className="flex animate-marquee-reverse">
              {rowBRepeated.map((t, i) => (
                <TechPill key={`b-${i}`} name={t} />
              ))}
            </div>
          </div>
        </div>

        {/* Categorized list */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-5 mt-16">
          {skills.map((cat, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-3xl p-7 hover:border-foreground/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-5">
                <p className="font-display text-2xl">{cat.category_name}</p>
                <span className="eyebrow">{cat.technologies.length} {t(copy, "skills.tools_count", "tools")}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
