"use client"

import { useState } from "react"
import { Profile, SkillCategory, SocialLinks } from "@/types/portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { DocumentUploader } from "@/components/ui/DocumentUploader"
import { SkillCategoryInput } from "./SkillCategoryInput"
import { Loader2, Mail, X, Plus } from "lucide-react"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"
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
  const [tags, setTags] = useState<string[]>(initialData.availability_tags || [
    "Full-time", "Contract", "Freelance", "Remote", "Hybrid", "On-site"
  ])
  const [newTag, setNewTag] = useState("")

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
      skills,
      social_links: socials,
      about_story: formData.get("about_story") as string,
      currently_learning: formData.get("currently_learning") as string,
      philosophy_quote: formData.get("philosophy_quote") as string,
      philosophy_author: formData.get("philosophy_author") as string,
      location: formData.get("location") as string,
      timezone: formData.get("timezone") as string,
      availability_tags: tags,
    })
  }

  const addTag = () => {
    const trimmed = newTag.trim()
    if (trimmed && !tags.includes(trimmed)) setTags([...tags, trimmed])
    setNewTag("")
  }

  const removeTag = (t: string) => setTags(tags.filter(x => x !== t))

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">

      {/* LEFT — Avatar, resume, socials */}
      <div className="space-y-8">
        <div className="space-y-4">
          <label className="text-sm font-semibold">Profile Photo</label>
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-border mb-4 bg-muted">
            {avatar && <Image src={avatar} alt="Avatar" fill className="object-cover" />}
          </div>
          <ImageUploader onUpload={setAvatar} />
        </div>

        <div className="space-y-4 pt-6 border-t border-border">
          <label className="text-sm font-semibold">Resume / CV</label>
          <DocumentUploader onUpload={setResume} currentResumeUrl={resume} />
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card space-y-5">
          <p className="text-xs font-semibold uppercase text-muted-foreground tracking-widest">Social Links</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FaGithub className="w-4 h-4 text-muted-foreground" />
              <Input value={socials.github || ""} onChange={e => setSocials({...socials, github: e.target.value})} placeholder="GitHub URL" className="h-9 text-xs" />
            </div>
            <div className="flex items-center gap-3">
              <FaLinkedin className="w-4 h-4 text-muted-foreground" />
              <Input value={socials.linkedin || ""} onChange={e => setSocials({...socials, linkedin: e.target.value})} placeholder="LinkedIn URL" className="h-9 text-xs" />
            </div>
            <div className="flex items-center gap-3">
              <FaTwitter className="w-4 h-4 text-muted-foreground" />
              <Input value={socials.twitter || ""} onChange={e => setSocials({...socials, twitter: e.target.value})} placeholder="Twitter URL (or leave empty)" className="h-9 text-xs" />
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <Input value={socials.email || ""} onChange={e => setSocials({...socials, email: e.target.value})} placeholder="Contact Email" className="h-9 text-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — Identity & content */}
      <div className="lg:col-span-2 space-y-10">

        {/* Identity */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold">Identity</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-sm font-medium">Full Name</label>
              <Input name="full_name" defaultValue={initialData.full_name} required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Job Title</label>
              <Input name="role_title" defaultValue={initialData.role_title} required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Years of Experience</label>
              <Input name="experience_years" type="number" defaultValue={initialData.experience_years} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Location</label>
              <Input name="location" defaultValue={initialData.location || ""} placeholder="e.g. Addis Ababa, Ethiopia" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Timezone / Working note</label>
              <Input name="timezone" defaultValue={initialData.timezone || ""} placeholder="e.g. GMT+3 — Working globally" />
            </div>
          </div>
        </section>

        {/* Hero bio */}
        <section className="space-y-3 pt-4 border-t border-border">
          <h3 className="text-lg font-semibold">Hero Bio (short — shown under your name)</h3>
          <p className="text-xs text-muted-foreground">2-4 sentences. The first thing visitors read.</p>
          <textarea
            name="bio"
            defaultValue={initialData.bio}
            required
            className="w-full min-h-32 p-4 rounded-2xl border border-border bg-background text-foreground text-sm leading-relaxed"
            placeholder="Hi — I'm Yabets, a frontend engineer who..."
          />
        </section>

        {/* About story */}
        <section className="space-y-3 pt-4 border-t border-border">
          <h3 className="text-lg font-semibold">About — Long Story</h3>
          <p className="text-xs text-muted-foreground">3 paragraphs separated by blank lines. Shown in the About section.</p>
          <textarea
            name="about_story"
            defaultValue={initialData.about_story || ""}
            className="w-full min-h-64 p-4 rounded-2xl border border-border bg-background text-foreground text-sm leading-relaxed font-mono"
            placeholder={`Para 1...

Para 2...

Para 3...`}
          />
        </section>

        {/* Currently learning */}
        <section className="space-y-3 pt-4 border-t border-border">
          <h3 className="text-lg font-semibold">Currently Learning (tile)</h3>
          <Input
            name="currently_learning"
            defaultValue={initialData.currently_learning || ""}
            placeholder="e.g. Going deeper on backend & cloud."
          />
        </section>

        {/* Philosophy */}
        <section className="space-y-3 pt-4 border-t border-border">
          <h3 className="text-lg font-semibold">Philosophy / Quote (tile)</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs text-muted-foreground">Quote</label>
              <Input
                name="philosophy_quote"
                defaultValue={initialData.philosophy_quote || ""}
                placeholder="Details aren't details. They make the design."
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Author</label>
              <Input
                name="philosophy_author"
                defaultValue={initialData.philosophy_author || ""}
                placeholder="Charles Eames"
              />
            </div>
          </div>
        </section>

        {/* Availability tags */}
        <section className="space-y-3 pt-4 border-t border-border">
          <h3 className="text-lg font-semibold">Availability Tags (Hero)</h3>
          <p className="text-xs text-muted-foreground">Pills shown in the hero. Add or remove freely.</p>
          <div className="flex flex-wrap gap-2">
            {tags.map(t => (
              <span key={t} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground">
                {t}
                <button type="button" onClick={() => removeTag(t)} className="hover:text-foreground">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
              placeholder="Add a tag (e.g. Internship)"
              className="h-9 text-xs"
            />
            <Button type="button" onClick={addTag} variant="outline" size="sm" className="rounded-full">
              <Plus className="w-3 h-3 mr-1" /> Add
            </Button>
          </div>
        </section>

        {/* Skills */}
        <section className="pt-4 border-t border-border">
          <SkillCategoryInput categories={skills} onChange={setSkills} />
        </section>

        {/* Save */}
        <div className="flex justify-end pt-10 border-t border-border">
          <Button type="submit" size="lg" disabled={isSaving} className="rounded-2xl px-10 h-14 font-semibold">
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save All Changes
          </Button>
        </div>
      </div>
    </form>
  )
}
