import { Profile } from "@/types/portfolio"
import { Globe, MapPin, Sparkles } from "lucide-react"
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
    <section id="about" className="px-6 md:px-12 lg:px-16 xl:px-24 scroll-mt-32">
      <div className="max-w-[1600px] mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between gap-8 mb-12 md:mb-16 border-b border-border pb-8">
          <div className="space-y-3">
            <p className="eyebrow">{t(copy, "about.eyebrow", "— 01 / About")}</p>
            <h2 className="text-heading-section">
              {renderRichTitle(t(copy, "about.title", "A bit more *about me*"))}
            </h2>
          </div>
          <p className="hidden md:block text-sm text-muted-foreground max-w-xs text-pretty">
            {t(copy, "about.subtitle", "How I got here, what I care about, and how I like to work.")}
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-5 auto-rows-[minmax(180px,auto)]">
          {/* Story */}
          <article className="col-span-12 lg:col-span-8 row-span-2 bg-card border border-border rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col gap-6">
            <p className="eyebrow">{t(copy, "about.story_eyebrow", "— The longer story")}</p>

            <div className="space-y-5 text-base md:text-lg leading-relaxed text-foreground/90 text-pretty whitespace-pre-line">
              {story.map((para, i) => (
                <p key={i} className={i === story.length - 1 ? "text-foreground" : ""}>
                  {para}
                </p>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-4 mt-auto border-t border-border">
              <Sparkles className="w-4 h-4 text-signal" />
              <span className="eyebrow">{t(copy, "about.story_footer", "Open to learn · Open to teach · Open to ship")}</span>
            </div>
          </article>

          {/* Years */}
          <div className="col-span-6 lg:col-span-4 bg-card border border-border rounded-3xl p-7 flex flex-col justify-between">
            <p className="eyebrow">{t(copy, "about.experience_label", "Experience")}</p>
            <div>
              <p className="font-display text-6xl md:text-7xl leading-none">
                {profile.experience_years || 2}
                <span className="text-signal">+</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">{t(copy, "about.experience_unit", "years shipping production code")}</p>
            </div>
          </div>

          {/* Currently learning */}
          <div className="col-span-6 lg:col-span-4 bg-foreground text-background rounded-3xl p-7 flex flex-col justify-between">
            <p className="eyebrow opacity-60">{t(copy, "about.learning_label", "Currently learning")}</p>
            <p className="font-display text-2xl md:text-3xl leading-tight text-pretty">
              {learning}
            </p>
          </div>

          {/* Philosophy */}
          <div className="col-span-6 lg:col-span-4 bg-card border border-border rounded-3xl p-7 flex flex-col justify-between">
            <p className="eyebrow">{t(copy, "about.philosophy_label", "Philosophy")}</p>
            <p className="font-display text-xl md:text-2xl leading-snug italic text-pretty">
              &ldquo;{quote}&rdquo;
            </p>
            <p className="text-xs text-muted-foreground">— {author}</p>
          </div>

          {/* Location */}
          <div className="col-span-6 lg:col-span-4 bg-card border border-border rounded-3xl p-7 flex flex-col justify-between">
            <p className="eyebrow">{t(copy, "about.location_label", "Based in")}</p>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-signal" />
              <p className="font-display text-2xl md:text-3xl">{location.split(",")[0]}</p>
            </div>
            <p className="text-xs text-muted-foreground">{timezone}</p>
          </div>

          {/* Languages */}
          <div className="col-span-6 lg:col-span-4 bg-card border border-border rounded-3xl p-7 flex flex-col justify-between">
            <p className="eyebrow">{t(copy, "about.languages_label", "Speaks")}</p>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-signal" />
              <p className="font-display text-2xl md:text-3xl">{langShort}</p>
            </div>
            <p className="text-xs text-muted-foreground">{langLong}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
