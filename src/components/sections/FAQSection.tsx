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
    <section className="py-16 bg-secondary/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 text-primary">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm">
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
                className={`bg-card border rounded-2xl overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? "border-primary/30 shadow-md shadow-primary/5"
                    : "border-border hover:border-primary/20"
                }`}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  {/* Question */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span
                      className={`shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                        isOpen
                          ? "bg-primary text-white"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`font-semibold text-sm transition-colors ${
                        isOpen ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>

                  {/* Icon */}
                  <div
                    className={`shrink-0 h-7 w-7 rounded-full flex items-center justify-center transition-colors ${
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
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-48" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-5 pl-[4.25rem]">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}