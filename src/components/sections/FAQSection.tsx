"use client"
import { Plus } from "lucide-react"
import { useState } from "react"
import { FAQ } from "@/types/portfolio"
import { SiteCopy, t, renderRichTitle } from "@/lib/copy"

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
    <section id="faq" className="px-6 md:px-12 lg:px-16 xl:px-24 scroll-mt-24">
      <div className="max-w-[1600px] mx-auto">
        {/* Section header — Sentence case */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-accent/30">
          <div className="space-y-2">
            <div className="eyebrow-chip">
              {t(copy, "faq.eyebrow", "09. Inquiries & parameters")}
            </div>
            <h2 className="text-heading-section font-semibold tracking-tight text-foreground">
              {renderRichTitle(t(copy, "faq.title", "Frequently answered engineering questions"), "text-accent")}
            </h2>
          </div>
        </div>

        <div className="border-t border-border divide-y divide-border max-w-4xl">
          {faqs.map((faq, idx) => {
            const open = openIdx === idx
            return (
              <div key={faq.id || idx}>
                <button
                  onClick={() => setOpenIdx(open ? null : idx)}
                  className="w-full py-5 sm:py-6 flex items-center justify-between gap-6 text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-accent">
                      [{String(idx + 1).padStart(2, "0")}]
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight group-hover:text-accent transition-colors">
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className={`shrink-0 w-7 h-7 rounded-xs border border-border flex items-center justify-center transition-transform duration-200 ${
                      open ? "bg-accent/10 rotate-45 border-accent" : "bg-card"
                    }`}
                  >
                    <Plus className={`w-3.5 h-3.5 ${open ? "text-accent" : "text-foreground"}`} />
                  </div>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    open ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden pl-7">
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl font-sans">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
