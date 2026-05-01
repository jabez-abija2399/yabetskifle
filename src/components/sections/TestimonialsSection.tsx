import { Testimonial } from "@/types/portfolio"
import { Star } from "lucide-react"
import Image from "next/image"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"

interface Props {
  testimonials: Testimonial[]
  copy?: SiteCopy
}

export const TestimonialsSection = ({ testimonials, copy }: Props) => {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <section className="px-6 md:px-12 scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between gap-8 mb-12 md:mb-16 border-b border-border pb-8">
          <div className="space-y-3">
            <p className="eyebrow">{t(copy, "testimonials.eyebrow", "— 08 / Testimonials")}</p>
            <h2 className="text-heading-section">
              {renderRichTitle(t(copy, "testimonials.title", "Kind *words*"))}
            </h2>
          </div>
          <p className="hidden md:block text-sm text-muted-foreground max-w-xs text-pretty">
            {t(copy, "testimonials.subtitle", "What clients and collaborators have said after working with me.")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {testimonials.map((review) => (
            <figure
              key={review.id}
              className="group bg-card border border-border rounded-3xl p-7 md:p-8 flex flex-col gap-6 hover:border-foreground/30 transition-colors"
            >
              <div className="flex gap-0.5 text-signal">
                {[...Array(review.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              <blockquote className="font-display text-xl md:text-2xl leading-snug text-foreground flex-1 text-pretty">
                &ldquo;{review.content}&rdquo;
              </blockquote>

              <figcaption className="flex items-center gap-3 pt-5 border-t border-border">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border bg-secondary shrink-0">
                  {review.client_avatar ? (
                    <Image
                      src={review.client_avatar}
                      alt={review.client_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-medium">
                      {review.client_name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{review.client_name}</p>
                  <p className="text-xs text-muted-foreground">{review.client_role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
