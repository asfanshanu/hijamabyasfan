"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
}

interface FaqProps {
  faqs?: FAQItem[];
}

export default function Faq({ faqs }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Initial FAQ list matching user requirements
  const defaultFaqs: FAQItem[] = [
    {
      id: "1",
      question: "What is cupping?",
      answer: "Cupping is a traditional practice where specialized cups are placed on specific parts of the skin. Using suction, the cups pull the skin and superficial muscle layers slightly upward, promoting localized blood circulation and releasing tension in the muscle tissues.",
      display_order: 1,
      is_active: true,
    },
    {
      id: "2",
      question: "How do I book an appointment?",
      answer: "You can book directly on this website. Simply scroll to the 'Availability' section, select an available date on the calendar, choose your preferred time slot, fill out the booking form, and click submit. You do not need to create an account to book.",
      display_order: 2,
      is_active: true,
    },
    {
      id: "3",
      question: "Is an appointment required?",
      answer: "Yes. To ensure a calm environment, proper hygiene preparation, and personal attention, all sessions are strictly appointment-based. Walk-ins are not accommodated.",
      display_order: 3,
      is_active: true,
    },
    {
      id: "4",
      question: "How long does a session usually take?",
      answer: "A standard session takes approximately 45 to 60 minutes. This includes a brief pre-session conversation, preparation of the clean room, the cupping placement, and aftercare guidance.",
      display_order: 4,
      is_active: true,
    },
    {
      id: "5",
      question: "What should I do before my appointment?",
      answer: "It is recommended to have a light meal 2–3 hours before your session (avoid cupping on a completely full or empty stomach), stay hydrated, wear comfortable clothing, and take a shower as you will need to keep the cupping area dry for a period after the session.",
      display_order: 5,
      is_active: true,
    },
    {
      id: "6",
      question: "What should I do after the session?",
      answer: "Keep the cupping area covered, warm, and away from cold drafts. Drink plenty of warm water. Avoid strenuous workouts, swimming, cold baths, and caffeine or alcohol for 24 hours to let your skin and body rest.",
      display_order: 6,
      is_active: true,
    },
    {
      id: "7",
      question: "Who should speak with a qualified healthcare professional before considering cupping?",
      answer: "Individuals with severe cardiovascular disease, bleeding disorders, deep vein thrombosis, open skin wounds/infections, pregnant women, and patients on blood-thinning medications should consult their physician before scheduling cupping.",
      display_order: 7,
      is_active: true,
    },
    {
      id: "8",
      question: "Can I ask questions before booking?",
      answer: "Absolutely. Feel free to use the WhatsApp, Call, or Email buttons in the Contact section to reach out directly. I am happy to address any questions you have regarding the procedure.",
      display_order: 8,
      is_active: true,
    },
    {
      id: "9",
      question: "Where are sessions conducted?",
      answer: "Sessions are conducted in a private, clean, and prepared wellness room. The exact location details and directions are provided upon appointment confirmation.",
      display_order: 9,
      is_active: true,
    },
    {
      id: "10",
      question: "How can I contact Asfan?",
      answer: "You can reach me directly via WhatsApp, direct phone call, or email. All corresponding contact numbers and addresses are listed in the 'Contact' section of this page.",
      display_order: 10,
      is_active: true,
    },
  ];

  const activeFaqs = (faqs ?? defaultFaqs)
    .filter((faq) => faq.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-muted/30 border-y border-border">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center space-y-6 mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-gold">
            Common Inquiries
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-deep-olive dark:text-soft-sage">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-foreground/80 leading-relaxed font-sans">
            Find answers to common questions about cupping therapy, preparation requirements, aftercare, and scheduling policies.
          </p>
        </div>

        {/* Accordions Container */}
        <div className="space-y-4">
          {activeFaqs.length > 0 ? (
            activeFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div 
                  key={faq.id}
                  className="bg-background border border-border/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left font-sans font-semibold text-deep-olive dark:text-soft-sage hover:bg-muted/10 transition-colors"
                  >
                    <span className="text-base md:text-lg pr-4">{faq.question}</span>
                    <ChevronDown 
                      className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
                    />
                  </button>
                  <div 
                    className={`grid transition-all duration-350 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100 border-t border-border/60" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 py-5 text-sm md:text-base text-foreground/80 leading-relaxed font-sans bg-muted/5">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-background border border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center space-y-2">
              <p className="text-sm font-semibold text-foreground/80">No FAQ questions created yet.</p>
              <p className="text-xs text-foreground/60">Please check back later or contact Asfan directly.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
