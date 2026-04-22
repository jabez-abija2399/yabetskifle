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
  image_url: string;
  tags: string[];       
  live_url: string;
  github_url: string;
  order_index: number;  
}
