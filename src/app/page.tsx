import { PortfolioService } from "@/services/portfolio"
import { Hero } from "@/components/sections/Hero"
import { ServicesGrid } from "@/components/sections/ServicesGrid"
import { ProjectsShowcase } from "@/components/sections/ProjectsShowcase"
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { Footer } from "@/components/sections/Footer"

export default async function HomePage() {
  // Server-Side Data Fetching
  const [profile, services, projects, experiences, testimonials, settings] = await Promise.all([
    PortfolioService.getProfile(),
    PortfolioService.getServices(),
    PortfolioService.getProjects(),
    PortfolioService.getExperience(),
    PortfolioService.getTestimonials(),
    PortfolioService.getSettings()
  ])

  // Fallback if profile is not setup
  if (!profile) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-black italic">Start Your Engine</h1>
        <p className="text-muted-foreground">Setup your profile in the admin dashboard to go live.</p>
        <a href="/admin/profile" className="px-6 py-2 bg-primary text-white rounded-xl font-bold">Go to Admin</a>
      </div>
    )
  }

  return (
    <main className="bg-background min-h-screen text-foreground space-y-32 pb-32">
      
      {/* Hero Section */}
      <Hero profile={profile} />

      {/* Services Section */}
      <ServicesGrid services={services} />

      {/* Portfolio Gallery */}
      <ProjectsShowcase projects={projects} />

      {/* Professional Journey */}
      <ExperienceTimeline experiences={experiences} />

      {/* Social Proof */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Lead Generation */}
      <ContactSection />

      {/* Final Wrap-up */}
      <Footer settings={settings} />
      
    </main>
  )
}
