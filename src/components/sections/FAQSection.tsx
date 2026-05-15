"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How does MeowMeal work?",
    answer:
      "MeowMeal connects you with the best restaurants in your city. Simply search for food, add items to your cart, and place your order. We handle the rest!",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery time varies by restaurant and location, but most orders are delivered within 30-60 minutes. You can track your order in real-time.",
  },
  {
    question: "Is there a minimum order amount?",
    answer:
      "Minimum order amounts vary by restaurant. You can see the minimum order requirement on each restaurant's page.",
  },
  {
    question: "How do I become a restaurant partner?",
    answer:
      "Register as a Provider on MeowMeal, complete your restaurant profile, and start accepting orders right away.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "Currently we accept Cash on Delivery. More payment options including bKash and card payments are coming soon.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "You can cancel your order as long as it has not been accepted by the restaurant. Once preparation begins, cancellation is not possible.",
  },
];


export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-24 bg-secondary/30 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/6 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-primary/20">
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Frequently Asked{" "}
            <span className="text-primary relative">
              Questions
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
              >
                <path
                  d="M2 8.5C50 3 100 1 150 3.5C200 6 250 8 298 5"
                  stroke="#FF6B35"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="text-muted-foreground text-sm mt-5">
            Everything you need to know about MeowMeal
          </p>
        </div>

        {/* FAQ Items */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`relative bg-card border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "border-primary/30 shadow-lg shadow-primary/8"
                    : "border-border hover:border-primary/20 hover:shadow-md hover:shadow-primary/5"
                }`}
              >
                {/* Left accent bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all duration-300 ${
                    isOpen ? "bg-primary" : "bg-transparent"
                  }`}
                />

                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  {/* Question */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span
                      className={`shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-xs font-black transition-colors duration-200 ${
                        isOpen
                          ? "bg-primary text-white"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`font-semibold text-sm transition-colors duration-200 ${
                        isOpen ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>

                  {/* Plus/Minus Icon */}
                  <div
                    className={`shrink-0 h-7 w-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isOpen
                        ? "bg-primary text-white"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="h-3.5 w-3.5" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                  </div>
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-5 pl-[4.25rem]">
                    <div className="h-px bg-border mb-4" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Still have questions?
          </p>
          <a
            href="mailto:support@meowmeal.com"
            className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/15 text-primary font-semibold text-sm px-6 py-3 rounded-2xl border border-primary/20 transition-all"
          >
            Contact Support
          </a>
        </div>

      </div>
    </section>
  );
}