import { Post } from "@/types/portfolio"
import Link from "next/link"
import { ArrowRight, Calendar, BookOpen } from "lucide-react"

interface Props {
  posts: Post[]
}

export const LatestPosts = ({ posts }: Props) => {
  if (!posts || posts.length === 0) return null

  // ✨ Take only the 3 most recent
  const displayPosts = posts.slice(0, 3)

  return (
    <section className="px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
           <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                 <BookOpen className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Latest Insights</span>
              </div>
              <h2 className="text-heading-section">
                 Professional <span className="text-zinc-600">Reflections.</span>
              </h2>
           </div>
           <Link href="/blog" className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-primary hover:gap-6 transition-all">
             View All Transmissions <ArrowRight className="w-5 h-5" />
           </Link>
        </div>

        {/* Cinematic List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {displayPosts.map((post) => (
             <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <div className="h-full p-10 rounded-[3.5rem] bg-card border border-border group-hover:border-primary/40 group-hover:bg-primary/5 transition-all flex flex-col justify-between space-y-10">
                   <div className="space-y-6">
                      <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                         <Calendar className="w-3 h-3" /> {post.created_at ? new Date(post.created_at).toLocaleDateString() : "Just Now"}
                      </div>
                      <h3 className="text-3xl font-bold italic tracking-tighter leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm font-medium italic line-clamp-3 leading-relaxed">
                        {post.excerpt || post.content.slice(0, 120) + "..."}
                      </p>
                   </div>
                   
                   <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex flex-wrap gap-2">
                         {post.tags.slice(0, 2).map(tag => (
                           <span key={tag} className="text-[8px] font-bold uppercase tracking-widest text-zinc-600 opacity-60">#{tag}</span>
                         ))}
                      </div>
                      <ArrowRight className="w-5 h-5 text-zinc-800 group-hover:translate-x-2 transition-transform" />
                   </div>
                </div>
             </Link>
           ))}
        </div>

      </div>
    </section>
  )
}
