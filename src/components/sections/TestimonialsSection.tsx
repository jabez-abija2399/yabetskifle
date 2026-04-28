import { Testimonial } from "@/types/portfolio"
import { Star, Quote } from "lucide-react"
import Image from "next/image"

interface Props {
  testimonials: Testimonial[]
}

export const TestimonialsSection = ({ testimonials }: Props) => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto space-y-16">
      
      {/* Section Header */}
      <div className="text-center space-y-4">
         <h2 className="text-display italic">Professional Endorsements</h2>
         <p className="text-muted-foreground text-sm font-medium uppercase tracking-[0.2em]">Strategic feedback from global collaborations</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((review) => (
          <div key={review.id} className="p-10 rounded-[3rem] bg-card border border-border relative group hover:border-primary/40 transition-all">
             <Quote className="absolute top-8 right-10 w-12 h-12 text-primary/5 transition-colors group-hover:text-primary/20" />
             
             {/* Rating Stars */}
             <div className="flex gap-1 text-yellow-500 mb-6">
                {[...Array(review.rating || 5)].map((_, i) => (
                   <Star key={i} className="w-4 h-4 fill-current" />
                ))}
             </div>

             <p className="text-muted-foreground leading-relaxed italic mb-10 relative z-10">
                "{review.content}"
             </p>

             {/* Client Info */}
             <div className="flex items-center gap-4 border-t border-border pt-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border bg-muted">
                   {review.client_avatar ? (
                     <Image src={review.client_avatar} alt={review.client_name} fill className="object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center font-bold text-zinc-600">
                        {review.client_name.charAt(0)}
                     </div>
                   )}
                </div>
                <div>
                   <h4 className="font-bold text-sm tracking-tight">{review.client_name}</h4>
                   <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{review.client_role}</p>
                </div>
             </div>
          </div>
        ))}
      </div>
    </section>
  )
}
