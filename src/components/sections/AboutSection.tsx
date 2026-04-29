import { Profile } from "@/types/portfolio"
import { Sparkles, User, GraduationCap, Target } from "lucide-react"

interface Props {
  profile: Profile
}

export const AboutSection = ({ profile }: Props) => {
  if (!profile.bio) return null

  return (
    <section id="about" className="px-6 scroll-mt-32">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
           
           {/* 🎭 Narrating Title */}
           <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Personal Profile</span>
                 </div>
                 <h2 className="text-4xl md:text-5xl font-bold tracking-tight italic leading-tight">
                    Professional <span className="text-zinc-600">Narrative.</span>
                 </h2>
              </div>
              
              <div className="flex flex-col gap-6">
                 {[
                    { icon: <User className="w-4 h-4" />, label: "Current Focus", value: profile.role_title },
                    { icon: <GraduationCap className="w-4 h-4" />, label: "Experience Intensity", value: `${profile.experience_years || 0}+ Years in Engineering` },
                    { icon: <Target className="w-4 h-4" />, label: "Primary Objective", value: "Scalability & Architectural Integrity" }
                 ].map((stat, i) => (
                    <div key={i} className="flex flex-col gap-1">
                       <div className="flex items-center gap-2 text-zinc-500">
                          {stat.icon}
                          <span className="text-[8px] font-bold uppercase tracking-widest">{stat.label}</span>
                       </div>
                       <p className="text-lg font-bold italic tracking-tight">{stat.value}</p>
                    </div>
                 ))}
              </div>
           </div>

           {/* 🖋️ The Bio Narrative */}
           <div className="lg:col-span-7 relative">
              <div className="absolute -inset-8 bg-muted/30 rounded-[3rem] -z-10 blur-xl" />
              <div className="p-10 md:p-14 rounded-[3.5rem] bg-card border border-border shadow-2xl shadow-primary/5 space-y-8">
                 <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <p className="text-lg md:text-xl font-medium leading-relaxed italic text-muted-foreground whitespace-pre-wrap">
                       {profile.bio}
                    </p>
                 </div>
                 
                 <div className="pt-8 border-t border-border/50 flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary italic">Expert Collaboration Ready</p>
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-card shadow-sm" />
                       ))}
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </section>
  )
}
