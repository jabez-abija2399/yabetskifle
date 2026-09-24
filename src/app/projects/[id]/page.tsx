import { Metadata } from "next"
import { PortfolioService } from "@/services/portfolio"
import { ProjectDetailWrapper } from "@/components/sections/ProjectDetailWrapper"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const project = await PortfolioService.getProjectById(id)

  if (!project) return { title: "Project Not Found" }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  return {
    title: project.title,
    description: project.purpose || project.description.slice(0, 160),
    alternates: { canonical: `${siteUrl}/projects/${project.id}` },
    openGraph: {
      title: project.title,
      description: project.purpose || project.description.slice(0, 160),
      url: `${siteUrl}/projects/${project.id}`,
      images: project.images?.[0] ? [{ url: project.images[0] }] : [],
    },
  }
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const project = await PortfolioService.getProjectById(id).catch(() => null)
  if (!project) notFound()

  return (
    <main className="min-h-screen bg-background">
      <ProjectDetailWrapper id={id} initialProject={project} />
    </main>
  )
}
