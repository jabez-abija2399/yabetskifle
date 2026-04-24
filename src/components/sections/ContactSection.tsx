"use client"

import { useState } from "react"
import { createSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Mail, Send, MapPin, Phone } from "lucide-react"

export const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createSupabaseClient()

    const { error } = await supabase.from("messages").insert([{
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    }])

    if (error) {
      toast.error(`Message failed to send: ${error.message}`)
    } else {
      toast.success("Message sent! I'll get back to you soon.")
      ;(e.target as HTMLFormElement).reset()
    }
    setIsSubmitting(false)
  }

  return (
    <section id="contact" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
      
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        
        {/* Left: Contact Info */}
        <div className="space-y-10">
           <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic">Get In Touch</h2>
              <p className="text-muted-foreground text-lg max-w-sm">
                Have a project in mind or just want to say hi? Feel free to reach out!
              </p>
           </div>

           <div className="space-y-6">
              {[
                { icon: <Mail className="w-5 h-5" />, label: "Email", value: "hello@yourdomain.com" },
                { icon: <MapPin className="w-5 h-5" />, label: "Location", value: "Addis Ababa, Ethiopia" },
                { icon: <Phone className="w-5 h-5" />, label: "Availability", value: "Available for Remote Work" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                   <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/30 transition-all">
                      {item.icon}
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{item.label}</p>
                      <p className="font-bold">{item.value}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Right: The Form */}
        <div className="p-10 rounded-[3rem] border border-border bg-card shadow-2xl shadow-primary/5">
           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-2">Name</label>
                   <Input name="name" placeholder="John Doe" required className="h-14 rounded-2xl bg-muted/30 border-border/50" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-2">Email</label>
                   <Input name="email" type="email" placeholder="john@example.com" required className="h-14 rounded-2xl bg-muted/30 border-border/50" />
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-2">Subject</label>
                 <Input name="subject" placeholder="Project Inquiry" required className="h-14 rounded-2xl bg-muted/30 border-border/50" />
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-2">Message</label>
                 <textarea 
                    name="message" 
                    required 
                    placeholder="Tell me more about your project..."
                    className="w-full min-h-32 p-4 rounded-[2rem] border border-border/50 bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                 />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-2xl font-black text-lg gap-2 shadow-xl shadow-primary/20">
                 {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                 {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
           </form>
        </div>

      </div>
    </section>
  )
}
