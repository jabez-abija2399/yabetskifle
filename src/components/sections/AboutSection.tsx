import { Profile } from "@/types/portfolio"
import { Globe, MapPin, Compass, BookOpen, Quote } from "lucide-react"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"

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
    <section id="about" className="px-6 md:px-12 lg:px-16 xl:px-24 scroll-mt-24">
      <div className="max-w-[1600px] mx-auto">
        {/* Section header — Sentence case */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-border">
          <div className="space-y-2">
            <div className="font-mono text-xs text-accent">
              {t(copy, "about.eyebrow", "03. Engineering background")}
            </div>
            <h2 className="text-heading-section font-semibold tracking-tight text-foreground">
              {renderRichTitle(t(copy, "about.title", "Operating principles & technical narrative"), "text-accent")}
            </h2>
          </div>
          <p className="font-mono text-xs text-muted-foreground max-w-sm">
            {t(copy, "about.subtitle", "How I approach architecture, code craftsmanship, and team collaboration.")}
          </p>
        </div>

        {/* Structured Field-Notebook Grid */}
        <div className="grid grid-cols-12 gap-5">
          {/* Main Narrative Log */}
          <article className="col-span-12 lg:col-span-8 bg-card border border-border rounded-xs p-6 md:p-8 corner-ticks flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3 font-mono text-xs text-muted-foreground">
                <span className="flex items-center gap-2 text-foreground font-medium">
                  <BookOpen className="w-3.5 h-3.5 text-accent" />
                  <span>{t(copy, "about.story_eyebrow", "Field note // Narrative")}</span>
                </span>
                <span>doc.bio</span>
              </div>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-foreground/90 font-sans">
                {story.map((para, i) => (
                  <p key={i} className="text-pretty">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-muted-foreground">
              <span className="text-accent font-medium">
                [ {t(copy, "about.story_footer", "Open to learn · Open to teach · Open to ship")} ]
              </span>
              <span>verified</span>
            </div>
          </article>

          {/* Right Rail Field Blocks */}
          <div className="col-span-12 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
            {/* Experience metric */}
            <div className="border border-border bg-card p-5 rounded-xs corner-ticks flex flex-col justify-between">
              <div className="flex items-center justify-between font-mono text-xs text-muted-foreground border-b border-border pb-2.5 mb-3">
                <span>{t(copy, "about.experience_label", "Experience log")}</span>
                <span>spec.01</span>
              </div>
              <div>
                <p className="font-mono text-4xl sm:text-5xl font-semibold text-foreground">
                  {profile.experience_years || 2}
                  <span className="text-accent">+</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1.5 font-mono">
                  {t(copy, "about.experience_unit", "years shipping production web applications")}
                </p>
              </div>
            </div>

            {/* Currently learning */}
            <div className="border border-accent/30 bg-card p-5 rounded-xs corner-ticks flex flex-col justify-between">
              <div className="flex items-center justify-between font-mono text-xs text-accent border-b border-border pb-2.5 mb-3">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{t(copy, "about.learning_label", "Active focus & research")}</span>
                </span>
                <span>spec.02</span>
              </div>
              <p className="text-sm font-medium text-foreground leading-snug">
                {learning}
              </p>
            </div>

            {/* Philosophy */}
            <div className="border border-border bg-card p-5 rounded-xs corner-ticks flex flex-col justify-between">
              <div className="flex items-center justify-between font-mono text-xs text-muted-foreground border-b border-border pb-2.5 mb-3">
                <span className="flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5 text-accent" />
                  <span>{t(copy, "about.philosophy_label", "Operating principle")}</span>
                </span>
                <span>spec.03</span>
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
                &ldquo;{quote}&rdquo;
              </p>
              <p className="text-[11px] font-mono text-muted-foreground mt-2">— {author}</p>
            </div>

            {/* Location & Languages composite */}
            <div className="border border-border bg-card p-5 rounded-xs corner-ticks space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-border font-mono text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 text-foreground">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  <span>Base</span>
                </span>
                <span>{location.split(",")[0]}</span>
              </div>
              <div className="flex justify-between items-center font-mono text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 text-foreground">
                  <Globe className="w-3.5 h-3.5 text-accent" />
                  <span>Languages</span>
                </span>
                <span>{langShort} ({langLong})</span>
              </div>
              <div className="pt-2 border-t border-border/60 text-[11px] font-mono text-muted-foreground">
                <span>{timezone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
