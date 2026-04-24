// Every piece of data in your portfolio has a strict shape.
// TypeScript will warn you if you break the contract!

export interface HeroData {
  name: string;
  role: string;
  bio: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];       
  tags: string[];
  live_url: string;
  github_url: string;
  order_index: number;
  my_role: string;
  key_features: string[];
  purpose: string;
  project_type: string;
  what_i_learned: string[];
  featured: boolean; 
}


export interface SkillCategory {
  name: string;      // e.g., "Frontend"
  techs: string[];   // e.g., ["React", "Next.js"]
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  role_title: string;
  bio: string;
  avatar_url: string;
  experience_years: number;
  skills: SkillCategory[]; // Using the sub-interface we just made
  social_links: SocialLinks; // Using the sub-interface we just made
}

// Add these to src/types/portfolio.ts

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  duration: string;
  description: string[]; // List of bullet points
  is_current: boolean;
  order_index: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string; 
  features: string[];
  order_index: number;
}

export interface Message {
  id: string;
  created_at: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
}


export interface Testimonial {
  id: string;
  client_name: string;
  client_role: string;
  client_avatar?: string;
  content: string;
  rating: number;
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
}
