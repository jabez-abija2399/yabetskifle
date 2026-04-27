import { Profile } from "@/types/portfolio"
import { Code2, Terminal, Cpu, Database, Cloud, Zap } from "lucide-react"

interface Props {
  profile: Profile
}

export const AboutSection = ({ profile }: Props) => {
  if (!profile.skills || profile.skills.length === 0) return null

  const getIcon = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes('front')) return <Code2 className="w-5 h-5" />
    if (n.includes('back')) return <Database className="w-5 h-5" />
    if (n.includes('dev') || n.includes('cloud')) return <Cloud className="w-5 h-5" />
    if (n.includes('tool') || n.includes('tech')) return <Terminal className="w-5 h-5" />
    return <Cpu className="w-5 h-5" />
  }

  return (
    <section id="about" className="px-6 scroll-mt-32">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Title Meta */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
           <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                 <Zap className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">Technical Stack</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter">
                 Knowledge <span className="text-zinc-600">Matrix.</span>
              </h2>
           </div>
           <p className="text-muted-foreground max-w-sm font-medium italic">
             A specialized technical foundation built on modern architectural principles and iterative learning.
           </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {profile.skills.map((category, idx) => (
             <div key={idx} className="group p-10 rounded-[3rem] bg-card border border-border hover:border-primary/40 transition-all hover:shadow-2xl hover:shadow-primary/5">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-primary transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                      {getIcon(category.name)}
                   </div>
                   <h3 className="text-xl font-black italic tracking-tight">{category.name}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                   {category.techs.map((tech) => (
                     <span key={tech} className="px-4 py-1.5 rounded-xl bg-muted text-[10px] font-bold uppercase tracking-widest text-zinc-500 border border-border/50 group-hover:text-zinc-300 transition-colors">
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
