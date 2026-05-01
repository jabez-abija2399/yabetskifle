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
    <section className="px-6 md:px-12 lg:px-16 xl:px-24 scroll-mt-32">
      <div className="max-w-[1600px] mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between gap-8 mb-12 md:mb-16 border-b border-border pb-8">
          <div className="space-y-3">
            <p className="eyebrow">{t(copy, "blog.home.eyebrow", "— 05 / Journal")}</p>
            <h2 className="text-heading-section">
              {renderRichTitle(t(copy, "blog.home.title", "Latest *writing*"))}
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium hover:text-signal transition-colors"
          >
            {t(copy, "blog.home.archive_link", "All articles")} <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {displayPosts.map((post, i) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group grid grid-cols-12 gap-4 md:gap-8 py-7 md:py-9 hover:bg-card transition-colors -mx-6 md:-mx-12 lg:-mx-16 xl:-mx-24 px-6 md:px-12 lg:px-16 xl:px-24"
            >
              <div className="col-span-12 md:col-span-1">
                <span className="font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="col-span-12 md:col-span-2">
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {post.created_at
                    ? new Date(post.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : "Recent"}
                </p>
              </div>
              <div className="col-span-12 md:col-span-7 space-y-2">
                <h3 className="font-display text-2xl md:text-3xl leading-tight group-hover:text-signal transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 max-w-xl text-pretty">
                  {post.excerpt || post.content.slice(0, 160) + "…"}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="col-span-12 md:col-span-2 flex md:justify-end items-start">
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-signal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
