import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

// Universal client for both Server and Browser
export const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}