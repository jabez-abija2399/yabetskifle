import { Service } from "@/types/portfolio"
import { Box, Code2, Layout, Database, Smartphone, Palette } from "lucide-react"

// A helper to map icon names from DB to real Lucide Icons
const IconMap: any = {
  Code2, Layout, Database, Smartphone, Palette, Box
}

interface Props {
  services: Service[]
}

export const ServicesGrid = ({ services }: Props) => {
  return (
    <section id="services" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-3">
         <h2 className="text-heading-section font-bold tracking-tighter italic">SERVICES</h2>
         <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">Professional solutions for digital excellence</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = IconMap[service.icon_name || "Box"] || Box
          return (
            <div key={service.id} className="p-10 rounded-[3rem] bg-card border border-border hover:border-primary/50 transition-all group relative overflow-hidden">
               {/* Decorative background glow */}
               <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all rounded-full" />
               
               <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-primary" />
               </div>

               <h3 className="text-2xl font-bold mb-4 tracking-tight italic">{service.title}</h3>
               <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {service.description}
               </p>

               <ul className="space-y-2">
                  {service.features?.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                       <span className="w-1 h-1 rounded-full bg-primary" />
                       {feature}
                    </li>
                  ))}
               </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
