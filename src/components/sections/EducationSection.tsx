import { Education, Certification } from "@/types/portfolio"
import { GraduationCap, Award, ArrowUpRight } from "lucide-react"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"

interface Props {
  education: Education[]
  certifications?: Certification[]
  copy?: SiteCopy
}

export const EducationSection = ({ education, certifications = [], copy }: Props) => {
  if ((!education || education.length === 0) && (!certifications || certifications.length === 0)) {
    return null
  }

  return (
    <section id="education" className="px-6 md:px-12 lg:px-16 xl:px-24 scroll-mt-32">
      <div className="max-w-[1600px] mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between gap-8 mb-12 md:mb-16 border-b border-border pb-8">
          <div className="space-y-3">
            <p className="eyebrow">{t(copy, "education.eyebrow", "— 07 / Education")}</p>
            <h2 className="text-heading-section">
              {renderRichTitle(t(copy, "education.title", "Where I've *learned*"))}
            </h2>
          </div>
          <p className="hidden md:block text-sm text-muted-foreground max-w-xs text-pretty">
            {t(copy, "education.subtitle", "A self-driven learner. Programs, nanodegrees, and intensive courses I've completed.")}
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-5">
          {/* Education entries */}
          {education?.map((edu, i) => (
            <article
              key={edu.id}
              className="col-span-12 md:col-span-6 bg-card border border-border rounded-3xl p-7 md:p-8 hover:border-foreground/30 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-signal group-hover:text-signal-foreground transition-colors">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="font-display text-2xl md:text-3xl leading-tight mb-2">
                {edu.institution}
              </h3>
              <p className="text-base font-medium text-foreground/90">{edu.degree}</p>

              {edu.field_of_study && (
                <p className="text-sm text-muted-foreground leading-relaxed mt-3 text-pretty">
                  {edu.field_of_study}
                </p>
              )}

              <div className="flex items-center gap-4 pt-5 mt-5 border-t border-border text-xs">
                {edu.duration && (
                  <span className="font-mono uppercase tracking-wider text-muted-foreground">
                    {edu.duration}
                  </span>
                )}
                {edu.grade && (
                  <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
                    {edu.grade}
                  </span>
                )}
              </div>
            </article>
          ))}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="col-span-12 mt-8 mb-2">
              <p className="eyebrow">{t(copy, "education.cert_label", "— Credentials & Certifications")}</p>
            </div>
          )}
          {certifications?.map((cert, i) => (
            <article
              key={cert.id}
              className="col-span-12 md:col-span-6 lg:col-span-4 bg-card border border-border rounded-3xl p-6 hover:border-foreground/30 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-signal group-hover:text-signal-foreground transition-colors">
                  <Award className="w-4 h-4" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h4 className="font-display text-xl leading-tight">{cert.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{cert.issuer}</p>
              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium mt-4 hover:text-signal transition-colors"
                >
                  {t(copy, "education.verify_link", "Verify")} <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
