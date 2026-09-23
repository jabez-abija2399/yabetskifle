import { PortfolioService } from "@/services/portfolio"
import { Metadata } from "next"

export const revalidate = 0
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import { t, renderRichTitle } from "@/lib/copy"

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes on engineering, design, and shipping software.",
}

export default async function BlogPage() {
  const [posts, settings, copy] = await Promise.all([
    PortfolioService.getPosts(),
    PortfolioService.getSettings(),
    PortfolioService.getSiteCopy().catch(() => ({})),
  ])

  if (settings?.show_blog === false) return notFound()

  return (
    <main className="min-h-screen bg-background px-6 md:px-12 lg:px-16 xl:px-24 py-24 md:py-32">
      <div className="max-w-5xl mx-auto">
        {/* Header — sentence case, mono index, no serif display */}
        <div className="flex items-end justify-between gap-8 mb-16 md:mb-20 border-b border-border pb-10">
          <div className="space-y-4 max-w-2xl">
            <p className="eyebrow">{t(copy, "blog.archive.eyebrow", "Journal")}</p>
            <h1 className="text-heading-hero text-foreground">
              {renderRichTitle(t(copy, "blog.archive.title", "Notes & writing"), "text-accent")}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground text-pretty pt-2">
              {t(copy, "blog.archive.subtitle", "Thoughts on building products, design systems, and the craft of frontend engineering.")}
            </p>
          </div>
          <p className="hidden md:block font-mono text-xs text-muted-foreground">
            [{String(posts.length).padStart(2, "0")} entries]
          </p>
        </div>

        {/* Posts list */}
        {posts.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-border rounded-xs font-mono text-xs text-muted-foreground">
            {t(copy, "blog.archive.empty", "New articles coming soon.")}
          </div>
        ) : (
          <div className="divide-y divide-border border-t border-border">
            {posts.map((post, i) => (
              <article key={post.id} className="group">
                <Link href={`/blog/${post.slug}`} className="grid md:grid-cols-12 gap-6 md:gap-10 items-start py-8 md:py-10">
                  <div className="md:col-span-1 font-mono text-xs text-accent">
                    [art.{String(i + 1).padStart(2, "0")}]
                  </div>

                  {/* Cover — crisp 1px technical frame, no zoom-on-hover */}
                  <div className="md:col-span-4 relative aspect-4/3 rounded-xs overflow-hidden border border-border bg-secondary corner-ticks">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover grayscale contrast-105 group-hover:grayscale-0 transition-all duration-300"
                        sizes="(max-width: 768px) 100vw, 320px"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center">
                        <span className="font-mono text-xs text-muted-foreground">
                          {`fig.${String(i + 1).padStart(2, "0")} // journal`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="md:col-span-7 space-y-3">
                    <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
                      <span>
                        {post.created_at
                          ? new Date(post.created_at).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Recent"}
                      </span>
                      {post.tags?.[0] && (
                        <span className="px-2 py-0.5 rounded-xs border border-border/60 bg-secondary text-secondary-foreground">
                          {post.tags[0]}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight leading-snug group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 text-pretty max-w-xl font-sans">
                      {post.excerpt || post.content.slice(0, 180) + "…"}
                    </p>

                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground pt-1 group-hover:text-accent transition-colors">
                      <span>[ read spec ]</span> <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
