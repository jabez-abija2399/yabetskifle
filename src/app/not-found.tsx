import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { PortfolioService } from "@/services/portfolio"
import { t, renderRichTitle } from "@/lib/copy"

export const revalidate = 0

export default async function NotFound() {
  const copy = await PortfolioService.getSiteCopy().catch(() => ({}))

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 md:px-12 lg:px-16 xl:px-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid text-foreground/40 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-signal/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-3xl w-full text-center md:text-left space-y-10">
        <p className="eyebrow">{t(copy, "not_found.eyebrow", "Error · 404")}</p>
        <h1 className="font-display text-[clamp(5rem,18vw,14rem)] leading-[0.85] tracking-tighter">
          {renderRichTitle(t(copy, "not_found.title", "Lost in *space*."))}
          <span className="text-signal">.</span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-xl text-pretty">
          {t(copy, "not_found.body", "The page you're looking for doesn't exist — it may have been moved, renamed, or never existed at all. Let's get you back home.")}
        </p>

        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-foreground text-background h-12 px-6 rounded-full text-sm font-medium hover:bg-signal hover:text-signal-foreground transition-colors"
          >
            {t(copy, "not_found.cta_home", "Back to home")} <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 border border-border h-12 px-6 rounded-full text-sm font-medium hover:border-foreground transition-colors"
          >
            {t(copy, "not_found.cta_work", "Browse work")}
          </Link>
        </div>
      </div>
    </main>
  )
}
