import { createClient } from "@supabase/supabase-js"
import {
  Profile, Project, Experience,
  Service, Testimonial, SiteSettings,
  FAQ, Language, Message,
  Post, Education, Certification
} from "@/types/portfolio"

export interface DbSkillCategory {
  id?: string
  category_name: string
  technologies: string[]
  order_index?: number
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const ensureArray = (val: unknown): string[] => {
  if (!val) return []
  if (Array.isArray(val)) return val
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val)
      return Array.isArray(parsed) ? parsed : [val]
    } catch {
      return val.startsWith('[') ? [] : [val]
    }
  }
  return []
}

const transformProject = (p: Record<string, unknown>): Project => ({
  ...(p as unknown as Project),
  tags: ensureArray(p.tags),
  images: ensureArray(p.images),
  key_features: ensureArray(p.key_features),
  what_i_learned: ensureArray(p.what_i_learned),
})


export const PortfolioService = {
  

  async getProjects(): Promise<Project[]> {
    const { data } = await supabase.from("projects").select("*").eq("is_published", true).order("order_index", { ascending: true })
    return (data || []).map(transformProject)
  },

  async getAllProjects(): Promise<Project[]> {
    const { data } = await supabase.from("projects").select("*").order("order_index", { ascending: true })
    return (data || []).map(transformProject)
  },

  async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .eq("is_published", true)
      .maybeSingle()
    if (error) console.error("❌ DB Read Error:", error)
    return data ? transformProject(data) : null
  },

  async getProfile(): Promise<Profile | null> {
    const { data } = await supabase.from("profiles").select("*").single()
    return data as Profile
  },

  async getSettings(): Promise<SiteSettings | null> {
    const { data } = await supabase.from("site_settings").select("*").maybeSingle()
    return data as SiteSettings
  },

  async getServices(): Promise<Service[]> {
    const { data } = await supabase.from("services").select("*").eq("is_published", true).order("order_index", { ascending: true })
    return (data || []).map(s => ({ ...s, features: ensureArray(s.features) }))
  },

  async getExperience(): Promise<Experience[]> {
    const { data } = await supabase.from("experiences").select("*").eq("is_published", true).order("order_index", { ascending: true })
    return (data || []).map(e => ({ ...e, description: ensureArray(e.description) }))
  },

  async getTestimonials(): Promise<Testimonial[]> {
    const { data } = await supabase.from("testimonials").select("*").eq("is_published", true)
    return (data as Testimonial[]) || []
  },

  async getFAQs(): Promise<FAQ[]> {
    const { data } = await supabase.from("faqs").select("*").eq("is_published", true).order("order_index", { ascending: true })
    return (data as FAQ[]) || []
  },

  async getLanguages(): Promise<Language[]> {
    const { data } = await supabase.from("languages").select("*").eq("is_published", true)
    return (data as Language[]) || []
  },

  async getEducation(): Promise<Education[]> {
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("order_index", { ascending: true })
      .order("institution", { ascending: true })
    if (error) console.error("❌ Education Read Error:", error)
    return (data as Education[]) || []
  },

  async getCertifications(): Promise<Certification[]> {
    const { data } = await supabase.from("certifications").select("*").order("issued_at", { ascending: false })
    return (data as Certification[]) || []
  },

  async getSiteCopy(): Promise<Record<string, string>> {
    const { data } = await supabase.from("site_copy").select("key,value")
    // Preserve empty strings as intentional. Only NULL is treated as "missing".
    return Object.fromEntries(
      (data || [])
        .filter((r: { key: string; value: string | null }) => r.value !== null)
        .map((r: { key: string; value: string | null }) => [r.key, r.value as string])
    )
  },

  async getSiteCopyRows(): Promise<Array<{ key: string; value: string; description?: string; group_name?: string; sort_order?: number }>> {
    const { data } = await supabase.from("site_copy").select("*").order("group_name").order("sort_order")
    return data || []
  },

  async updateSiteCopy(updates: Array<{ key: string; value: string }>): Promise<void> {
    if (updates.length === 0) return
    const { error } = await supabase.from("site_copy").upsert(
      updates.map(u => ({ ...u, updated_at: new Date().toISOString() })),
      { onConflict: "key" }
    )
    if (error) throw error
  },

  // 📝 --- KNOWLEDGE ENGINE (BLOG) ---

  /** 📚 List all published articles */
  async getPosts(): Promise<Post[]> {
    const { data } = await supabase.from("posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
    return (data || []).map(p => ({ ...p, tags: ensureArray(p.tags) }))
  },

  /** 📖 Get a specific article by Slug */
  async getPostBySlug(slug: string): Promise<Post | null> {
    const { data } = await supabase.from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
    return data ? { ...data, tags: ensureArray(data.tags) } : null
  },

  /** 📂 Update or Create a Project */
  async saveProject(project: Partial<Project>): Promise<{ data: Project[] | null, error: { message: string } | null }> {
    const { data, error } = await supabase
      .from("projects")
      .upsert({
        ...project,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select()
    return { data: (data as Project[]) || null, error }
  },

  /** 👤 Update Identity & Socials */
  async updateProfile(profile: Partial<Profile>): Promise<void> {
    const { error } = await supabase.from("profiles").update(profile).eq("id", profile.id)
    if (error) throw error
  },

  /** ⚙️ Update Global Site Configuration */
  async updateSettings(settings: Partial<SiteSettings>): Promise<void> {
    const { error } = await supabase.from("site_settings").upsert(settings)
    if (error) throw error
  },

  /** 🛠️ Save or Update a Service Offering */
  async saveService(service: Partial<Service>): Promise<void> {
    const { error } = await supabase.from("services").upsert(service, { onConflict: 'id' })
    if (error) throw error
  },

  /** 🗑️ Remove a Service Expertise */
  async deleteService(id: string): Promise<void> {
    const { error } = await supabase.from("services").delete().eq("id", id)
    if (error) throw error
  },

  /** 📝 Save or Update a Journal Article */
  async savePost(post: Partial<Post>): Promise<void> {
    const { error } = await supabase.from("posts").upsert(post, { onConflict: 'id' })
    if (error) throw error
  },

  /** 🗑️ Delete a Journal Article */
  async deletePost(id: string): Promise<void> {
    const { error } = await supabase.from("posts").delete().eq("id", id)
    if (error) throw error
  },

  // 🛠️ --- TECHNICAL ECOSYSTEM (SKILLS) ---

  /** 🧩 Fetch all skill categories */
  async getSkills(): Promise<DbSkillCategory[]> {
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("order_index", { ascending: true })
    return ((data || []) as DbSkillCategory[]).map(s => ({ ...s, technologies: ensureArray(s.technologies) }))
  },

  /** 💾 Save or Update a Skill Category */
  async saveSkill(skill: Partial<DbSkillCategory> & { id?: string }): Promise<void> {
    const { error } = await supabase
      .from("skills")
      .upsert({
        ...skill,
        technologies: ensureArray(skill.technologies)
      }, { onConflict: 'id' })
    if (error) throw error
  },

  /** 🗑️ Remove a Skill Category */
  async deleteSkill(id: string): Promise<void> {
    const { error } = await supabase.from("skills").delete().eq("id", id)
    if (error) throw error
  },

  /** 👁️ Atomically Increment Global Page Views */
  async incrementPageView(path: string): Promise<void> {
    const { error } = await supabase.rpc('increment_page_view', { page_path: path })
    if (error) console.error("Analytics failed:", error)
  },

  /** 📊 Fetch Global Page Views */
  async getPageView(path: string): Promise<number> {
    const { data, error } = await supabase.from('page_views').select('view_count').eq('path', path).single()
    if (error && error.code !== 'PGRST116') console.error("Analytics fetch failed:", error)
    return data?.view_count || 1
  },

  /** 📨 Submit Contact Form Data */
  async submitMessage(message: Omit<Message, "id" | "created_at">): Promise<void> {
    const { error } = await supabase.from("messages").insert([message])
    if (error) {
      console.error("❌ Backend Submission Error:", error)
      throw new Error("Could not send message. Please try again.")
    }
  },
}
