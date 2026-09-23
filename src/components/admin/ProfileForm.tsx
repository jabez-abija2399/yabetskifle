"use client"

import { useState } from "react"
import { Profile, SkillCategory, SocialLinks } from "@/types/portfolio"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { DocumentUploader } from "@/components/ui/DocumentUploader"
import { SkillCategoryInput } from "./SkillCategoryInput"
import { TextField, TextAreaField, FormFooter, FormSection } from "./fields"
import { Button } from "@/components/ui/button"
import { X, Plus, Mail } from "lucide-react"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"

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
  const [tags, setTags] = useState<string[]>(
    initialData.availability_tags || [
      "Full-time",
      "Contract",
      "Freelance",
      "Remote",
      "Hybrid",
      "On-site",
    ]
  )
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

  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t))

  const socialRows = [
    { key: "github" as const, icon: <FaGithub className="size-4" />, placeholder: "GitHub URL" },
    { key: "linkedin" as const, icon: <FaLinkedin className="size-4" />, placeholder: "LinkedIn URL" },
    { key: "twitter" as const, icon: <FaTwitter className="size-4" />, placeholder: "Twitter URL (optional)" },
    { key: "email" as const, icon: <Mail className="size-4" />, placeholder: "Contact email" },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8">
          <FormSection title="Profile photo">
            <div className="aspect-square w-full overflow-hidden rounded-xs border border-border bg-muted">
              {avatar && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <ImageUploader onUpload={setAvatar} />
          </FormSection>

          <FormSection title="Resume / CV">
            <DocumentUploader onUpload={setResume} currentResumeUrl={resume} />
          </FormSection>

          <FormSection title="Social links">
            <div className="space-y-3">
              {socialRows.map((row) => (
                <label key={row.key} className="flex items-center gap-3">
                  <span className="text-muted-foreground" aria-hidden>
                    {row.icon}
                  </span>
                  <input
                    value={socials[row.key] || ""}
                    onChange={(e) => setSocials({ ...socials, [row.key]: e.target.value })}
                    placeholder={row.placeholder}
                    aria-label={row.placeholder}
                    className="h-9 flex-1 rounded-xs border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
              ))}
            </div>
          </FormSection>
        </div>

        <div className="space-y-8 lg:col-span-2">
          <FormSection title="Identity">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Full name"
                name="full_name"
                defaultValue={initialData.full_name}
                required
              />
              <TextField
                label="Job title"
                name="role_title"
                defaultValue={initialData.role_title}
                required
              />
              <TextField
                label="Years of experience"
                name="experience_years"
                type="number"
                defaultValue={initialData.experience_years}
              />
              <TextField
                label="Location"
                name="location"
                defaultValue={initialData.location || ""}
                placeholder="e.g. Addis Ababa, Ethiopia"
              />
              <div className="sm:col-span-2">
                <TextField
                  label="Timezone / working note"
                  name="timezone"
                  defaultValue={initialData.timezone || ""}
                  placeholder="e.g. GMT+3 — working globally"
                />
              </div>
            </div>
          </FormSection>

          <FormSection title="Hero bio" description="2–4 sentences. The first thing visitors read.">
            <TextAreaField
              label="Bio"
              name="bio"
              defaultValue={initialData.bio}
              rows={4}
              required
              placeholder="Hi — I'm Yabets, a frontend engineer who…"
            />
          </FormSection>

          <FormSection title="About — long story" description="3 paragraphs separated by blank lines.">
            <TextAreaField
              label="Story"
              name="about_story"
              defaultValue={initialData.about_story || ""}
              rows={8}
              placeholder={"Para 1…\n\nPara 2…\n\nPara 3…"}
            />
          </FormSection>

          <div className="grid gap-8 sm:grid-cols-2">
            <FormSection title="Currently learning">
              <TextField
                label="Tile text"
                name="currently_learning"
                defaultValue={initialData.currently_learning || ""}
                placeholder="e.g. Going deeper on backend & cloud."
              />
            </FormSection>

            <FormSection title="Philosophy / quote">
              <TextAreaField
                label="Quote"
                name="philosophy_quote"
                defaultValue={initialData.philosophy_quote || ""}
                rows={2}
                placeholder="Details aren't details. They make the design."
              />
              <TextField
                label="Author"
                name="philosophy_author"
                defaultValue={initialData.philosophy_author || ""}
                placeholder="Charles Eames"
              />
            </FormSection>
          </div>

          <FormSection title="Availability tags" description="Pills shown in the hero.">
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-xs border border-border bg-secondary px-2 py-1 label-mono"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    aria-label={`Remove tag ${t}`}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
                placeholder="Add a tag (e.g. Internship)"
                aria-label="New availability tag"
                className="h-9 flex-1 rounded-xs border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button type="button" onClick={addTag} variant="outline" size="sm">
                <Plus className="size-3.5" aria-hidden /> Add
              </Button>
            </div>
          </FormSection>

          <FormSection title="Skill categories">
            <SkillCategoryInput categories={skills} onChange={setSkills} />
          </FormSection>

          <FormFooter isSaving={isSaving} submitLabel="Save all changes" />
        </div>
      </div>
    </form>
  )
}
