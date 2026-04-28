"use client"

import { useState } from "react"
import { Profile, SkillCategory, SocialLinks } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { DocumentUploader } from "@/components/ui/DocumentUploader"
import { SkillCategoryInput } from "./SkillCategoryInput"
import { Loader2, Globe, Mail } from "lucide-react"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import Image from "next/image"

interface Props {
  initialData: Profile
  onSave: (data: Profile) => Promise<void>
  isSaving: boolean
}

export const ProfileForm = ({ initialData, onSave, isSaving }: Props) => {
  const [avatar, setAvatar] = useState(initialData.avatar_url)
  const [resume, setResume] = useState(initialData.resume_url)
  const [skills, setSkills] = useState<SkillCategory[]>(initialData.skills || [])
  const [socials, setSocials] = useState<SocialLinks>(initialData.social_links || {})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    await onSave({
      ...initialData,
      full_name: formData.get("full_name") as string,
      role_title: formData.get("role_title") as string,
      bio: formData.get("bio") as string,
      experience_years: Number(formData.get("experience_years")),
      avatar_url: avatar,
      resume_url: resume,
      skills: skills,
      social_links: socials,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      
      {/* Left: Avatar & Socials */}
      <div className="space-y-8">
        <div className="space-y-4">
          <label className="text-sm font-semibold">Profile Photo</label>
          <div className="relative aspect-square rounded-[3rem] overflow-hidden border-2 border-border mb-4 bg-muted">
            {avatar && <Image src={avatar} alt="Avatar" fill className="object-cover" />}
          </div>
          <ImageUploader onUpload={setAvatar} />
        </div>

        {/* --- Resume Document Upload --- */}
        <div className="space-y-4 pt-6 border-t border-border">
          <label className="text-sm font-semibold">Resume / CV</label>
          <DocumentUploader onUpload={setResume} currentResumeUrl={resume} />
        </div>

        <div className="p-6 rounded-[2rem] border border-border bg-card space-y-6 mt-8">
          <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Connect Links</p>
           <div className="space-y-4">
             <div className="flex items-center gap-3">
               <FaGithub className="w-4 h-4 text-zinc-500" />
               <Input value={socials.github || ""} onChange={e => setSocials({...socials, github: e.target.value})} placeholder="GitHub URL" className="h-9 text-xs" />
             </div>
             <div className="flex items-center gap-3">
               <FaLinkedin className="w-4 h-4 text-zinc-500" />
               <Input value={socials.linkedin || ""} onChange={e => setSocials({...socials, linkedin: e.target.value})} placeholder="LinkedIn URL" className="h-9 text-xs" />
             </div>
             <div className="flex items-center gap-3">
               <FaTwitter className="w-4 h-4 text-zinc-500" />
               <Input value={socials.twitter || ""} onChange={e => setSocials({...socials, twitter: e.target.value})} placeholder="Twitter URL" className="h-9 text-xs" />
             </div>
             <div className="flex items-center gap-3">
               <Mail className="w-4 h-4 text-zinc-500" />
               <Input value={socials.email || ""} onChange={e => setSocials({...socials, email: e.target.value})} placeholder="Contact Email" className="h-9 text-xs" />
             </div>
          </div>
        </div>
      </div>

      {/* Middle & Right: Bio & Skills */}
      <div className="lg:col-span-2 space-y-10">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold">Full Name</label>
            <Input name="full_name" defaultValue={initialData.full_name} required />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold">Job Title</label>
            <Input name="role_title" defaultValue={initialData.role_title} required />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold">Professional Bio</label>
          <textarea 
            name="bio" 
            defaultValue={initialData.bio} 
            required 
            className="w-full min-h-32 p-4 rounded-3xl border border-border bg-background text-sm leading-relaxed"
            placeholder="Introduce yourself to the world..."
          />
        </div>

        <div className="space-y-1 w-32">
          <label className="text-sm font-semibold">Experience (Yrs)</label>
          <Input name="experience_years" type="number" defaultValue={initialData.experience_years} />
        </div>

        <SkillCategoryInput categories={skills} onChange={setSkills} />

        <div className="flex justify-end pt-10 border-t border-border">
          <Button type="submit" size="lg" disabled={isSaving} className="rounded-2xl px-10 h-14 font-black shadow-2xl shadow-primary/20">
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Profile Changes
          </Button>
        </div>
      </div>
    </form>
  )
}
