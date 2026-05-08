"use client";

import { useRouter } from "next/navigation";
import {
  ChevronRight,
  MapPin,
  Star,
  Clock,
  ShoppingBag,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";

interface Meal {
  id: string;
  title: string;
  price: number;
  prepTime: number;
  avgRating: number;
  images: string[];
  provider?: {
    shopName: string;
  };
}

const heroStats = [
  { value: "500+", label: "Restaurants" },
  { value: "10K+", label: "Happy Customers" },
  { value: "50K+", label: "Orders Delivered" },
];

export function HeroSection() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fetch meals from API — seller uploaded images
  const { data: meals, isLoading } = useQuery({
    queryKey: ["hero-meals"],
    queryFn: async () => {
      const res = await api.get("/meals?limit=6&sortBy=createdAt&sortOrder=desc");
      return res.data.data;
    },
  });

  const slides = meals?.filter((m: Meal) => m.images?.[0]) || [];

  const goNext = () => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 300);
  };

  const goPrev = () => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(goNext, 4000);
    return () => clearInterval(timer);
  }, [current, slides.length]);

  const slide = slides[current];

  return (
    <section className="relative min-h-[65vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/8" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left Content */}
          <div className="flex flex-col gap-6 order-1">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-primary/20">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Free delivery on your first order
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
              Delicious Food{" "}
              <span className="text-primary relative">
                Delivered
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 8.5C50 3 100 1 150 3.5C200 6 250 8 298 5"
                    stroke="#FF6B35"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              To Your Door
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed">
              Order from the best restaurants in your city. Fast delivery,
              fresh food, every time.
            </p>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="h-3.5 w-3.5 text-primary" />
              </div>
              Delivering to{" "}
              <span className="font-semibold text-foreground ml-1">
                Dhaka, Bangladesh
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 sm:gap-10">
              {heroStats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-primary">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                onClick={() => router.push("/meals")}
                className="bg-primary hover:bg-primary-hover text-white h-12 px-7 rounded-2xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
              >
                Order Now
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/providers")}
                className="h-12 px-7 rounded-2xl font-semibold border-border hover:border-primary hover:text-primary transition-all"
              >
                View Restaurants
              </Button>
            </div>
          </div>

          {/* Right Content — Slider */}
          <div className="flex flex-col items-center gap-4 order-2">
            <div className="relative w-full max-w-lg">

              {/* Main Slider Image */}
              {isLoading ? (
                <Skeleton className="w-full h-80 sm:h-96 rounded-3xl" />
              ) : (
                <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl shadow-primary/15">
                  {slide && (
                    <div
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        isTransitioning ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      <Image
                        src={slide.images[0]}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Slide Info */}
                  {slide && (
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p
                        className={`text-white font-bold text-xl transition-all duration-300 ${
                          isTransitioning
                            ? "opacity-0 translate-y-2"
                            : "opacity-100 translate-y-0"
                        }`}
                      >
                        {slide.title}
                      </p>
                      <div
                        className={`flex items-center gap-3 mt-1.5 transition-all duration-300 delay-75 ${
                          isTransitioning
                            ? "opacity-0 translate-y-2"
                            : "opacity-100 translate-y-0"
                        }`}
                      >
                        <span className="text-primary font-bold text-sm">
                          ৳{slide.price}
                        </span>
                        <div className="flex items-center gap-1 text-white/80 text-xs">
                          <Clock className="h-3 w-3" />
                          {slide.prepTime} min
                        </div>
                        {slide.avgRating > 0 && (
                          <div className="flex items-center gap-1 text-white/80 text-xs">
                            <Star className="h-3 w-3 fill-accent text-accent" />
                            {slide.avgRating?.toFixed(1)}
                          </div>
                        )}
                        <span className="text-xs text-white/60 truncate max-w-[100px]">
                          {slide.provider?.shopName}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Floating Card — Orders */}
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm border border-border rounded-2xl p-2.5 shadow-xl z-10">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                        <ShoppingBag className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">50K+ Orders</p>
                        <p className="text-xs text-muted-foreground">Delivered</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Rating Card */}
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded-2xl px-3 py-2 shadow-xl z-10">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="text-sm font-bold">4.9</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Top Rated</p>
                  </div>
                </div>
              )}

              {/* Prev/Next + Dots Row */}
              <div className="flex items-center justify-between mt-4 px-1">
                {/* Dots */}
                <div className="flex items-center gap-2">
                  {slides.map((_: Meal, i: number) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === current
                          ? "w-6 bg-primary"
                          : "w-2 bg-border hover:bg-primary/50"
                      }`}
                    />
                  ))}
                </div>

                {/* Prev/Next Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={goPrev}
                    className="h-9 w-9 rounded-xl bg-card border border-border hover:bg-primary/10 hover:border-primary flex items-center justify-center text-foreground transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={goNext}
                    className="h-9 w-9 rounded-xl bg-card border border-border hover:bg-primary/10 hover:border-primary flex items-center justify-center text-foreground transition-all"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Row */}
              {slides.length > 1 && (
                <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
                  {slides.map((s: Meal, i: number) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrent(i)}
                      className={`relative h-14 w-14 rounded-xl overflow-hidden shrink-0 transition-all ${
                        i === current
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={s.images[0]}
                        alt={s.title}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}