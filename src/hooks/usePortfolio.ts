import { createSupabaseClient } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { toast } from "sonner";


interface HeroData {
  name: string;
  role: string;
  bio: string;
}

const supabase = createSupabaseClient();

export const usePortfolio = () => {
  const [heroData, setHeroData] = useState<HeroData>({
    name: "Loading...",
    role: "Loading...",
    bio: "Loading..."
  })

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSetting = async () => {
      const {data} = await supabase
      .from('portfolio_settings')
      .select('*')
      .limit(1)
      .single();

      if (data) {
        setHeroData({
          name: data.name,
          role: data.role,
          bio: data.bio
        });
      }

      setIsLoading(false);
    }

    fetchSetting();
  }, [])

  const updateHero = async (newData: HeroData) => {
    setIsLoading(true);

    const {error} = await supabase
    .from('portfolio_settings')
    .update(newData)
    .eq('name', heroData.name)

    if (error) {
       toast.error("Failed to save" + error.message);
    }else {
      setHeroData(newData);
      toast.success("Saved successfully");
    }
    setIsLoading(false);
  }


  return { heroData, isLoading, updateHero }
}
