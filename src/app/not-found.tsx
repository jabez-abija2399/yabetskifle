import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { PortfolioService } from "@/services/portfolio"
import { t, renderRichTitle } from "@/lib/copy"

export const revalidate = 0

export default async function NotFound() {
  const copy = await PortfolioService.getSiteCopy().catch(() => ({}))

  return (
    <main className="min-h-screen bg-background bg-schematic-grid flex items-center justify-center px-6 md:px-12 lg:px-16 xl:px-24">
      <div className="relative z-10 max-w-3xl w-full space-y-10 corner-ticks border border-border bg-card p-8 md:p-12">
        <p className="eyebrow">{t(copy, "not_found.eyebrow", "Error · 404")}</p>
        <h1 className="text-heading-hero text-foreground">
          {renderRichTitle(t(copy, "not_found.title", "Lost in space."), "text-[#2D5F6B] dark:text-[#3E7987]")}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-xl text-pretty">
          {t(copy, "not_found.body", "The page you're looking for doesn't exist — it may have been moved, renamed, or never existed at all. Let's get you back home.")}
        </p>

        <div className="flex flex-wrap gap-3 pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#2D5F6B] text-white dark:bg-[#3E7987] dark:text-background h-11 px-5 rounded-xs font-mono text-xs font-medium hover:bg-[#234b54] transition-colors"
          >
            <span>[ {t(copy, "not_found.cta_home", "Back to home")} ]</span> <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 border border-border bg-card h-11 px-5 rounded-xs font-mono text-xs text-foreground hover:border-[#2D5F6B] hover:text-[#2D5F6B] transition-colors"
          >
            <span>[ {t(copy, "not_found.cta_work", "Browse work")} ]</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
