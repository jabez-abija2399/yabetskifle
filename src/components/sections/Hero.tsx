import { Button } from "../ui/button";


interface HeroProps {
    name: string;
    role: string;
    bio: string;
}

export const Hero = ({name, role, bio}: HeroProps) => {
    return (
    <section className="flex flex-col items-center justify-center py-24 px-6 text-center space-y-8">
      {/* 2. Using a Gradient Text for that "Premium" feel */}
      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Hi, I&apos;m <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-teal-400">{name}</span>
        </h1>
        <h2 className="text-2xl md:text-3xl font-medium text-muted-foreground italic">
          {role}
        </h2>
      </div>
      {/* 3. Max-width on bio to keep it readable */}
      <p className="max-w-(--spacing-128) text-lg text-muted-foreground leading-relaxed">
        {bio}
      </p>
      {/* 4. Using our Shadcn Button */}
      <div className="flex gap-4">
        <Button size="lg" className="rounded-full px-8">
          View Projects
        </Button>
        <Button size="lg" variant="outline" className="rounded-full px-8">
          Contact Me
        </Button>
      </div>
    </section>
  )
}