"use client";

import { ArrowRight, CheckCircle, Package, Smile, Star, Zap } from "lucide-react";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

const milestones = [
  {
    year: "2021",
    title: "The Idea",
    description: "MeowMeal was born from a simple frustration — finding good food nearby was too hard. We decided to fix that.",
    icon: Zap,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    year: "2022",
    title: "First 100 Orders",
    description: "We launched with just 5 restaurants. Within a month, we hit 100 orders. The hunger was real.",
    icon: Package,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    year: "2023",
    title: "10,000 Customers",
    description: "Word spread fast. 10,000 happy customers, 500+ restaurants, and a team passionate about food.",
    icon: Smile,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    year: "2024",
    title: "50K+ Deliveries",
    description: "50,000 orders delivered. We refined speed, quality, and reliability. Every meal, on time.",
    icon: Star,
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
  },
];

const whyUs = [
  "Fastest delivery in your city",
  "Handpicked quality restaurants",
  "Real-time order tracking",
  "24/7 customer support",
  "Safe & secure payments",
  "Fresh food, every time",
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">

        {/* ── Hero ── */}
        <section className="relative py-28 overflow-hidden bg-background">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/8 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent/8 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Left */}
              <div className="flex flex-col gap-7">
                <div className="inline-flex w-fit items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-primary/20">
                  Our Story
                </div>
                <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.1]">
                  We are on a{" "}
                  <br />
                  mission to{" "}
                  <span className="text-primary relative">
                    feed
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 12" fill="none">
                      <path d="M2 8.5C20 3 40 1 50 3.5C60 6 80 8 98 5" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </span>{" "}
                  the world
                </h1>
                <p className="text-muted-foreground leading-relaxed text-base max-w-md">
                  MeowMeal started with a simple idea — great food should be available to everyone, everywhere. We connect you with the best local restaurants so you never compromise on taste.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {whyUs.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm text-foreground/70 font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <Link href="/meals">
                    <button className="group flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold text-sm px-7 py-3.5 rounded-2xl shadow-lg shadow-primary/25 transition-all">
                      Order Now
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <Link href="/providers">
                    <button className="flex items-center gap-2 border border-border hover:border-primary hover:text-primary text-sm font-semibold px-7 py-3.5 rounded-2xl transition-all">
                      View Restaurants
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right */}
              <div className="relative flex items-center justify-center">
                <Image
                  src="/three.png"
                  alt="Delivery"
                  width={520}
                  height={520}
                  className="object-contain drop-shadow-2xl"
                  priority
                />
                <div className="absolute top-6 right-0 bg-card border border-border rounded-2xl px-4 py-3 shadow-xl">
                  <p className="text-xs text-muted-foreground">Orders Today</p>
                  <p className="text-2xl font-extrabold text-primary">1,200+</p>
                </div>
                <div className="absolute bottom-6 left-0 bg-card border border-border rounded-2xl px-4 py-3 shadow-xl">
                  <p className="text-xs text-muted-foreground">Avg Delivery</p>
                  <p className="text-2xl font-extrabold text-primary">28 min</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="relative py-24 bg-secondary/30 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-primary/20">
                Our Journey
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                How We Got Here
              </h2>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />

              <div className="flex flex-col gap-12">
                {milestones.map((m, index) => {
                  const isLeft = index % 2 === 0;
                  return (
                    <div key={m.year} className={`relative grid grid-cols-1 md:grid-cols-2 gap-6 items-center`}>

                      {/* Center dot */}
                      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
                        <div className={`h-10 w-10 rounded-full ${m.bg} border-2 ${m.border} flex items-center justify-center shadow-lg`}>
                          <m.icon className={`h-4 w-4 ${m.color}`} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className={`${isLeft ? "md:pr-16 md:text-right md:col-start-1" : "md:pl-16 md:col-start-2"}`}>
                        <div className={`relative bg-card border border-border rounded-3xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden`}>
                          {/* Top bar */}
                          <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r ${m.color.includes("blue") ? "from-blue-500 to-cyan-400" : m.color.includes("primary") ? "from-primary to-orange-400" : m.color.includes("emerald") ? "from-emerald-500 to-teal-400" : "from-accent to-yellow-300"}`} />

                          {/* Year watermark */}
                          <span className="absolute -bottom-3 -right-2 text-7xl font-black text-foreground/4 select-none pointer-events-none leading-none">
                            {m.year}
                          </span>

                          <div className={`flex items-center gap-3 mb-4 ${isLeft ? "md:justify-end" : ""}`}>
                            <div className={`h-9 w-9 rounded-xl ${m.bg} flex items-center justify-center md:hidden`}>
                              <m.icon className={`h-4 w-4 ${m.color}`} />
                            </div>
                            <span className={`text-xs font-black uppercase tracking-widest ${m.color}`}>
                              {m.year}
                            </span>
                          </div>

                          <h3 className="font-extrabold text-lg mb-2">{m.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{m.description}</p>
                        </div>
                      </div>

                      {/* Empty col for alternating */}
                      {isLeft && <div className="hidden md:block md:col-start-2" />}
                      {!isLeft && <div className="hidden md:block md:col-start-1 md:row-start-1" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── App Section ── */}
        <section className="relative py-24 overflow-hidden bg-background">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/6 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 left-0 w-80 h-80 bg-accent/6 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Left — Chef Image */}
              <div className="relative flex items-center justify-center">
                <Image
                  src="/about.png"
                  alt="MeowMeal App"
                  width={540}
                  height={540}
                  className="object-contain drop-shadow-2xl"
                  priority
                />
                <div className="absolute top-6 right-0 bg-card border border-border rounded-2xl px-4 py-3 shadow-xl z-10">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <div>
                      <p className="text-xs font-extrabold">4.9 Rating</p>
                      <p className="text-[10px] text-muted-foreground">10K+ Reviews</p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-6 left-0 bg-card border border-border rounded-2xl px-4 py-3 shadow-xl z-10">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs font-extrabold">50K+</p>
                      <p className="text-[10px] text-muted-foreground">Downloads</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — Content */}
              <div className="flex flex-col gap-7">
                <div className="inline-flex w-fit items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-primary/20">
                  Mobile App
                </div>
                <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight">
                  It&apos;s Now{" "}
                  <span className="text-primary relative">
                    More Easy
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                      <path d="M2 8.5C50 3 100 1 150 3.5C200 6 250 8 298 5" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </span>{" "}
                  to Order by Our{" "}
                  <span className="text-accent">Mobile App</span>
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md">
                  Download the MeowMeal app and get your favorite food delivered in minutes. Available on Android and iOS.
                </p>
                <div className="flex flex-col gap-2.5">
                  {["Order in seconds from your phone", "Real-time delivery tracking", "Exclusive app-only deals"].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground/70">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <button className="flex items-center gap-3 bg-foreground hover:bg-foreground/90 text-background px-5 py-3 rounded-2xl transition-all shadow-lg">
                    <FaGooglePlay className="h-5 w-5 shrink-0" />
                    <div className="text-left">
                      <p className="text-[10px] opacity-70 leading-none">Get it on</p>
                      <p className="text-sm font-bold leading-tight">Google Play</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 bg-foreground hover:bg-foreground/90 text-background px-5 py-3 rounded-2xl transition-all shadow-lg">
                    <FaApple className="h-6 w-6 shrink-0" />
                    <div className="text-left">
                      <p className="text-[10px] opacity-70 leading-none">Download on the</p>
                      <p className="text-sm font-bold leading-tight">App Store</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative py-24 overflow-hidden bg-secondary/30">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/8 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-2xl shadow-primary/8">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

              <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
                {/* Left */}
                <div className="flex flex-col gap-7 p-12 sm:p-16">
                  <div className="inline-flex w-fit items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-primary/20">
                    Join Us
                  </div>
                  <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
                    Ready to experience{" "}
                    <span className="text-primary relative">
                      MeowMeal?
                      <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                        <path d="M2 8.5C50 3 100 1 150 3.5C200 6 250 8 298 5" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    </span>
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                    Join over 10,000 happy customers who order their favorite meals every day. Fast, fresh, and always delicious.
                  </p>
                  <div className="flex items-center gap-8">
                    {[{ value: "10K+", label: "Customers" }, { value: "500+", label: "Restaurants" }, { value: "28 min", label: "Avg Delivery" }].map((s) => (
                      <div key={s.label}>
                        <p className="text-2xl font-extrabold text-primary">{s.value}</p>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Link href="/meals">
                      <button className="group flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-primary/25 transition-all">
                        Start Ordering
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                    <Link href="/register?role=PROVIDER">
                      <button className="flex items-center gap-2 border border-border hover:border-primary hover:text-primary text-sm font-bold px-8 py-3.5 rounded-2xl transition-all">
                        Become a Partner
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Right — illustration */}
                <div className="relative flex items-end justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-primary/8 h-full min-h-[380px] overflow-hidden">
                  <div className="absolute top-0 right-0 w-56 h-56 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-44 h-44 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
                  <Image src="/one.png" alt="Chef" width={400} height={400} className="object-contain drop-shadow-xl relative z-10" />
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}