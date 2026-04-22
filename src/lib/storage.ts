import { createSupabaseClient } from "./supabase"

// This function handles the entire upload process
// It takes a file and returns the public URL
export const uploadProjectImage = async (file: File): Promise<string | null> => {
  const supabase = createSupabaseClient()

  // 1. Create a unique filename to avoid collisions
  // e.g. "project-images/1714000000000-screenshot.png"
  const fileName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`

  // 2. Upload the file to our bucket
  const { data, error } = await supabase.storage
    .from("project-images")   // The bucket name we created
    .upload(fileName, file, {
      cacheControl: "3600",   // Browser caches for 1 hour (faster loads)
      upsert: false           // Don't overwrite existing files
    })

  if (error) {
    console.error("Upload failed:", error.message)
    return null
  }

  // 3. Get the permanent public URL for the uploaded file
  const { data: urlData } = supabase.storage
    .from("project-images")
    .getPublicUrl(data.path)

  // 4. Return the URL to be saved in the database
  return urlData.publicUrl
}
