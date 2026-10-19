import { Testimonial } from "@/types/portfolio"
import { Star, Quote } from "lucide-react"
import Image from "next/image"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"
import { SectionHeader } from "@/components/ui/SectionHeader"

interface Props {
  testimonials: Testimonial[]
  copy?: SiteCopy
}

export const TestimonialsSection = ({ testimonials, copy }: Props) => {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <section id="testimonials" className="mx-auto max-w-6xl scroll-mt-28 px-6 md:px-10">
      <SectionHeader
        eyebrow={t(copy, "testimonials.eyebrow", "Kind words")}
        title={renderRichTitle(t(copy, "testimonials.title", "What people say about *working together*"), "text-accent")}
        subtitle={t(copy, "testimonials.subtitle", "Feedback from collaborators and clients on shipped work.")}
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((review) => (
          <figure key={review.id} className="lift-card flex flex-col justify-between gap-8 rounded-3xl border border-border bg-card p-7">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <Quote className="h-7 w-7 text-accent" />
                {typeof review.rating === "number" && review.rating > 0 && (
                  <div className="flex gap-0.5 text-accent" role="img" aria-label={`${review.rating} out of 5 stars`}>
                    {[...Array(Math.min(5, Math.max(0, Math.round(review.rating))))].map((_, starIdx) => (
                      <Star key={starIdx} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                )}
              </div>
              <blockquote className="text-base leading-relaxed text-foreground/90 text-pretty">
                &ldquo;{review.content}&rdquo;
              </blockquote>
            </div>

            <figcaption className="flex items-center gap-3 border-t border-border pt-5">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-border bg-secondary">
                {review.client_avatar ? (
                  <Image src={review.client_avatar} alt={review.client_name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-foreground">
                    {(review.client_name || "?").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{review.client_name}</p>
                <p className="text-xs text-muted-foreground">{review.client_role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
