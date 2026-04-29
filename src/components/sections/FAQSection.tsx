"use client"
import { motion } from "framer-motion"
import { 
  Plus, 
  HelpCircle 
} from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    question: "What is your primary architectural approach?",
    answer: "I prioritize modular, scalable systems built with modern frameworks like Next.js and PostgreSQL. My methodology focuses on technical debt reduction and long-term maintainability."
  },
  {
    question: "How do you handle project management?",
    answer: "I use an iterative, agile-inspired workflow with clear milestones and regular technical reflections. Transparency and strategic communication are core to my consultative process."
  },
  {
    question: "Are you available for freelance consultation?",
    answer: "Yes, I am currently accepting inquiries for high-impact technical collaborations or architectural consultations. Use the contact form below to initiate a strategic conversation."
  }
]

export const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto space-y-16">
      
      {/* 🧭 Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-primary">
           <HelpCircle className="w-5 h-5" />
           <span className="text-[11px] font-black uppercase tracking-[0.4em] italic">FAQ</span>
        </div>
        <h2 className="text-heading-section font-bold tracking-tight italic text-balance">
          Frequently Asked <span className="text-zinc-600">Questions.</span>
        </h2>
      </div>

      {/* 🧩 Accordion */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div 
            key={idx} 
            className="group rounded-[2rem] border border-border bg-card/30 backdrop-blur-sm overflow-hidden transition-all hover:border-primary/30"
          >
            <button 
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full p-8 flex items-center justify-between text-left"
            >
              <h3 className="text-lg font-bold italic tracking-tight group-hover:text-primary transition-colors">
                {faq.question}
              </h3>
              <Plus className={`w-5 h-5 text-primary transition-transform duration-500 ${openIdx === idx ? "rotate-45" : ""}`} />
            </button>
            
            <div className={`transition-all duration-500 ease-in-out ${openIdx === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
               <div className="px-8 pb-8 text-muted-foreground font-medium italic border-t border-border/50 pt-6">
                  {faq.answer}
               </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
