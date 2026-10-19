import { Education, Certification } from "@/types/portfolio"
import { GraduationCap, Award, ArrowUpRight } from "lucide-react"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"
import { SectionHeader } from "@/components/ui/SectionHeader"

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
    <section id="education" className="mx-auto max-w-6xl scroll-mt-28 px-6 md:px-10">
      <SectionHeader
        eyebrow={t(copy, "education.eyebrow", "Education")}
        title={renderRichTitle(t(copy, "education.title", "Learning, *formally* and otherwise"), "text-accent")}
        subtitle={t(copy, "education.subtitle", "Degrees, intensive programs, and verified credentials.")}
      />

      <div className="grid gap-5 md:grid-cols-2">
        {education?.map((edu) => (
          <article key={edu.id} className="flex flex-col justify-between gap-8 rounded-3xl border border-border bg-card p-7">
            <div className="space-y-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div className="space-y-1.5">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">{edu.institution}</h3>
                <p className="text-base font-medium text-accent">{edu.degree}</p>
                {edu.field_of_study && <p className="text-sm leading-relaxed text-muted-foreground">{edu.field_of_study}</p>}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
              {edu.duration && <span className="font-mono text-xs">{edu.duration}</span>}
              {edu.grade && <span className="rounded-full bg-secondary px-3 py-1 text-xs text-foreground">{edu.grade}</span>}
            </div>
          </article>
        ))}

        {certifications?.map((cert) => (
          <article key={cert.id} className="flex flex-col justify-between gap-6 rounded-3xl border border-border bg-card p-6">
            <div className="space-y-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                <Award className="h-4 w-4" />
              </span>
              <h4 className="text-base font-semibold leading-snug tracking-tight text-foreground">{cert.title}</h4>
              <p className="text-sm text-muted-foreground">{cert.issuer}</p>
            </div>
            {cert.credential_url && (
              <a
                href={cert.credential_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
              >
                {t(copy, "education.verify_link", "Verify credential")}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
