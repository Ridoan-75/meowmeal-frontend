import {
  Search,
  ShoppingCart,
  Zap,
  ThumbsUp,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Find Your Food",
    description:
      "Search from hundreds of restaurants and thousands of menu items near you.",
    gradient: "from-blue-500 to-cyan-400",
    glow: "shadow-blue-500/25",
    iconBg: "bg-blue-500/15 text-blue-500",
  },
  {
    icon: ShoppingCart,
    step: "02",
    title: "Place Your Order",
    description:
      "Add items to cart, choose delivery address and place your order in seconds.",
    gradient: "from-primary to-orange-400",
    glow: "shadow-primary/25",
    iconBg: "bg-primary/15 text-primary",
  },
  {
    icon: Zap,
    step: "03",
    title: "Fast Delivery",
    description:
      "From kitchen to your door in the fastest time possible. Hot, fresh, every time.",
    gradient: "from-purple-500 to-pink-400",
    glow: "shadow-purple-500/25",
    iconBg: "bg-purple-500/15 text-purple-500",
  },
  {
    icon: ThumbsUp,
    step: "04",
    title: "Enjoy Your Meal",
    description:
      "Receive your fresh hot food and enjoy. Rate your experience after.",
    gradient: "from-green-500 to-emerald-400",
    glow: "shadow-green-500/25",
    iconBg: "bg-green-500/15 text-green-500",
  },
];

export function HowItWorks() {
  return (
    <>
      {/* ── How It Works ── */}
      <section className="relative py-24 bg-background overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-500/6 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-primary/20">
              Simple Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              How MeowMeal Works
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
              Order your favorite food in just a few simple steps
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={step.step} className="relative group">
                {/* Connector line — desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(100%-0px)] w-full h-px z-10">
                    <div className="w-full h-px bg-gradient-to-r from-border to-transparent" />
                    <div
                      className={`absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-gradient-to-br ${step.gradient}`}
                    />
                  </div>
                )}

                {/* Glass Card */}
                <div
                  className={`relative flex flex-col gap-5 rounded-3xl p-6 border border-white/60 bg-white/60 backdrop-blur-md hover:shadow-2xl ${step.glow} hover:-translate-y-2 transition-all duration-400 overflow-hidden`}
                >
                  {/* Gradient top bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient} rounded-t-3xl`}
                  />

                  {/* Step number */}
                  <span className="absolute -top-2 -right-2 text-8xl font-black text-foreground/4 select-none pointer-events-none leading-none">
                    {step.step}
                  </span>

                  {/* Icon */}
                  <div
                    className={`h-12 w-12 rounded-2xl ${step.iconBg} flex items-center justify-center shrink-0`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>

                  {/* Step badge */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}
                      >
                        Step {step.step}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base">{step.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Inner glow on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none rounded-3xl`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}