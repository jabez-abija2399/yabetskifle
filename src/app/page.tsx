import { PortfolioService } from "@/services/portfolio"
import { Hero } from "@/components/sections/Hero"
import { AboutSection } from "@/components/sections/AboutSection"
import { TechStack } from "@/components/sections/TechStack"
import { ServicesGrid } from "@/components/sections/ServicesGrid"
import { ProjectsShowcase } from "@/components/sections/ProjectsShowcase"
import { LatestPosts } from "@/components/sections/LatestPosts"
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { FAQSection } from "@/components/sections/FAQSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { EducationSection } from "@/components/sections/EducationSection"
import { Footer } from "@/components/sections/Footer"

export default async function HomePage() {
  const [profile, skills, services, projects, experiences, testimonials, settings, posts, faqs, education, certifications, languages, copy] = await Promise.all([
    PortfolioService.getProfile(),
    PortfolioService.getSkills(),
    PortfolioService.getServices(),
    PortfolioService.getProjects(),
    PortfolioService.getExperience(),
    PortfolioService.getTestimonials(),
    PortfolioService.getSettings(),
    PortfolioService.getPosts(),
    PortfolioService.getFAQs(),
    PortfolioService.getEducation(),
    PortfolioService.getCertifications(),
    PortfolioService.getLanguages(),
    PortfolioService.getSiteCopy(),
  ])

  const languagesLine = languages.length > 0
    ? {
        short: languages.map(l => l.name.slice(0, 2).toUpperCase()).join(" · "),
        long: languages.map(l => l.name).join(" · "),
      }
    : undefined

  if (!profile) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-display italic">Setup needed</h1>
        <p className="text-muted-foreground">Set up your profile in the admin dashboard to go live.</p>
        <a href="/admin/profile" className="px-6 py-2 bg-foreground text-background rounded-full font-medium">Go to Admin</a>
      </div>
    )
  }

  return (
    <main className="bg-background min-h-screen text-foreground">
      <Hero profile={profile} copy={copy} />

      <div className="space-y-32 md:space-y-40 pb-32 pt-24 md:pt-32">
        <AboutSection profile={profile} languagesLine={languagesLine} copy={copy} />

        {settings?.show_skills !== false && <TechStack skills={skills} copy={copy} />}

        {settings?.show_services !== false && <ServicesGrid services={services} copy={copy} />}

        {settings?.show_projects !== false && <ProjectsShowcase projects={projects} copy={copy} />}

        {settings?.show_blog !== false && <LatestPosts posts={posts} copy={copy} />}

        {settings?.show_experience !== false && <ExperienceTimeline experiences={experiences} copy={copy} />}

        <EducationSection education={education} certifications={certifications} copy={copy} />

        {settings?.show_testimonials !== false && <TestimonialsSection testimonials={testimonials} copy={copy} />}

        {settings?.show_faq !== false && <FAQSection faqs={faqs} copy={copy} />}

        {settings?.show_contact !== false && <ContactSection profile={profile} copy={copy} />}
      </div>

      <Footer settings={settings} profile={profile} copy={copy} />
    </main>
  )
}
