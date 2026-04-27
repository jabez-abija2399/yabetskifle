"use client"

import { useState } from "react"
import { PortfolioService } from "@/services/portfolio"
import { Profile } from "@/types/portfolio"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Mail, Send, MapPin, Sparkles } from "lucide-react"

interface Props {
  profile?: Profile | null
}

export const ContactSection = ({ profile }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    
    try {
      // 🚀 Use the Backend Service
      await PortfolioService.submitMessage({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
      })

      toast.success("Identity Confirmed. Your message is in my inbox!")
      form.reset()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        
        {/* Left: Brand Narrative */}
        <div className="space-y-12">
           <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                 <Sparkles className="w-5 h-5" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">Communication Lab</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter italic leading-none">
                 Let's Start a <span className="text-primary">Conversation.</span>
              </h2>
              <p className="text-muted-foreground text-xl max-w-md font-medium leading-relaxed italic">
                Ready to collaborate on something extraordinary? Ship your project details my way.
              </p>
           </div>

           <div className="space-y-8 pt-8">
              {[
                { 
                  icon: <Mail className="w-5 h-5" />, 
                  label: "Transmission", 
                  value: profile?.social_links?.linkedin ? "Reply via LinkedIn" : "Direct Email",
                  link: profile?.social_links?.linkedin || `mailto:${profile?.social_links?.twitter || ""}`
                },
                { 
                  icon: <MapPin className="w-5 h-5" />, 
                  label: "Current HQ", 
                  value: "Global / Remote Optimized"
                }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 group">
                   <div className="w-14 h-14 rounded-3xl bg-muted/50 border border-border flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-500">
                      {item.icon}
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-1">{item.label}</p>
                      <p className="text-lg font-bold italic group-hover:text-primary transition-colors cursor-default">{item.value}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Right: The High-End Form */}
        <div className="relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <div className="relative p-12 rounded-[3rem] border border-border bg-card/50 backdrop-blur-3xl shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">Your Name</label>
                       <Input name="name" placeholder="E.g. Elon Musk" required className="h-14 rounded-2xl bg-muted/20 border-border/40 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">Secure Email</label>
                       <Input name="email" type="email" placeholder="elon@spacex.com" required className="h-14 rounded-2xl bg-muted/20 border-border/40 focus:ring-primary/20" />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">Protocol / Subject</label>
                    <Input name="subject" placeholder="New Project Proposition" required className="h-14 rounded-2xl bg-muted/20 border-border/40 focus:ring-primary/20" />
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">Brief / Payload</label>
                    <textarea 
                       name="message" 
                       required 
                       placeholder="I have a vision for a new platform..."
                       className="w-full min-h-[160px] p-6 rounded-[2.5rem] border border-border/40 bg-muted/20 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-foreground"
                    />
                 </div>

                 <Button type="submit" disabled={isSubmitting} className="w-full h-16 rounded-2xl font-black italic text-lg gap-2 shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all active:translate-y-0">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {isSubmitting ? "TRANSMITTING..." : "SHIP MESSAGE"}
                 </Button>
              </form>
           </div>
        </div>

      </div>
    </section>
  )
}
