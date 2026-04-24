import { createSupabaseClient } from "@/lib/supabase"
import { 
  Profile, Project, Experience, 
  Service, Testimonial, SiteSettings,
  FAQ, Language
} from "@/types/portfolio"

export const PortfolioService = {
  // 👤 1. Get Personal Profile
  async getProfile(): Promise<Profile | null> {
    const supabase = createSupabaseClient()
    const { data } = await supabase.from("profiles").select("*").single()
    return data as Profile
  },

  // 🚀 2. Get All Projects (Only Published)
  async getProjects(): Promise<Project[]> {
    const supabase = createSupabaseClient()
    const { data } = await supabase.from("projects")
      .select("*")
      .eq("is_published", true)
      .order("order_index", { ascending: true })
    return (data as Project[]) || []
  },

  // 🛠️ 3. Get All Services (Only Published)
  async getServices(): Promise<Service[]> {
    const supabase = createSupabaseClient()
    const { data } = await supabase.from("services")
      .select("*")
      .eq("is_published", true)
      .order("order_index", { ascending: true })
    return (data as Service[]) || []
  },

  // 💼 4. Get Work Experience (Only Published)
  async getExperience(): Promise<Experience[]> {
    const supabase = createSupabaseClient()
    const { data } = await supabase.from("experiences")
      .select("*")
      .eq("is_published", true)
      .order("order_index", { ascending: true })
    return (data as Experience[]) || []
  },

  // 🤝 5. Get Testimonials (Only Published)
  async getTestimonials(): Promise<Testimonial[]> {
    const supabase = createSupabaseClient()
    const { data } = await supabase.from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
    return (data as Testimonial[]) || []
  },

  // ❓ 6. Get FAQs (Only Published)
  async getFAQs(): Promise<FAQ[]> {
    const supabase = createSupabaseClient()
    const { data } = await supabase.from("faqs")
      .select("*")
      .eq("is_published", true)
      .order("order_index", { ascending: true })
    return (data as FAQ[]) || []
  },

  // 🌍 7. Get Languages (Only Published)
  async getLanguages(): Promise<Language[]> {
    const supabase = createSupabaseClient()
    const { data } = await supabase.from("languages")
      .select("*")
      .eq("is_published", true)
    return (data as Language[]) || []
  },

  // ⚙️ 8. Get Global Settings
  async getSettings(): Promise<SiteSettings | null> {
    const supabase = createSupabaseClient()
    const { data } = await supabase.from("site_settings").select("*").maybeSingle()
    return data as SiteSettings
  }
}
