"use client"

import { useState } from "react"
import { uploadProjectImage } from "@/lib/storage"
import { ImagePlus, X, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageUploaderProps {
  onUpload: (url: string) => void
}

export const ImageUploader = ({ onUpload }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false)
  // Changed from single string to array of previews
  const [previews, setPreviews] = useState<string[]>([])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get ALL selected files as an array
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    setIsUploading(true)

    // Show local previews immediately for ALL files (no waiting for upload)
    const localPreviews = files.map((file) => URL.createObjectURL(file))
    setPreviews(localPreviews)

    // Upload ALL files in parallel — much faster than sequential uploads!
    const uploadResults = await Promise.all(
      files.map((file) => uploadProjectImage(file))
    )

    // Filter out any uploads that failed (returned null)
    const successfulUrls = uploadResults.filter(Boolean) as string[]

    // Notify the parent form of each new image URL
    successfulUrls.forEach((url) => onUpload(url))

    setIsUploading(false)
  }

  const removePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      {/* Upload Button */}
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
        <input
          type="file"
          accept="image/*"
          multiple          // ← This is the key addition!
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm">Uploading {previews.length} image{previews.length !== 1 ? "s" : ""}...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImagePlus className="w-6 h-6" />
            <span className="text-sm font-medium">Click to upload images</span>
            <span className="text-xs opacity-60">You can select multiple files</span>
          </div>
        )}
      </label>

      {/* Preview Grid — shows all selected images */}
      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
              <Image src={src} alt={`Preview ${i + 1}`}
                fill
                className="object-cover" />
              <button
                type="button"
                onClick={() => removePreview(i)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
