"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Star, ShoppingBag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

const heroStats = [
  { value: "500+", label: "Restaurants" },
  { value: "10K+", label: "Happy Customers" },
  { value: "50K+", label: "Orders Delivered" },
];

export function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/meals?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <section className="relative min-h-[65vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/8" />

      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Bottom orange fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ── Left Content ── */}
          <div className="flex flex-col gap-6 order-1">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-primary/20">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              People Trust Us
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
              Order from the best restaurants in your city. Fast delivery, fresh
              food, every time.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 bg-card border border-border rounded-2xl px-4 py-2.5 shadow-md shadow-primary/5 max-w-md focus-within:border-primary transition-all"
            >
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Search className="h-3.5 w-3.5 text-primary" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for food, restaurants..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-4 py-1.5 rounded-xl transition-all"
              >
                Search
              </button>
            </form>

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
                className="bg-primary hover:bg-primary/90 text-white h-12 px-7 rounded-2xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
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

          {/* ── Right Content — Image ── */}
          {/* ── Right Content — Image ── */}
          <div className="flex flex-col items-center order-2">
            <div className="relative w-full max-w-xl lg:max-w-2xl">
              {/* Image — natural size, no fill */}
              <div className="relative w-full">
                <Image
                  src="/hero.png"
                  alt="Delicious food"
                  width={1440}
                  height={788}
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  priority
                />

                {/* Floating — Rating */}
                <div className="absolute top-[15%] left-4 bg-background/90 backdrop-blur-sm border border-border rounded-2xl px-3 py-2 shadow-xl z-10">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-sm font-bold">4.9</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Top Rated</p>
                </div>

                {/* Floating — Orders */}
                <div className="absolute top-[15%] right-4 bg-background/90 backdrop-blur-sm border border-border rounded-2xl p-2.5 shadow-xl z-10">
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
              </div>

              {/* Orange glow under image */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-10 bg-primary/20 blur-2xl rounded-full pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
