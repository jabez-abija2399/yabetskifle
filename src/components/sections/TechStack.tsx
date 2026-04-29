"use client"
import { motion } from "framer-motion"
import { 
  SiNextdotjs, SiTypescript, SiReact, SiNodedotjs, 
  SiPostgresql, SiSupabase, SiPrisma, SiDocker, 
  SiTailwindcss, SiFramer, SiFigma, SiVercel,
  SiGithub, SiReactquery, SiPostman, SiPython,
  SiGo, SiRust, SiMongodb, SiRedis, SiJavascript,
  SiNetlify, SiMui,
  SiGooglecloud, SiFramer as SiFramerMotion
} from "react-icons/si"
import { IconType } from "react-icons"
import { Cpu, Braces, Layers, Settings, Cloud, Database } from "lucide-react"

// 🛠️ Dynamic Icon & Theme Mapping
const getTechProfile = (name: string): { icon: IconType; color: string; bg: string } => {
  const n = name.toLowerCase()
  if (n.includes("next")) return { icon: SiNextdotjs, color: "text-white", bg: "bg-zinc-800" }
  if (n.includes("typescript")) return { icon: SiTypescript, color: "text-[#3178C6]", bg: "bg-[#3178C6]/10" }
  if (n.includes("javascript") || n.includes("js")) return { icon: SiJavascript, color: "text-[#F7DF1E]", bg: "bg-[#F7DF1E]/10" }
  if (n.includes("react")) return { icon: SiReact, color: "text-[#61DAFB]", bg: "bg-[#61DAFB]/10" }
  if (n.includes("node")) return { icon: SiNodedotjs, color: "text-[#339933]", bg: "bg-[#339933]/10" }
  if (n.includes("postgre")) return { icon: SiPostgresql, color: "text-[#4169E1]", bg: "bg-[#4169E1]/10" }
  if (n.includes("supabase")) return { icon: SiSupabase, color: "text-[#3ECF8E]", bg: "bg-[#3ECF8E]/10" }
  if (n.includes("mongo")) return { icon: SiMongodb, color: "text-[#47A248]", bg: "bg-[#47A248]/10" }
  if (n.includes("prisma")) return { icon: SiPrisma, color: "text-white", bg: "bg-zinc-700" }
  if (n.includes("docker")) return { icon: SiDocker, color: "text-[#2496ED]", bg: "bg-[#2496ED]/10" }
  if (n.includes("tailwind")) return { icon: SiTailwindcss, color: "text-[#06B6D4]", bg: "bg-[#06B6D4]/10" }
  if (n.includes("material") || n.includes("mui")) return { icon: SiMui, color: "text-[#007FFF]", bg: "bg-[#007FFF]/10" }
  if (n.includes("framer")) return { icon: SiFramerMotion, color: "text-white", bg: "bg-zinc-800" }
  if (n.includes("figma")) return { icon: SiFigma, color: "text-[#F24E1E]", bg: "bg-[#F24E1E]/10" }
  if (n.includes("vercel")) return { icon: SiVercel, color: "text-white", bg: "bg-black" }
  if (n.includes("netlify")) return { icon: SiNetlify, color: "text-[#00C7B7]", bg: "bg-[#00C7B7]/10" }
  if (n.includes("github")) return { icon: SiGithub, color: "text-white", bg: "bg-zinc-900" }
  if (n.includes("query")) return { icon: SiReactquery, color: "text-[#FF4154]", bg: "bg-[#FF4154]/10" }
  if (n.includes("python")) return { icon: SiPython, color: "text-[#3776AB]", bg: "bg-[#3776AB]/10" }
  
  return { icon: Braces, color: "text-primary", bg: "bg-primary/10" }
}

const getCategoryTheme = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes("eng") || n.includes("arch")) return { icon: <Cpu className="w-5 h-5" />, color: "text-blue-500", glow: "from-blue-500/10" }
  if (n.includes("data") || n.includes("sys")) return { icon: <Database className="w-5 h-5" />, color: "text-emerald-500", glow: "from-emerald-500/10" }
  if (n.includes("exp") || n.includes("int") || n.includes("vis")) return { icon: <Braces className="w-5 h-5" />, color: "text-orange-500", glow: "from-orange-500/10" }
  if (n.includes("cloud") || n.includes("ops")) return { icon: <Cloud className="w-5 h-5" />, color: "text-purple-500", glow: "from-purple-500/10" }
  return { icon: <Settings className="w-5 h-5" />, color: "text-primary", glow: "from-primary/10" }
}

interface Props {
  skills: any[]
}

export const TechStack = ({ skills }: Props) => {
  if (!skills || skills.length === 0) return null

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto space-y-16">
      
      {/* 🧭 Professional Header */}
      <h2 className="text-heading-section font-bold tracking-tight italic text-center md:text-left">
        SKILLS
      </h2>

      {/* 🔮 High-Visibility Grid */}
      <div className="grid lg:grid-cols-2 gap-10">
        {skills.map((cat, idx) => {
          const theme = getCategoryTheme(cat.category_name)
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative p-10 rounded-[3.5rem] bg-card border border-border/60 hover:border-primary/40 transition-all duration-500 overflow-hidden"
            >
               {/* Ambient Backdrop Glow */}
               <div className={`absolute top-0 right-0 w-64 h-64 bg-linear-to-bl ${theme.glow} to-transparent opacity-40 group-hover:opacity-100 transition-opacity blur-3xl rounded-full translate-x-1/2 -translate-y-1/2`} />

               <div className="relative z-10 space-y-10">
                  {/* Category Header */}
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center ${theme.color} shadow-inner`}>
                        {theme.icon}
                     </div>
                     <h3 className="text-xl font-bold italic tracking-tight">{cat.category_name}</h3>
                  </div>

                  {/* Tech Pills (The "Attractiveness" Fix) */}
                  <div className="flex flex-wrap gap-4">
                     {cat.technologies.map((techName: string) => {
                       const tech = getTechProfile(techName)
                       return (
                         <div 
                           key={techName} 
                           className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group/tech"
                         >
                            <div className={`w-8 h-8 rounded-lg ${tech.bg} flex items-center justify-center transition-transform group-hover/tech:scale-110 shadow-sm`}>
                               <tech.icon className={`w-4 h-4 ${tech.color}`} />
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-600 group-hover/tech:text-foreground transition-colors">
                               {techName}
                            </span>
                         </div>
                       )
                     })}
                  </div>
               </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
