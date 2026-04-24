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
