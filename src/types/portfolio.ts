export interface Profile {
  id: string;
  full_name: string;
  role_title: string;
  bio: string;
  avatar_url?: string;
  social_links?: SocialLinks;
  skills?: SkillCategory[];
  resume_url?: string;
  experience_years?: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  purpose?: string;            // 👈 Matches your DB
  my_role?: string;           // 👈 Matches your DB
  project_type?: string;       // 👈 Matches your DB
  key_features: string[];      // 👈 Matches your DB (JSON/Array)
  what_i_learned: string[];    // 👈 Matches your DB (JSON/Array)
  images: string[];
  tags: string[];
  live_url?: string;
  github_url?: string;
  featured: boolean;           // 👈 Matches your DB
  order_index: number;
  created_at: string;
  is_published: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  features: string[];
  order_index: number;
  is_published: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  location: string;
  is_current: boolean;
  description: string[];
  order_index: number;
  is_published: boolean;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_role: string;
  client_avatar?: string;
  content: string;
  rating: number;
  created_at: string;
  is_published: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order_index: number;
  is_published: boolean;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
  is_published: boolean;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  published: boolean;
  tags: string[];
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  site_description: string;
  meta_keywords: string;
  favicon_url?: string;
  logo_url?: string;
  footer_text: string;
  contact_email: string;
  cv_url?: string;
  google_analytics_id?: string;
  show_services: boolean;
  show_projects: boolean;
  show_experience: boolean;
  show_testimonials: boolean;
  show_blog: boolean;
  show_faq: boolean;
  show_languages: boolean;
  show_contact: boolean;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  email?: string;
}

export interface SkillCategory {
  name: string;
  techs: string[];
}
