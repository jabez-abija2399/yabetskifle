import { Metadata } from "next"
import { PortfolioService } from "@/services/portfolio"
import { ProjectDetailWrapper } from "@/components/sections/ProjectDetailWrapper"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const project = await PortfolioService.getProjectById(id)
  
  if (!project) return { title: "Project Not Found" }

  return {
    title: project.title,
    description: project.purpose || project.description.slice(0, 160),
    openGraph: {
      title: project.title,
      description: project.purpose || project.description.slice(0, 160),
      images: project.images?.[0] ? [{ url: project.images[0] }] : [],
    },
  }
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Server-fetch the project so title/description are in the initial HTML
  // (SEO + no layout shift); the wrapper still fetches site copy client-side.
  const project = await PortfolioService.getProjectById(id).catch(() => null)

  return (
    <main className="min-h-screen bg-background">
      <ProjectDetailWrapper id={id} initialProject={project} />
    </main>
  )
}
