import { Search, ShoppingCart, Clock, ThumbsUp, Users, Store, ShoppingBag, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Find Your Food",
    description: "Search from hundreds of restaurants and thousands of menu items near you.",
    color: "bg-blue-500/10 text-blue-500",
    border: "border-blue-500/20",
  },
  {
    icon: ShoppingCart,
    step: "02",
    title: "Place Your Order",
    description: "Add items to cart, choose delivery address and place your order in seconds.",
    color: "bg-primary/10 text-primary",
    border: "border-primary/20",
  },
  {
    icon: Clock,
    step: "03",
    title: "Track in Real-time",
    description: "Get live updates as your order is prepared and on its way to you.",
    color: "bg-purple-500/10 text-purple-500",
    border: "border-purple-500/20",
  },
  {
    icon: ThumbsUp,
    step: "04",
    title: "Enjoy Your Meal",
    description: "Receive your fresh hot food and enjoy. Rate your experience after.",
    color: "bg-green-500/10 text-green-500",
    border: "border-green-500/20",
  },
];

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Happy Customers",
    color: "text-blue-400",
    bg: "bg-blue-500/15",
  },
  {
    icon: Store,
    value: "500+",
    label: "Restaurants",
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
  },
  {
    icon: ShoppingBag,
    value: "50,000+",
    label: "Orders Delivered",
    color: "text-purple-400",
    bg: "bg-purple-500/15",
  },
  {
    icon: Star,
    value: "4.8",
    label: "Average Rating",
    color: "text-yellow-400",
    bg: "bg-yellow-500/15",
  },
];

export function HowItWorks() {
  return (
    <>
      {/* How It Works */}
      <section className="py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
              Simple Process
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              How MeowMeal Works
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Order your favorite food in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className="relative flex flex-col gap-4 bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300"
              >
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-6 w-6 rounded-full bg-background border border-border items-center justify-center shadow-sm">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M1 5H9M9 5L5.5 1.5M9 5L5.5 8.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                      />
                    </svg>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-xl ${step.color} border ${step.border} flex items-center justify-center shrink-0`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="text-3xl font-black text-foreground/25">
                    {step.step}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="font-bold text-sm">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className={`absolute bottom-0 left-6 right-6 h-0.5 rounded-full ${step.color.split(" ")[0]} opacity-60`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
              Our Numbers
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Trusted by Thousands
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center gap-4 bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`h-14 w-14 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-extrabold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}