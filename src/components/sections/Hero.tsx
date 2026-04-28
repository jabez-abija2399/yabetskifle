"use client"

import Image from "next/image"
import { Profile } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown, Download } from "lucide-react"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"
import { motion, Variants } from "framer-motion"
import { ViewTracker } from "@/components/analytics/ViewTracker"

interface Props {
  profile: Profile
}

// 🎬 Framer Motion Variants for Staggered Entrance
const containerVariant: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60 } }
}

export const Hero = ({ profile }: Props) => {
  return (
    <section className="min-h-[95vh] flex flex-col items-center justify-center pt-24 px-6 overflow-hidden relative">
      <ViewTracker path="/" />
      
      {/* 🌌 Cinematic Abstract Background Elements */}
      <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-primary/10 blur-[130px] rounded-full mix-blend-screen pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-overlay pointer-events-none -z-10" />

      <motion.div 
        variants={containerVariant} 
        initial="hidden" 
        animate="show" 
        className="max-w-4xl w-full text-center space-y-12 z-10"
      >
        
        {/* 🎭 Avatar Wrapper (Glassmorphic & Interactive) */}
        <motion.div variants={itemVariant} className="relative w-36 h-36 mx-auto group perspective-1000">
          <div className="absolute inset-0 bg-primary/30 blur-3xl group-hover:bg-primary/50 transition-all duration-700 ease-out rounded-full" />
          <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-border/50 p-1 bg-background/50 backdrop-blur-xl shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1">
            <Image 
               src={profile.avatar_url || "/placeholder.jpg"} 
               alt={profile.full_name} 
               fill 
               className="object-cover rounded-[2.2rem]"
            />
          </div>
        </motion.div>

        {/* 📖 Hero Narrative */}
        <motion.div variants={itemVariant} className="space-y-6">
           
           {/* ✨ Status Indicator */}
           <div className="inline-flex items-center backdrop-blur-md bg-background/30 border border-border/50 px-4 py-2 rounded-full shadow-sm">
              <span className="relative flex h-2.5 w-2.5 mr-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-foreground/80 font-black uppercase tracking-[0.2em] text-[10px]">
                 Available for new projects
              </span>
           </div>

           <h1 className="text-5xl md:text-[5.5rem] font-black tracking-tighter leading-[0.9]">
              I&apos;m <span className="text-zinc-500 hover:text-foreground transition-colors duration-500 cursor-default">{(profile.full_name || "Guest").split(' ')[0]}</span>. <br />
              <span className="text-primary italic">{profile.role_title}</span>
           </h1>
           <p className="max-w-xl mx-auto text-muted-foreground text-lg md:text-2xl font-medium pt-2 leading-relaxed">
              {profile.bio}
           </p>
        </motion.div>

        {/* 🚀 CTAs */}
        <motion.div variants={itemVariant} className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
           <Button asChild size="lg" className="rounded-full px-10 h-14 font-black text-lg shadow-xl shadow-primary/25 hover:-translate-y-1 transition-all duration-300">
              <a href="#work">
                 View Work 
                 <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
           </Button>
           <div className="flex gap-4">
             <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-14 font-black border border-border hover:bg-muted/50 backdrop-blur-md">
                <a href="#contact">Let&apos;s Talk</a>
             </Button>
             {profile.resume_url && (
               <Button asChild variant="secondary" size="lg" className="rounded-full px-8 h-14 font-black shadow-lg hover:-translate-y-1 transition-all">
                  <a href={profile.resume_url} target="_blank" rel="noreferrer">
                    <Download className="mr-2 w-4 h-4" /> CV / Resume
                  </a>
               </Button>
             )}
           </div>
        </motion.div>

        {/* 🌍 Social Icons Component */}
        <motion.div variants={itemVariant} className="flex items-center justify-center gap-8 pt-8 border-t border-border/30 w-fit mx-auto px-10">
           {profile.social_links?.github && (
             <a href={profile.social_links.github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:scale-110 hover:-translate-y-1 p-2">
                <FaGithub className="w-6 h-6" />
             </a>
           )}
           {profile.social_links?.linkedin && (
             <a href={profile.social_links.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:scale-110 hover:-translate-y-1 p-2">
                <FaLinkedin className="w-6 h-6" />
             </a>
           )}
           {profile.social_links?.twitter && (
             <a href={profile.social_links.twitter} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:scale-110 hover:-translate-y-1 p-2">
                <FaTwitter className="w-6 h-6" />
             </a>
           )}
        </motion.div>
      </motion.div>

      {/* ⬇️ Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
      >
         <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Scroll</span>
         <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  )
}