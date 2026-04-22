
import { HeroWrapper } from "@/components/sections/HeroWrapper";
import { ProjectsWrapper } from "@/components/sections/ProjectsWrapper";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroWrapper />
      <ProjectsWrapper />
    </main>
  );
}
