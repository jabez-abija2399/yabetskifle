import { PortfolioService } from "@/services/portfolio"
import { Hero } from "@/components/sections/Hero"
import { AboutSection } from "@/components/sections/AboutSection"
import { TechStack } from "@/components/sections/TechStack"
import { ServicesGrid } from "@/components/sections/ServicesGrid"
import { GithubMetrics } from "@/components/sections/GithubMetrics"
import { ProjectsShowcase } from "@/components/sections/ProjectsShowcase"
import { CTASection } from "@/components/sections/CTASection"
import { LatestPosts } from "@/components/sections/LatestPosts"
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { FAQSection } from "@/components/sections/FAQSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { Footer } from "@/components/sections/Footer"

export default async function HomePage() {
  // Server-Side Data Fetching
  const [profile, skills, services, projects, experiences, testimonials, settings, posts] = await Promise.all([
    PortfolioService.getProfile(),
    PortfolioService.getSkills(),
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
        <h1 className="text-2xl font-black italic">ADMIN SETUP</h1>
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

        {/* 🧱 Core technical ecosystem */}
         {settings?.show_skills !== false && <TechStack skills={skills} />}

        {/* 📡 Live Development Activity Array */}
        <GithubMetrics username={profile.social_links?.github?.split('/').filter(Boolean).pop() || "jabez-abija2399"} />

        {/* 🛠️ Core Services */}
        {settings?.show_services !== false && <ServicesGrid services={services} />}

        {/* 📂 Project Exhibition */}
        {settings?.show_projects !== false && <ProjectsShowcase projects={projects} />}

        {/* 📣 Direct CTA Banner */}
        {/* <CTASection /> */}

        {/* 🖋️ Latest Insights (Blog) */}
        {settings?.show_blog !== false && <LatestPosts posts={posts} />}

        {/* ⏳ Experience Timeline */}
        {settings?.show_experience !== false && <ExperienceTimeline experiences={experiences} />}

        {/* 💬 Social Evidence */}
        {settings?.show_testimonials !== false && <TestimonialsSection testimonials={testimonials} />}

        {/* 💡 Consultative Insights */}
        {/* <FAQSection /> */}

        {/* ✉️ Direct Inquiry */}
        {settings?.show_contact !== false && <ContactSection profile={profile} />}
      </div>

      {/* 🏁 Footer */}
      <Footer settings={settings} profile={profile} />
      
    </main>
  )
}
