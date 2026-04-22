"use client"

import { Hero } from "@/components/sections/Hero";
import { usePortfolio } from "@/hooks/usePortfolio";

export default function Home() {
  const { heroData } = usePortfolio();
  return (
    <main className="min-h-screen">
      <Hero
      name={heroData.name}
      role={heroData.role}
      bio={heroData.bio}
      />
    </main>
  );
}
