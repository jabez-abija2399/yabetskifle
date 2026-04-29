import { createSupabaseClient } from "./supabase"

// This function handles the entire upload process
// It takes a file and returns the public URL
export const uploadProjectImage = async (file: File): Promise<string | null> => {
  const supabase = createSupabaseClient()

  // 1. Create a unique filename to avoid collisions (Added Math.random() for tight loops)
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  const fileName = `${Date.now()}-${randomSuffix}-${file.name.replace(/\s/g, "-")}`

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

// Dedicated function to handle Document (PDF) uploads
export const uploadResumeDocument = async (file: File): Promise<string | null> => {
  const supabase = createSupabaseClient()

  // Place it in a 'resumes' subfolder so it doesn't mix directly with images
  const fileName = `resumes/${Date.now()}-${file.name.replace(/\s/g, "-")}`

  const { data, error } = await supabase.storage
    .from("project-images") // Reusing the same publicly accessible bucket
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false
    })

  if (error) {
    console.error("Upload failed:", error.message)
    return null
  }

  const { data: urlData } = supabase.storage
    .from("project-images")
    .getPublicUrl(data.path)

  return urlData.publicUrl
}
