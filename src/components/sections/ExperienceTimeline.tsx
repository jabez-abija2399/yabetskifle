import { Experience } from "@/types/portfolio"
import { Briefcase, Calendar, MapPin } from "lucide-react"

interface Props {
  experiences: Experience[]
}

export const ExperienceTimeline = ({ experiences }: Props) => {
  return (
    <section id="experience" className="py-24 px-6 max-w-5xl mx-auto space-y-16">
      
      {/* Section Header */}
      <div className="space-y-4">
         <h2 className="text-display italic">Career Evolution</h2>
         <p className="text-muted-foreground text-sm font-medium uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-8 h-px bg-primary" /> Strategic Professional Progression
         </p>
      </div>

      <div className="relative space-y-12">
        {/* The Vertical Line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" />

        {experiences.map((exp, index) => {
          const isEven = index % 2 === 0
          return (
            <div key={exp.id} className={`relative flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}>
               
               {/* The Center Dot */}
               <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-primary border-4 border-background rounded-full -translate-x-1/2 z-10 hidden md:block shadow-lg shadow-primary/40" />

               {/* The Content Card */}
               <div className="w-full md:w-[45%] p-8 rounded-[2.5rem] border border-border bg-card hover:border-primary/30 transition-all group">
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                           {exp.duration}
                        </span>
                        {exp.is_current && (
                           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        )}
                     </div>

                     <div className="space-y-1">
                        <h3 className="text-2xl font-black italic tracking-tight">{exp.role}</h3>
                        <p className="text-lg font-bold text-zinc-500">{exp.company}</p>
                     </div>

                     <div className="flex gap-4 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {exp.location}</span>
                     </div>

                     <ul className="space-y-3 pt-4 border-t border-border">
                        {exp.description?.map((duty, i) => (
                           <li key={i} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 mt-1.5 shrink-0" />
                              {duty}
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>

               {/* Year Display (Desktop) */}
               <div className={`hidden md:block w-[45%] text-4xl font-black text-muted-foreground/10 uppercase italic ${isEven ? 'text-left pl-10' : 'text-right pr-10'}`}>
                  {exp.duration.split('-')[0].trim()}
               </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
