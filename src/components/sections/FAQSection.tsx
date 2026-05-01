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
  { id: "1", question: "What kind of projects do you take on?", answer: "Production web apps and marketing sites built on React, Next.js, and TypeScript.", category: "General", order_index: 0, is_published: true },
  { id: "2", question: "Are you available for full-time roles?", answer: "Yes — open to full-time, remote, hybrid, and freelance.", category: "Availability", order_index: 1, is_published: true },
]

export const FAQSection = ({ faqs = fallback, copy }: Props) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  if (!faqs || faqs.length === 0) return null

  return (
    <section className="px-6 md:px-12 scroll-mt-32">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between gap-8 mb-12 md:mb-16 border-b border-border pb-8">
          <div className="space-y-3">
            <p className="eyebrow">{t(copy, "faq.eyebrow", "— 09 / FAQ")}</p>
            <h2 className="text-heading-section">
              {renderRichTitle(t(copy, "faq.title", "Common *questions*"))}
            </h2>
          </div>
        </div>

        <div className="border-y border-border divide-y divide-border">
          {faqs.map((faq, idx) => {
            const open = openIdx === idx
            return (
              <div key={faq.id || idx}>
                <button
                  onClick={() => setOpenIdx(open ? null : idx)}
                  className="w-full py-6 md:py-8 flex items-center justify-between gap-6 text-left group"
                >
                  <h3 className="font-display text-xl md:text-2xl leading-snug group-hover:text-signal transition-colors">
                    {faq.question}
                  </h3>
                  <div
                    className={`shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all ${
                      open ? "bg-foreground text-background border-transparent rotate-45" : ""
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </div>
                </button>
                <div
                  className={`grid transition-all duration-500 ease-out ${
                    open ? "grid-rows-[1fr] opacity-100 pb-6 md:pb-8" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl text-pretty">
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
