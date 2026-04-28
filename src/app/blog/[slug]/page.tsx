import { PortfolioService } from "@/services/portfolio"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Tag, Share2, Eye } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { ViewTracker } from "@/components/analytics/ViewTracker"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await PortfolioService.getPostBySlug(slug)
  
  if (!post) return { title: "Article Not Found" }

  return {
    title: post.title,
    description: post.excerpt || post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160),
      images: post.cover_image ? [{ url: post.cover_image }] : [],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await PortfolioService.getPostBySlug(slug)

  if (!post) return notFound()

  return (
    <article className="min-h-screen bg-background">
      
      {/* 🧭 NAVIGATION BREADCRUMB */}
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-3xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/blog"
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] hover:text-primary transition-all"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Journal
          </Link>
          <div className="text-[8px] font-black uppercase tracking-[0.4em] opacity-30 hidden md:block">
             ARCHITECTING KNOWLEDGE
          </div>
          <button className="p-3 hover:text-primary transition-all">
             <Share2 className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* 🎬 HERO COVER */}
      <div className="relative w-full aspect-21/9 bg-card overflow-hidden mt-20">
        {post.cover_image && (
          <Image src={post.cover_image} alt={post.title} fill priority className="object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="container mx-auto px-6 -mt-32 relative z-10 max-w-4xl pb-40">
        
        {/* 🖋️ ARTICLE HEADER */}
        <header className="space-y-8 mb-20 px-4 md:px-0">
           <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/5 border border-primary/10 w-fit px-8 py-3 rounded-full">
              <span className="flex items-center gap-2">
                 <Calendar className="w-4 h-4" /> {new Date(post.created_at).toLocaleDateString()}
              </span>
              <span className="w-1 h-1 rounded-full bg-primary/40"></span>
              <span className="flex items-center gap-2">
                 <Clock className="w-4 h-4" /> {Math.ceil(post.content.length / 1000)} MIN READ
              </span>
              <span className="w-1 h-1 rounded-full bg-primary/40"></span>
              <ViewTracker path={`/blog/${post.slug}`} showCount={true} className="text-zinc-500" />
           </div>

           <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none">
              {post.title}
           </h1>

           <div className="flex flex-wrap gap-3">
              {post.tags?.map((tag) => (
                <span key={tag} className="px-6 py-2 bg-muted text-zinc-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-border/50">
                   # {tag}
                </span>
              ))}
           </div>
        </header>

        {/* 📖 CONTENT BODY */}
        <div className="prose prose-zinc dark:prose-invert max-w-none px-4 md:px-0 text-lg md:text-xl leading-[1.8] text-zinc-300 font-medium whitespace-pre-wrap selection:bg-primary/30">
           <ReactMarkdown>
              {post.content}
           </ReactMarkdown>
        </div>

        {/* 🏁 ARTICLE FOOTER */}
        <footer className="mt-20 pt-20 border-t border-border flex flex-col items-center text-center space-y-8">
           <div className="w-16 h-px bg-zinc-800"></div>
           <p className="text-muted-foreground text-sm font-bold uppercase tracking-[0.3em]">End of Transmission</p>
           <Link 
             href="/blog" 
             className="px-10 py-5 rounded-2xl bg-muted font-black italic text-sm tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl"
           >
              Return to Journal Archive
           </Link>
        </footer>

      </div>
    </article>
  )
}
