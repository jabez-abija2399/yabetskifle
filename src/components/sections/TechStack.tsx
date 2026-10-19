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
import { SectionHeader } from "@/components/ui/SectionHeader"
import { useSpotlight } from "@/hooks/useSpotlight"

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
  if (n.includes("typescript")) return { icon: SiTypescript, color: "text-[#3178c6]" }
  if (n.includes("javascript") || n === "js") return { icon: SiJavascript, color: "text-[#f7df1e]" }
  if (n.includes("react query") || n.includes("query")) return { icon: SiReactquery, color: "text-[#ff4154]" }
  if (n.includes("react")) return { icon: SiReact, color: "text-[#61dafb]" }
  if (n.includes("node")) return { icon: SiNodedotjs, color: "text-[#84cc16]" }
  if (n.includes("postgre")) return { icon: SiPostgresql, color: "text-[#4169e1]" }
  if (n.includes("supabase")) return { icon: SiSupabase, color: "text-[#3ecf8e]" }
  if (n.includes("mongo")) return { icon: SiMongodb, color: "text-[#47a248]" }
  if (n.includes("prisma")) return { icon: SiPrisma, color: "text-foreground" }
  if (n.includes("docker")) return { icon: SiDocker, color: "text-[#2496ed]" }
  if (n.includes("tailwind")) return { icon: SiTailwindcss, color: "text-[#38bdf8]" }
  if (n.includes("material") || n.includes("mui")) return { icon: SiMui, color: "text-[#007fff]" }
  if (n.includes("framer")) return { icon: SiFramer, color: "text-foreground" }
  if (n.includes("figma")) return { icon: SiFigma, color: "text-[#f24e1e]" }
  if (n.includes("vercel")) return { icon: SiVercel, color: "text-foreground" }
  if (n.includes("netlify")) return { icon: SiNetlify, color: "text-[#00c7b7]" }
  if (n.includes("github")) return { icon: SiGithub, color: "text-foreground" }
  if (n.includes("python")) return { icon: SiPython, color: "text-[#3776ab]" }
  return { icon: Braces, color: "text-muted-foreground" }
}

export const TechStack = ({ skills, copy }: Props) => {
  const onSpotlight = useSpotlight()
  if (!skills || skills.length === 0) return null

  const totalTools = skills.reduce((acc, cat) => acc + cat.technologies.length, 0)

  return (
    <section id="skills" className="mx-auto max-w-6xl scroll-mt-28 px-6 md:px-10">
      <SectionHeader
        eyebrow={t(copy, "skills.eyebrow", "Toolkit")}
        title={renderRichTitle(t(copy, "skills.title", "The stack I *build* with"), "text-accent")}
        subtitle={t(copy, "skills.subtitle", `${totalTools} tools across the frontend, backend, and delivery.`)}
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((cat) => (
          <div
            key={cat.category_name}
            onPointerMove={onSpotlight}
            className="spotlight lift-card flex flex-col gap-5 rounded-3xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">{cat.category_name}</h3>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
                {cat.technologies.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.technologies.map((tech) => {
                const { icon: Icon, color } = getIcon(tech)
                return (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent/50"
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                    {tech}
                  </span>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
