"use client"
import {
  ShoppingBag,
  Clock,
  CalendarCheck,
  ChefHat,
  Sparkles,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const features = [
  { icon: ShoppingBag, label: "Online Order" },
  { icon: Clock, label: "24/7 Service" },
  { icon: CalendarCheck, label: "Pre-Reservation" },
  { icon: Sparkles, label: "Organized Food Place" },
  { icon: ChefHat, label: "Super Chef" },
  { icon: HeartHandshake, label: "Clean Kitchen" },
];

export function ChefSection() {
  const router = useRouter();

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/6 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left — Chef Image ── */}
          <div className="relative flex items-center justify-center order-2 lg:order-1">

            {/* Outer decorative ring */}
            <div className="absolute w-[380px] h-[380px] sm:w-[440px] sm:h-[440px] rounded-full border-2 border-dashed border-primary/20 animate-spin-slow" />

            {/* Orange filled circle bg */}
            <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full bg-gradient-to-br from-primary/15 via-accent/10 to-primary/5 border border-primary/10 flex items-center justify-center overflow-hidden shadow-2xl shadow-primary/10">
              <Image
                src="/chef.png"
                alt="Our Chef"
                fill
                className="object-cover object-top"
                priority
              />
            </div>

            {/* Floating badge — top right */}
            <div className="absolute top-4 right-4 sm:top-8 sm:right-0 bg-white/80 backdrop-blur-sm border border-border rounded-2xl px-4 py-2.5 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ChefHat className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold">Pro Chefs</p>
                  <p className="text-xs text-muted-foreground">Certified</p>
                </div>
              </div>
            </div>

            {/* Floating badge — bottom left */}
            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-0 bg-white/80 backdrop-blur-sm border border-border rounded-2xl px-4 py-2.5 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-bold">Fresh Daily</p>
                  <p className="text-xs text-muted-foreground">Ingredients</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right — Content ── */}
          <div className="flex flex-col gap-7 order-1 lg:order-2">

            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-primary/20">
              Why Choose Us
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
              We are{" "}
              <span className="text-primary">more</span> than just{" "}
              <span className="text-accent">multiple</span> services
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
              We connect you with the best restaurants and home chefs in your city.
              From quick bites to full meals — fresh, fast, and always delicious.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group"
                >
                  <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold">{feature.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div>
              <button
                onClick={() => router.push("/about")}
                className="group inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold text-sm px-7 py-3 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
              >
                About Us
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}