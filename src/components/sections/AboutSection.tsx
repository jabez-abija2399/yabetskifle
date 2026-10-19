import { Profile } from "@/types/portfolio"
import { Globe, MapPin, Compass, Quote } from "lucide-react"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"
import { SectionHeader } from "@/components/ui/SectionHeader"

interface Props {
  profile: Profile
  languagesLine?: { short: string; long: string }
  copy?: SiteCopy
}

const FALLBACK_STORY = `I started writing code because I wanted to build the kinds of products I admired — fast, clear, and quietly delightful to use. That curiosity grew into two years of shipping real software with small teams, mostly on the frontend, often end-to-end.

Today I'm most at home in React, Next.js, and TypeScript. I love the moment a Figma frame becomes a real, interactive thing on screen — and I care a lot about making interfaces feel calm rather than busy. My backend practice is still growing: I'm comfortable with Supabase and full-stack Next.js, and I treat "I don't know that yet" as an invitation, not a problem.

If a project needs me to pick up a new tool, framework, or domain — I'll go find it. Flexible, curious, and ready to ship.`

export const AboutSection = ({ profile, languagesLine, copy }: Props) => {
  const story = (profile.about_story || FALLBACK_STORY).split(/\n\n+/).filter(Boolean)
  const learning = profile.currently_learning || "Going deeper on backend & cloud — always picking up the next tool."
  const quote = profile.philosophy_quote || "Details aren't details. They make the design."
  const author = profile.philosophy_author || "Charles Eames"
  const location = profile.location || "Addis Ababa"
  const timezone = profile.timezone || "Working globally · GMT+3"
  const langShort = languagesLine?.short || "EN · AM"
  const langLong = languagesLine?.long || "English · Amharic"

  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-28 px-6 md:px-10">
      <SectionHeader
        eyebrow={t(copy, "about.eyebrow", "About")}
        title={renderRichTitle(t(copy, "about.title", "Engineering with *care*, end to end"), "text-accent")}
        subtitle={t(copy, "about.subtitle", "How I approach architecture, craft, and working with people.")}
      />

      <div className="grid gap-5 lg:grid-cols-12">
        {/* Story */}
        <article className="rounded-3xl border border-border bg-card p-7 md:p-10 lg:col-span-7">
          <p className="mb-6 text-sm font-medium text-accent">{t(copy, "about.story_eyebrow", "My story")}</p>
          <div className="space-y-5 text-lg leading-relaxed text-foreground/90 text-pretty md:text-xl">
            {story.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <p className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
            {t(copy, "about.story_footer", "Open to learn · Open to teach · Open to ship")}
          </p>
        </article>

        {/* Facts */}
        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-7">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-aurora opacity-70" />
            <div className="relative">
              <p className="text-sm text-muted-foreground">{t(copy, "about.experience_label", "Experience")}</p>
              <p className="mt-2 text-6xl font-semibold tracking-tight text-foreground">
                {profile.experience_years || 2}
                <span className="text-accent">+</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(copy, "about.experience_unit", "years shipping production web applications")}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-7">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Compass className="h-4 w-4 text-accent" /> {t(copy, "about.learning_label", "Currently exploring")}
            </p>
            <p className="mt-3 text-lg font-medium leading-snug text-foreground">{learning}</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-7">
            <Quote className="h-6 w-6 text-accent" />
            <p className="mt-4 text-lg leading-relaxed text-foreground text-pretty">&ldquo;{quote}&rdquo;</p>
            <p className="mt-4 text-sm text-muted-foreground">— {author}</p>
          </div>

          <div className="space-y-4 rounded-3xl border border-border bg-card p-7 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 text-accent" /> Based in</span>
              <span className="font-medium text-foreground">{location.split(",")[0]}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-muted-foreground"><Globe className="h-4 w-4 text-accent" /> Languages</span>
              <span className="text-right font-medium text-foreground">{langShort} <span className="text-muted-foreground">({langLong})</span></span>
            </div>
            <p className="border-t border-border pt-4 text-muted-foreground">{timezone}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
