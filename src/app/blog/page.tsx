import { PortfolioService } from "@/services/portfolio"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react"

export const metadata: Metadata = {
  title: "Journal",
  description: "Technical insights, architectural decisions, and reflections on building software.",
}

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([
    PortfolioService.getPosts(),
    PortfolioService.getSettings()
  ])

  // 🛡️ SECURITY: Respect the master toggle
  if (settings?.show_blog === false) return notFound()

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-20">
        
        {/* 🎬 HEADER SECTION */}
        <div className="space-y-6 text-center md:text-left">
           <div className="flex items-center gap-3 text-primary justify-center md:justify-start">
              <span className="w-10 h-[2px] bg-primary"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Technical Journal</span>
           </div>
           <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none">
              Thoughts <span className="text-zinc-600">&</span> Insights.
           </h1>
           <p className="text-muted-foreground text-xl max-w-xl font-medium leading-relaxed italic">
              A collection of architectural decisions, technical guides, and reflections on modern software engineering.
           </p>
        </div>

        {/* 📑 POSTS LIST */}
        <div className="space-y-16">
          {posts.length === 0 ? (
            <div className="p-20 rounded-[3rem] border border-dashed border-border flex flex-col items-center justify-center text-center space-y-4 opacity-50 grayscale">
               <Calendar className="w-10 h-10" />
               <p className="text-sm font-black uppercase tracking-widest italic">The ink hasn't dried yet. Check back soon.</p>
            </div>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="group relative grid md:grid-cols-12 gap-10 items-center">
                
                {/* Image Preview (4/12) */}
                <div className="md:col-span-4 relative aspect-4/3 rounded-[2rem] overflow-hidden border border-border shadow-2xl transition-all group-hover:scale-[1.02]">
                   {post.cover_image ? (
                     <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
                   ) : (
                     <div className="w-full h-full bg-muted flex items-center justify-center font-black italic text-zinc-600">Journal</div>
                   )}
                </div>

                {/* Content Narrative (8/12) */}
                <div className="md:col-span-8 space-y-6">
                   <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> {post.created_at ? new Date(post.created_at).toLocaleDateString() : "Just Now"}
                      </span>
                      {post.tags?.[0] && (
                        <span className="flex items-center gap-2 text-primary">
                          <Tag className="w-3 h-3" /> {post.tags[0]}
                        </span>
                      )}
                   </div>

                   <Link href={`/blog/${post.slug}`} className="block group/title">
                      <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter leading-tight group-hover/title:text-primary transition-colors">
                        {post.title}
                      </h2>
                   </Link>

                   <p className="text-muted-foreground text-lg font-medium leading-relaxed italic line-clamp-3">
                      {post.excerpt || post.content.slice(0, 150) + "..."}
                   </p>

                   <Link 
                     href={`/blog/${post.slug}`} 
                     className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:gap-5 transition-all"
                   >
                      Read Full Article <ArrowRight className="w-4 h-4" />
                   </Link>
                </div>
              </article>
            ))
          )}
        </div>

      </div>
    </main>
  )
}
