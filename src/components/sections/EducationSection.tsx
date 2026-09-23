import { Education, Certification } from "@/types/portfolio"
import { GraduationCap, Award } from "lucide-react"
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
    <section id="education" className="px-6 md:px-12 lg:px-16 xl:px-24 scroll-mt-24">
      <div className="max-w-[1600px] mx-auto">
        {/* Section header — Sentence case */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-accent/30">
          <div className="space-y-2">
            <div className="eyebrow-chip">
              {t(copy, "education.eyebrow", "06. Education & credentials")}
            </div>
            <h2 className="text-heading-section font-semibold tracking-tight text-foreground">
              {renderRichTitle(t(copy, "education.title", "Academic background & certified programs"), "text-accent")}
            </h2>
          </div>
          <p className="font-mono text-xs text-muted-foreground max-w-sm">
            {t(copy, "education.subtitle", "Intensive programs, degrees, and verified technical credentials.")}
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Education entries */}
          {education?.map((edu, i) => (
            <article
              key={edu.id}
              className="col-span-12 md:col-span-6 bg-card border border-accent/30 rounded-xs p-6 corner-ticks flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/80 font-mono text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-foreground font-medium">
                    <GraduationCap className="w-3.5 h-3.5 text-accent" />
                    <span>Degree spec</span>
                  </span>
                  <span>[edu.{String(i + 1).padStart(2, "0")}]</span>
                </div>

                <h3 className="text-lg md:text-xl font-semibold text-foreground tracking-tight mb-1">
                  {edu.institution}
                </h3>
                <p className="font-mono text-xs text-accent font-medium">
                  {edu.degree}
                </p>

                {edu.field_of_study && (
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-3 font-sans">
                    {edu.field_of_study}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 pt-4 mt-6 border-t border-border/80 text-xs font-mono text-muted-foreground">
                {edu.duration && <span>{edu.duration}</span>}
                {edu.grade && (
                  <span className="px-2 py-0.5 border border-accent/30 bg-secondary rounded-xs text-[11px] text-foreground">
                    {edu.grade}
                  </span>
                )}
              </div>
            </article>
          ))}

          {/* Certifications heading if present */}
          {certifications.length > 0 && (
            <div className="col-span-12 mt-6">
              <div className="font-mono text-xs text-accent pb-2 border-b border-border">
                {t(copy, "education.cert_label", "Verified technical credentials")}
              </div>
            </div>
          )}

          {certifications?.map((cert, i) => (
            <article
              key={cert.id}
              className="col-span-12 md:col-span-6 lg:col-span-4 bg-card border border-accent/30 rounded-xs p-5 corner-ticks flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80 font-mono text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-foreground font-medium">
                    <Award className="w-3.5 h-3.5 text-accent" />
                    <span>Certificate</span>
                  </span>
                  <span>[crt.{String(i + 1).padStart(2, "0")}]</span>
                </div>

                <h4 className="text-base font-semibold text-foreground tracking-tight">
                  {cert.title}
                </h4>
                <p className="font-mono text-xs text-muted-foreground mt-1">
                  issuer: {cert.issuer}
                </p>
              </div>

              {cert.credential_url && (
                <div className="pt-3 mt-4 border-t border-border/60">
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs text-accent hover:underline transition-colors"
                  >
                    <span>[ {t(copy, "education.verify_link", "verify credential")} ↗ ]</span>
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
