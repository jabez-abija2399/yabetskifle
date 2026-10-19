// Always re-fetch from database — every label, project, and post change in admin
// shows up immediately on the public site without rebuilding.
export const revalidate = 0

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
import { Reveal } from "@/components/ui/Reveal"

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

  const languagesLine =
    settings?.show_languages !== false && languages.length > 0
    ? {
        short: languages.map(l => l.name.slice(0, 2).toUpperCase()).join(" · "),
        long: languages.map(l => l.name).join(" · "),
      }
    : undefined

  if (!profile) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground font-mono text-xs">
        <h1 className="text-xl font-semibold text-foreground">System initialization needed</h1>
        <p className="text-muted-foreground">Configure profile parameters in the admin dashboard to deploy.</p>
        <a href="/admin/profile" className="px-4 py-2 bg-accent text-accent-foreground rounded-xs font-medium">Go to Admin</a>
      </div>
    )
  }

  const toolCount = skills.reduce((acc, cat) => acc + (cat.technologies?.length ?? 0), 0)
  const heroStats = [
    profile.experience_years ? { value: `${profile.experience_years}+`, label: "years shipping" } : null,
    projects.length ? { value: String(projects.length), label: "case studies" } : null,
    toolCount ? { value: String(toolCount), label: "tools in stack" } : null,
    experiences.length ? { value: String(experiences.length), label: "roles" } : null,
  ].filter((s): s is { value: string; label: string } => s !== null)

  return (
    <main className="bg-background min-h-screen text-foreground">
      <Hero profile={profile} copy={copy} resumeUrl={profile.resume_url || settings?.cv_url} stats={heroStats} />

      <div className="space-y-24 md:space-y-32 pb-24 pt-16 md:pt-24">
        {settings?.show_projects !== false && <Reveal><ProjectsShowcase projects={projects} copy={copy} /></Reveal>}

        {settings?.show_skills !== false && <Reveal><TechStack skills={skills} copy={copy} /></Reveal>}

        <Reveal><AboutSection profile={profile} languagesLine={languagesLine} copy={copy} /></Reveal>

        {settings?.show_experience !== false && <Reveal><ExperienceTimeline experiences={experiences} copy={copy} /></Reveal>}

        {settings?.show_services !== false && <Reveal><ServicesGrid services={services} copy={copy} /></Reveal>}

        <Reveal><EducationSection education={education} certifications={certifications} copy={copy} /></Reveal>

        {settings?.show_blog !== false && <Reveal><LatestPosts posts={posts} copy={copy} /></Reveal>}

        {settings?.show_testimonials !== false && <Reveal><TestimonialsSection testimonials={testimonials} copy={copy} /></Reveal>}

        {settings?.show_faq !== false && <Reveal><FAQSection faqs={faqs} copy={copy} /></Reveal>}

        {settings?.show_contact !== false && (
          <Reveal>
            <ContactSection profile={profile} copy={copy} contactEmail={settings?.contact_email} />
          </Reveal>
        )}
      </div>

      <Footer settings={settings} profile={profile} copy={copy} />
    </main>
  )
}
