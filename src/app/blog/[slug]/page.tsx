import { PortfolioService } from "@/services/portfolio"
import { Metadata } from "next"
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
      <div className="px-6 md:px-12 pt-28 md:pt-32 pb-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            {t(copy, "blogpost.back_link", "All articles")}
          </Link>
          <p className="eyebrow hidden md:block">{t(copy, "blogpost.kicker", "Journal entry")}</p>
        </div>
      </div>

      {/* Header */}
      <header className="px-6 md:px-12 pb-10 md:pb-14">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {date && (
              <span className="font-mono uppercase tracking-wider text-muted-foreground">
                {date}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {minRead} {t(copy, "blogpost.read_time", "min read")}
            </span>
            <ViewTracker
              path={`/blog/${post.slug}`}
              showCount
              className="text-muted-foreground"
            />
          </div>

          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              {post.excerpt}
            </p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Cover */}
      {post.cover_image && (
        <div className="px-6 md:px-12 mb-14 md:mb-20">
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-21/10 rounded-3xl overflow-hidden border border-border bg-secondary">
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
      <div className="px-6 md:px-12 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none
            prose-headings:font-display prose-headings:tracking-tight
            prose-h1:hidden
            prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-5
            prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
            prose-p:leading-[1.75] prose-p:text-foreground/85 prose-p:text-pretty
            prose-strong:text-foreground prose-strong:font-medium
            prose-a:text-signal hover:prose-a:underline prose-a:no-underline
            prose-blockquote:border-l-signal prose-blockquote:bg-card prose-blockquote:rounded-r-2xl prose-blockquote:py-1 prose-blockquote:px-6
            prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-card prose-pre:border prose-pre:border-border prose-pre:rounded-2xl
            prose-img:rounded-2xl prose-img:border prose-img:border-border
            prose-li:my-1
            ">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-6 md:px-12 pt-16 pb-32 border-t border-border">
        <div className="max-w-3xl mx-auto pt-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2">
              <p className="eyebrow">{t(copy, "blogpost.cta_eyebrow", "— Thanks for reading")}</p>
              <p className="font-display text-3xl md:text-4xl leading-tight">
                {renderRichTitle(t(copy, "blogpost.cta_title", "More *in the journal*."))}
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-foreground text-background h-12 px-6 rounded-full text-sm font-medium hover:bg-signal hover:text-signal-foreground transition-colors w-fit"
            >
              {t(copy, "blogpost.back_link", "All articles")} <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
