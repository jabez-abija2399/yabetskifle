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
import { Braces, Layers } from "lucide-react"

import { SiteCopy, t } from "@/lib/copy"

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
  if (n.includes("typescript")) return { icon: SiTypescript, color: "text-[#2D5F6B] dark:text-[#3E7987]" }
  if (n.includes("javascript") || n === "js") return { icon: SiJavascript, color: "text-[#1A1D23] dark:text-[#ECE8DF]" }
  if (n.includes("react query") || n.includes("query")) return { icon: SiReactquery, color: "text-[#C4432E]" }
  if (n.includes("react")) return { icon: SiReact, color: "text-[#2D5F6B] dark:text-[#3E7987]" }
  if (n.includes("node")) return { icon: SiNodedotjs, color: "text-foreground" }
  if (n.includes("postgre")) return { icon: SiPostgresql, color: "text-[#2D5F6B] dark:text-[#3E7987]" }
  if (n.includes("supabase")) return { icon: SiSupabase, color: "text-[#2D5F6B] dark:text-[#3E7987]" }
  if (n.includes("mongo")) return { icon: SiMongodb, color: "text-foreground" }
  if (n.includes("prisma")) return { icon: SiPrisma, color: "text-foreground" }
  if (n.includes("docker")) return { icon: SiDocker, color: "text-[#2D5F6B] dark:text-[#3E7987]" }
  if (n.includes("tailwind")) return { icon: SiTailwindcss, color: "text-[#2D5F6B] dark:text-[#3E7987]" }
  if (n.includes("material") || n.includes("mui")) return { icon: SiMui, color: "text-[#2D5F6B] dark:text-[#3E7987]" }
  if (n.includes("framer")) return { icon: SiFramer, color: "text-foreground" }
  if (n.includes("figma")) return { icon: SiFigma, color: "text-[#C4432E]" }
  if (n.includes("vercel")) return { icon: SiVercel, color: "text-foreground" }
  if (n.includes("netlify")) return { icon: SiNetlify, color: "text-foreground" }
  if (n.includes("github")) return { icon: SiGithub, color: "text-foreground" }
  if (n.includes("python")) return { icon: SiPython, color: "text-[#2D5F6B] dark:text-[#3E7987]" }
  return { icon: Braces, color: "text-muted-foreground" }
}

export const TechStack = ({ skills, copy }: Props) => {
  if (!skills || skills.length === 0) return null

  const totalTools = skills.reduce((acc, cat) => acc + cat.technologies.length, 0)

  return (
    <section id="skills" className="px-6 md:px-12 lg:px-16 xl:px-24 scroll-mt-24">
      <div className="max-w-[1600px] mx-auto">
        {/* Section header — Sentence case */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-border">
          <div className="space-y-2">
            <div className="font-mono text-xs text-[#2D5F6B] dark:text-[#3E7987]">
              {t(copy, "skills.eyebrow", "02. Technical specifications")}
            </div>
            <h2 className="text-heading-section font-semibold tracking-tight text-foreground">
              {t(copy, "skills.title", "Architecture, runtime & stack inventory")}
            </h2>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            <span>[index count: {totalTools} verified tools]</span>
          </div>
        </div>

        {/* Structured Technical Matrix */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((cat, i) => (
            <div
              key={i}
              className="border border-border bg-card p-5 rounded-xs corner-ticks flex flex-col justify-between"
            >
              {/* Category Header */}
              <div className="pb-4 mb-4 border-b border-border/80 flex items-center justify-between font-mono text-xs">
                <span className="flex items-center gap-1.5 text-foreground font-medium">
                  <Layers className="w-3.5 h-3.5 text-[#2D5F6B] dark:text-[#3E7987]" />
                  <span>{cat.category_name}</span>
                </span>
                <span className="text-[11px] text-muted-foreground">
                  [{String(cat.technologies.length).padStart(2, "0")} modules]
                </span>
              </div>

              {/* Technologies List */}
              <div className="grid grid-cols-2 gap-2.5">
                {cat.technologies.map((tech) => {
                  const { icon: Icon, color } = getIcon(tech)
                  return (
                    <div
                      key={tech}
                      className="flex items-center gap-2.5 p-2 rounded-xs border border-border/60 bg-secondary/50 hover:bg-secondary hover:border-[#2D5F6B]/40 transition-colors"
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                      <span className="font-mono text-xs text-foreground truncate">
                        {tech}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Sub-footer label */}
              <div className="pt-4 mt-4 border-t border-border/60 flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                <span>layer.0{i + 1}</span>
                <span>status: active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
