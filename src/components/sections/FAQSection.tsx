"use client"
import { Plus } from "lucide-react"
import { useState } from "react"
import { FAQ } from "@/types/portfolio"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"
import { SectionHeader } from "@/components/ui/SectionHeader"

interface Props {
  faqs?: FAQ[]
  copy?: SiteCopy
}

const fallback: FAQ[] = [
  { id: "1", question: "What kind of projects do you take on?", answer: "Production web applications, frontend architecture, and design systems built with React, Next.js, and TypeScript.", category: "General", order_index: 0, is_published: true },
  { id: "2", question: "Are you available for full-time roles?", answer: "Yes — available for full-time roles, remote positions, and select contracts worldwide.", category: "Availability", order_index: 1, is_published: true },
]

export const FAQSection = ({ faqs = fallback, copy }: Props) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  if (!faqs || faqs.length === 0) return null

  return (
    <section id="faq" className="mx-auto max-w-6xl scroll-mt-28 px-6 md:px-10">
      <SectionHeader
        eyebrow={t(copy, "faq.eyebrow", "FAQ")}
        title={renderRichTitle(t(copy, "faq.title", "Good to *know*"), "text-accent")}
        align="stack"
      />

      <div className="mx-auto max-w-3xl divide-y divide-border rounded-3xl border border-border bg-card px-6 md:px-8">
        {faqs.map((faq, idx) => {
          const open = openIdx === idx
          const panelId = `faq-panel-${faq.id || idx}`
          const buttonId = `faq-button-${faq.id || idx}`
          return (
            <div key={faq.id || idx}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => setOpenIdx(open ? null : idx)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  className="group flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent md:text-lg">
                    {faq.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      open ? "rotate-45 border-accent bg-accent text-accent-foreground" : "border-border text-foreground"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!open}
                className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{faq.answer}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
