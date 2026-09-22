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
    <section className="px-6 md:px-12 lg:px-16 xl:px-24 scroll-mt-24">
      <div className="max-w-[1600px] mx-auto">
        {/* Section header — Sentence case */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-border">
          <div className="space-y-2">
            <div className="font-mono text-xs text-[#2D5F6B] dark:text-[#3E7987]">
              {t(copy, "testimonials.eyebrow", "08. Verification & feedback")}
            </div>
            <h2 className="text-heading-section font-semibold tracking-tight text-foreground">
              {renderRichTitle(t(copy, "testimonials.title", "Collaborator & client appraisals"), "text-[#2D5F6B] dark:text-[#3E7987]")}
            </h2>
          </div>
          <p className="font-mono text-xs text-muted-foreground max-w-sm">
            {t(copy, "testimonials.subtitle", "Direct feedback on shipped code, collaboration, and delivery.")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((review, i) => (
            <figure
              key={review.id}
              className="border border-border bg-card p-6 rounded-xs corner-ticks flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border font-mono text-xs text-muted-foreground">
                  <span className="text-[#2D5F6B] dark:text-[#3E7987] font-medium">
                    [rev.{String(i + 1).padStart(2, "0")}]
                  </span>
                  <div className="flex gap-0.5 text-[#2D5F6B] dark:text-[#3E7987]">
                    {[...Array(review.rating || 5)].map((_, starIdx) => (
                      <Star key={starIdx} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>

                <blockquote className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed font-sans text-pretty">
                  &ldquo;{review.content}&rdquo;
                </blockquote>
              </div>

              <figcaption className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="relative w-9 h-9 rounded-xs overflow-hidden border border-border bg-secondary shrink-0">
                  {review.client_avatar ? (
                    <Image
                      src={review.client_avatar}
                      alt={review.client_name}
                      fill
                      className="object-cover grayscale"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-xs font-semibold text-foreground">
                      {review.client_name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{review.client_name}</p>
                  <p className="text-[11px] font-mono text-muted-foreground">{review.client_role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
