import { useState } from "react";


interface HeroData {
    name: string;
    role: string;
    bio: string;
}


export const usePortfolio = () => {
    const [heroData, setHeroData] = useState<HeroData>({
    name: "Yabets Kifle",
    role: "Frontend Developer",
    bio: "I am a frontend developer with a passion for building beautiful and user-friendly web applications..."
  })

  const [isLoading, setIsLoading] = useState(false);

   const updateHero = (newData: HeroData) => {
    setHeroData(newData)
    console.log("Saving to database...", newData)
  }


  return { heroData, isLoading, updateHero }
}
