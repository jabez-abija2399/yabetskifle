import { Post } from "@/types/portfolio"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"
import { SectionHeader } from "@/components/ui/SectionHeader"

interface Props {
  posts: Post[]
  copy?: SiteCopy
}

export const LatestPosts = ({ posts, copy }: Props) => {
  if (!posts || posts.length === 0) return null
  const displayPosts = posts.slice(0, 3)

  return (
    <section id="journal" className="mx-auto max-w-6xl scroll-mt-28 px-6 md:px-10">
      <SectionHeader
        eyebrow={t(copy, "blog.home.eyebrow", "Journal")}
        title={renderRichTitle(t(copy, "blog.home.title", "Notes on *craft* and architecture"), "text-accent")}
        subtitle={t(copy, "blog.home.subtitle", "Writing about frontend engineering, systems, and what I'm learning.")}
      />

      <div className="grid gap-5 md:grid-cols-3">
        {displayPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group lift-card flex flex-col overflow-hidden rounded-3xl border border-border bg-card"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
              {post.cover_image ? (
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-accent/20 to-violet/20 font-mono text-xs text-muted-foreground">
                  journal
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
              <p className="font-mono text-xs text-muted-foreground">
                {post.created_at
                  ? new Date(post.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                  : "Recent"}
              </p>
              <h3 className="text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent">
                {post.title}
              </h3>
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground text-pretty">
                {post.excerpt || post.content.slice(0, 160) + "…"}
              </p>
              <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-accent">
                Read article
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          href="/blog"
          className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-6 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          {t(copy, "blog.home.archive_link", "All articles")}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
