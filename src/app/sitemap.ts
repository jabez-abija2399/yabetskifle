import type { MetadataRoute } from "next"
import { PortfolioService } from "@/services/portfolio"

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([
    PortfolioService.getProjects().catch(() => []),
    PortfolioService.getPosts().catch(() => []),
  ])

  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`,         lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/blog`,     lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ]

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE}/projects/${p.id}`,
    lastModified: p.created_at ? new Date(p.created_at) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE}/blog/${p.slug}`,
    lastModified: p.created_at ? new Date(p.created_at) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticRoutes, ...projectRoutes, ...postRoutes]
}
