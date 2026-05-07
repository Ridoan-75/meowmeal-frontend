"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about MeowMeal
          </p>
        </div>

        {/* FAQ Items */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              >
                <span className="font-medium text-sm pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}