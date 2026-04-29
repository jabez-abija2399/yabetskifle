"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

export const CTASection = () => {
  return (
    <section className="px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto rounded-[3.5rem] bg-primary p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10 text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/20"
      >
        {/* Dynamic Background Element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="space-y-6 relative z-10 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight italic leading-tight">
            Ready to architect your <br />
            <span className="text-white/60">next masterpiece?</span>
          </h2>
          <p className="text-primary-foreground/70 max-w-xl text-lg md:text-xl font-medium italic">
            Currently available for Full-time, Freelance, and Contract-based roles worldwide.
          </p>
        </div>

        <div className="relative z-10">
          <Button 
            asChild 
            size="lg" 
            className="rounded-full h-20 px-10 bg-white text-primary hover:bg-zinc-100 font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all text-[11px] gap-3"
          >
            <a href="#contact">
              Initiate Conversation <ArrowUpRight className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
