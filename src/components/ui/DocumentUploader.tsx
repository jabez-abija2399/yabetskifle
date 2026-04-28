"use client"

import { useState } from "react"
import { uploadResumeDocument } from "@/lib/storage"
import { FileDown, Loader2, CheckCircle2 } from "lucide-react"

interface Props {
  onUpload: (url: string) => void
  currentResumeUrl?: string
}

export const DocumentUploader = ({ onUpload, currentResumeUrl }: Props) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(!!currentResumeUrl)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadSuccess(false)

    // Using the new helper we added to storage.ts
    const publicUrl = await uploadResumeDocument(file)

    if (publicUrl) {
      onUpload(publicUrl)
      setUploadSuccess(true)
    }

    setIsUploading(false)
  }

  return (
    <div className="space-y-3">
      <label className={`flex items-center justify-between w-full p-4 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors ${uploadSuccess ? 'border-primary/50 bg-primary/5' : 'border-border'}`}>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        
        <div className="flex items-center gap-4">
           {isUploading ? (
             <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
             </div>
           ) : uploadSuccess ? (
             <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <CheckCircle2 className="w-5 h-5" />
             </div>
           ) : (
             <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-zinc-500">
                <FileDown className="w-5 h-5" />
             </div>
           )}
           
           <div className="space-y-1">
              <p className="text-sm font-bold">Upload Resume / CV</p>
              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                 {isUploading ? "Uploading..." : uploadSuccess ? "PDF ATTACHED SECURELY" : "PDF, DOC, DOCX"}
              </p>
           </div>
        </div>

        <div className="px-4 py-2 text-xs font-bold rounded-lg border border-border bg-background shadow-sm">
           {isUploading ? "Please Wait" : uploadSuccess ? "Replace File" : "Select File"}
        </div>
      </label>

      {/* Helper to allow user to view the active document */}
      {currentResumeUrl && !isUploading && (
        <a 
          href={currentResumeUrl} 
          target="_blank" 
          rel="noreferrer"
          className="text-xs font-bold text-primary hover:underline px-1 flex items-center gap-1"
        >
          View currently active Resume ↗
        </a>
      )}
    </div>
  )
}
