import Image from "next/image"
import { Profile } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"

interface Props {
  profile: Profile
}

export const Hero = ({ profile }: Props) => {
  return (
    <section className="min-h-[90vh] flex flex-col items-center justify-center pt-32 px-6 overflow-hidden relative">
      {/* Abstract Background Glows */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full -z-10" />

      <div className="max-w-4xl w-full text-center space-y-10 group">
        
        {/* Avatar Wrapper */}
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 bg-primary/20 blur-3xl group-hover:bg-primary/40 transition-all rounded-full" />
          <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-2 border-border p-1 bg-background">
            <Image 
               src={profile.avatar_url || "/placeholder.jpg"} 
               alt={profile.full_name} 
               fill 
               className="object-cover rounded-[2.2rem]"
            />
          </div>
        </div>

        {/* Hero Text */}
        <div className="space-y-4">
           <h4 className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">
              Available for new projects
           </h4>
           <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">
              I&apos;m <span className="text-zinc-500">{(profile.full_name || "Guest").split(' ')[0]}</span>. <br />
              <span className="text-primary">{profile.role_title}</span>
           </h1>
           <p className="max-w-xl mx-auto text-muted-foreground text-lg md:text-xl font-medium pt-4">
              {profile.bio}
           </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
           <Button asChild size="lg" className="rounded-2xl px-10 h-14 font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
              <a href="#work">View Work <ArrowRight className="ml-2 w-5 h-5" /></a>
           </Button>
           <Button asChild variant="outline" size="lg" className="rounded-2xl px-10 h-14 font-black border-2">
              <a href="#contact">Let&apos;s Talk</a>
           </Button>
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-8 pt-10">
           <a href={profile.social_links?.github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:scale-110"><FaGithub className="w-6 h-6" /></a>
           <a href={profile.social_links?.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:scale-110"><FaLinkedin className="w-6 h-6" /></a>
           <a href={profile.social_links?.twitter} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-all hover:scale-110"><FaTwitter className="w-6 h-6" /></a>
        </div>
      </div>
    </section>
  )
}