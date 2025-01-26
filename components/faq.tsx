"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqItems = [
  {
    question: "How do I request gas?",
    answer:
      "You can request gas through our online platform or mobile app. Simply select your preferred service type and follow the guided process.",
  },
  {
    question: "What happens if I miss the pickup schedule?",
    answer:
      "If you miss the scheduled pickup, you can easily reschedule through our platform or contact our customer support for assistance.",
  },
  {
    question: "How do I register as a business customer?",
    answer:
      "Business customers can register through our dedicated business portal. You'll need to provide your business details and documentation for verification.",
  },
]

export function FAQ() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">FAQs</h2>
        <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

