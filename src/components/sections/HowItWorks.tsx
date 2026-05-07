import { Search, ShoppingCart, Clock, ThumbsUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Find Your Food",
    description:
      "Search from hundreds of restaurants and thousands of menu items near you.",
  },
  {
    icon: ShoppingCart,
    step: "02",
    title: "Place Your Order",
    description:
      "Add items to cart, choose delivery address and place your order in seconds.",
  },
  {
    icon: Clock,
    step: "03",
    title: "Track in Real-time",
    description:
      "Get live updates as your order is prepared and on its way to you.",
  },
  {
    icon: ThumbsUp,
    step: "04",
    title: "Enjoy Your Meal",
    description:
      "Receive your fresh hot food and enjoy. Rate your experience after.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            How MeowMeal Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Order your favorite food in just a few simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative flex flex-col items-center text-center gap-4">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-full h-0.5 bg-border z-0" />
              )}

              {/* Icon */}
              <div className="relative z-10 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <step.icon className="h-7 w-7 text-primary" />
                <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  {step.step}
                </span>
              </div>

              <div>
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}