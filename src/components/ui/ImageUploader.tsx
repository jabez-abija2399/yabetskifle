"use client"

import { useState } from "react"
import { uploadProjectImage } from "@/lib/storage"
import { ImagePlus, X, Loader2 } from "lucide-react"

interface ImageUploaderProps {
  // Called by the parent (admin form) when an upload finishes
  onUpload: (url: string) => void
}

export const ImageUploader = ({ onUpload }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show a local preview immediately — no waiting!
    setPreview(URL.createObjectURL(file))
    setIsUploading(true)

    // Upload to Supabase and get the public URL back
    const publicUrl = await uploadProjectImage(file)

    if (publicUrl) {
      // Pass the URL up to the parent form
      onUpload(publicUrl)
    }
    setIsUploading(false)
  }

  return (
    <div className="space-y-3">
      {/* Upload Button */}
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImagePlus className="w-6 h-6" />
            <span className="text-sm">Click to upload image</span>
          </div>
        )}
      </label>

      {/* Preview */}
      {preview && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
