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
  images: string[];       // ✅ Array of image URLs (was image_url: string)
  tags: string[];
  live_url: string;
  github_url: string;
  order_index: number;
  my_role: string;
  key_features: string;
  purpose: string;
  project_type: string;
  what_i_learned: string;
  featured: boolean; 
}

