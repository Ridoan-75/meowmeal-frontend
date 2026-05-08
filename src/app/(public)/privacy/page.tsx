

const sections = [
  {
    title: "Information We Collect",
    content:
      "We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support. This includes your name, email address, phone number, delivery address, and payment information.",
  },
  {
    title: "How We Use Your Information",
    content:
      "We use the information we collect to process orders and payments, communicate with you about your orders, send you promotional offers and updates (with your consent), improve our services, and comply with legal obligations.",
  },
  {
    title: "Information Sharing",
    content:
      "We share your information with restaurants to fulfill your orders, delivery partners to complete deliveries, payment processors to handle transactions, and service providers who assist in our operations. We do not sell your personal information to third parties.",
  },
  {
    title: "Data Security",
    content:
      "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.",
  },
  {
    title: "Cookies",
    content:
      "We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.",
  },
  {
    title: "Your Rights",
    content:
      "You have the right to access, update, or delete your personal information. You may also object to processing of your personal data, request restriction of processing, and request portability of your data.",
  },
  {
    title: "Contact Us",
    content:
      "If you have any questions about this Privacy Policy, please contact us at privacy@meowmeal.com or through our contact page.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: May 1, 2026
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card border border-border rounded-2xl p-8 flex flex-col gap-8">
              <p className="text-muted-foreground leading-relaxed">
                At MeowMeal, we take your privacy seriously. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our platform.
              </p>

              {sections.map((section, index) => (
                <div key={index} className="flex flex-col gap-3">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                      {index + 1}
                    </span>
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed pl-8">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}