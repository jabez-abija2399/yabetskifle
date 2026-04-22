"use client"

import { usePortfolio } from "@/hooks/usePortfolio"
import { Hero } from "./Hero"

export const HeroWrapper = () => {
  const { heroData } = usePortfolio()

  return (
    <Hero 
      name={heroData.name} 
      role={heroData.role} 
      bio={heroData.bio} 
    />
  )
}
