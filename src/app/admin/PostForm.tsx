"use client"

import { useState } from "react"
import { Post } from "@/types/portfolio"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { TextField, TextAreaField, SwitchRow, FormFooter, FormSection } from "@/components/admin/fields"
import { ImageOff } from "lucide-react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })

interface Props {
  initialData?: Post
  onSave: (data: Omit<Post, "id" | "created_at">) => Promise<void>
  isSaving: boolean
  onCancel: () => void
}

export const PostForm = ({ initialData, onSave, isSaving, onCancel }: Props) => {
  const [coverImage, setCoverImage] = useState(initialData?.cover_image || "")
  const [content, setContent] = useState(initialData?.content || "")
  const { theme, systemTheme } = useTheme()
  const currentTheme = theme === "system" ? systemTheme : theme

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const title = formData.get("title") as string
    const slug =
      (formData.get("slug") as string) ||
      title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")

    await onSave({
      title,
      slug,
      content,
      excerpt: formData.get("excerpt") as string,
      cover_image: coverImage,
      published: formData.get("published") === "on",
      tags: (formData.get("tags") as string)
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== ""),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <TextField
            label="Post title"
            name="title"
            defaultValue={initialData?.title}
            placeholder="The future of web development…"
            required
          />

          <div className="space-y-2">
            <span className="label-mono text-muted-foreground">
              Content (markdown supported)
            </span>
            <div
              data-color-mode={currentTheme}
              className="overflow-hidden rounded-xs border border-border"
            >
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || "")}
                height={600}
                preview="live"
              />
            </div>
            <input type="hidden" name="content" value={content} />
          </div>
        </div>

        <div className="space-y-6">
          <FormSection title="Metadata">
            <TextField
              label="Slug (URL)"
              name="slug"
              defaultValue={initialData?.slug}
              placeholder="my-awesome-post"
            />
            <TextField
              label="Tags (comma separated)"
              name="tags"
              defaultValue={initialData?.tags?.join(", ")}
              placeholder="react, design, thoughts"
            />
            <SwitchRow
              name="published"
              label="Publish instantly"
              description="Off keeps it as a private draft."
              defaultChecked={initialData?.published}
            />
          </FormSection>

          <FormSection title="Cover image">
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-xs border border-border bg-muted">
              {coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImageOff className="size-5 text-muted-foreground" aria-hidden />
              )}
            </div>
            <ImageUploader onUpload={setCoverImage} />
          </FormSection>

          <FormSection title="Excerpt">
            <TextAreaField
              label="Short excerpt"
              name="excerpt"
              defaultValue={initialData?.excerpt}
              rows={4}
              placeholder="Short preview text for the blog list…"
            />
          </FormSection>
        </div>
      </div>

      <FormFooter
        onCancel={onCancel}
        isSaving={isSaving}
        submitLabel={initialData ? "Update post" : "Publish story"}
      />
    </form>
  )
}
