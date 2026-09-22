import { PortfolioService } from "@/services/portfolio"
import { Metadata } from "next"

export const revalidate = 0
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Clock } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { ViewTracker } from "@/components/analytics/ViewTracker"
import { t, renderRichTitle } from "@/lib/copy"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await PortfolioService.getPostBySlug(slug)

  if (!post) return { title: "Article not found" }

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
  const [post, copy] = await Promise.all([
    PortfolioService.getPostBySlug(slug),
    PortfolioService.getSiteCopy().catch(() => ({})),
  ])
  if (!post) return notFound()

  const minRead = Math.max(1, Math.ceil(post.content.length / 1000))
  const date = post.created_at
    ? new Date(post.created_at).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null

  return (
    <article className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="px-6 md:px-12 lg:px-16 xl:px-24 pt-28 md:pt-32 pb-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between border-b border-border pb-4">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-[#2D5F6B] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>[ {t(copy, "blogpost.back_link", "All articles")} ]</span>
          </Link>
          <p className="eyebrow hidden md:block">{t(copy, "blogpost.kicker", "Journal entry")}</p>
        </div>
      </div>

      {/* Header — intentional architectural scale, mono metadata, no tracked uppercase */}
      <header className="px-6 md:px-12 lg:px-16 xl:px-24 pb-10 md:pb-14">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-muted-foreground">
            {date && <span>{date}</span>}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {minRead} {t(copy, "blogpost.read_time", "min read")}
            </span>
            <ViewTracker
              path={`/blog/${post.slug}`}
              showCount
              className="text-muted-foreground"
            />
          </div>

          <h1 className="text-heading-hero text-foreground">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty font-sans">
              {post.excerpt}
            </p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 font-mono text-[11px]">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-xs border border-border/60 bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Cover — crisp technical frame */}
      {post.cover_image && (
        <div className="px-6 md:px-12 lg:px-16 xl:px-24 mb-14 md:mb-20">
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-21/10 rounded-xs overflow-hidden border border-border bg-secondary corner-ticks">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="px-6 md:px-12 lg:px-16 xl:px-24 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none
            prose-headings:font-sans prose-headings:tracking-tight prose-headings:text-foreground
            prose-h1:hidden
            prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-5
            prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
            prose-p:leading-[1.75] prose-p:text-foreground/85 prose-p:text-pretty
            prose-strong:text-foreground prose-strong:font-medium
            prose-a:text-[#2D5F6B] dark:prose-a:text-[#3E7987] hover:prose-a:underline prose-a:no-underline
            prose-blockquote:border-l-[#2D5F6B] prose-blockquote:bg-card prose-blockquote:rounded-r-xs prose-blockquote:py-1 prose-blockquote:px-6
            prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-xs prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-card prose-pre:border prose-pre:border-border prose-pre:rounded-xs
            prose-img:rounded-xs prose-img:border prose-img:border-border
            prose-li:my-1
            ">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-6 md:px-12 lg:px-16 xl:px-24 pt-16 pb-32 border-t border-border">
        <div className="max-w-3xl mx-auto pt-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2">
              <p className="eyebrow">{t(copy, "blogpost.cta_eyebrow", "— Thanks for reading")}</p>
              <p className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                {renderRichTitle(t(copy, "blogpost.cta_title", "More in the journal."), "text-[#2D5F6B] dark:text-[#3E7987]")}
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-[#2D5F6B] text-white dark:bg-[#3E7987] dark:text-background h-11 px-5 rounded-xs font-mono text-xs font-medium hover:bg-[#234b54] transition-colors w-fit"
            >
              <span>[ {t(copy, "blogpost.back_link", "All articles")} ]</span> <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
