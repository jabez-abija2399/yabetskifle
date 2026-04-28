import { PortfolioService } from "@/services/portfolio"
import { Hero } from "@/components/sections/Hero"
import { AboutSection } from "@/components/sections/AboutSection"
import { ServicesGrid } from "@/components/sections/ServicesGrid"
import { GithubMetrics } from "@/components/sections/GithubMetrics"
import { ProjectsShowcase } from "@/components/sections/ProjectsShowcase"
import { LatestPosts } from "@/components/sections/LatestPosts"
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { Footer } from "@/components/sections/Footer"

export default async function HomePage() {
  // Server-Side Data Fetching
  const [profile, services, projects, experiences, testimonials, settings, posts] = await Promise.all([
    PortfolioService.getProfile(),
    PortfolioService.getServices(),
    PortfolioService.getProjects(),
    PortfolioService.getExperience(),
    PortfolioService.getTestimonials(),
    PortfolioService.getSettings(),
    PortfolioService.getPosts()
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
    <main className="bg-background min-h-screen text-foreground">
      
      {/* 🚀 Hero Section */}
      <Hero profile={profile} />

      <div className="space-y-40 pb-32">
        
        {/* 👤 About & Skills (Derived from Profile) */}
        <AboutSection profile={profile} />

        {/* 📡 Github Live Telemetry Array */}
        <GithubMetrics username={profile.social_links?.github?.split('/').filter(Boolean).pop() || "jabez-abija2399"} />

        {/* 🛠️ Core Services */}
        {settings?.show_services !== false && <ServicesGrid services={services} />}

        {/* 📂 Project Exhibition */}
        {settings?.show_projects !== false && <ProjectsShowcase projects={projects} />}

        {/* 🖋️ Latest Transmissions (Blog) */}
        {settings?.show_blog !== false && <LatestPosts posts={posts} />}

        {/* ⏳ Experience Timeline */}
        {settings?.show_experience !== false && <ExperienceTimeline experiences={experiences} />}

        {/* 💬 Social Evidence */}
        {settings?.show_testimonials !== false && <TestimonialsSection testimonials={testimonials} />}

        {/* ✉️ Direct Inquiry */}
        {settings?.show_contact !== false && <ContactSection profile={profile} />}
      </div>

      {/* 🏁 Footer */}
      <Footer settings={settings} profile={profile} />
      
    </main>
  )
}
