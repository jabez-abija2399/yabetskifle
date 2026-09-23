import { Post } from "@/types/portfolio"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"

interface Props {
  posts: Post[]
  copy?: SiteCopy
}

export const LatestPosts = ({ posts, copy }: Props) => {
  if (!posts || posts.length === 0) return null
  const displayPosts = posts.slice(0, 3)

  return (
    <section className="px-6 md:px-12 lg:px-16 xl:px-24 scroll-mt-24">
      <div className="max-w-[1600px] mx-auto">
        {/* Section header — Sentence case */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-border">
          <div className="space-y-2">
            <div className="font-mono text-xs text-accent">
              {t(copy, "blog.home.eyebrow", "07. Journal & notes")}
            </div>
            <h2 className="text-heading-section font-semibold tracking-tight text-foreground">
              {renderRichTitle(t(copy, "blog.home.title", "Technical writing & architectural notes"), "text-accent")}
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            <span>[ {t(copy, "blog.home.archive_link", "Complete journal index")} ]</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Structured Schematic Journal List */}
        <div className="divide-y divide-border border-y border-border">
          {displayPosts.map((post, i) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group grid grid-cols-12 gap-4 md:gap-8 py-6 md:py-8 hover:bg-card/60 transition-colors"
            >
              <div className="col-span-12 md:col-span-1">
                <span className="font-mono text-xs text-accent font-medium">
                  [art.{String(i + 1).padStart(2, "0")}]
                </span>
              </div>

              <div className="col-span-12 md:col-span-2">
                <p className="font-mono text-xs text-muted-foreground">
                  {post.created_at
                    ? new Date(post.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : "Recent"}
                </p>
              </div>

              <div className="col-span-12 md:col-span-7 space-y-2">
                <h3 className="text-lg md:text-xl font-semibold text-foreground tracking-tight group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 max-w-xl text-pretty font-sans">
                  {post.excerpt || post.content.slice(0, 160) + "…"}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[11px]">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 border border-border/60 bg-secondary rounded-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-span-12 md:col-span-2 flex md:justify-end items-start pt-1 font-mono text-xs">
                <span className="inline-flex items-center gap-1 text-muted-foreground group-hover:text-accent transition-colors">
                  <span>read spec</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
