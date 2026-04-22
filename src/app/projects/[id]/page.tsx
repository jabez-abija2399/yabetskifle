// [id] is a dynamic route — works for /projects/abc, /projects/xyz, etc.
import { ProjectDetailWrapper } from "@/components/sections/ProjectDetailWrapper"

interface Props {
  params: Promise<{ id: string }>   // Next.js 15+ passes params as a Promise
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params   // Must await in Next.js 15+
  return (
    <main className="min-h-screen pt-20">
      <ProjectDetailWrapper id={id} />
    </main>
  )
}
