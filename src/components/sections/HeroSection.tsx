"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const heroStats = [
  { value: "500+", label: "Restaurants" },
  { value: "10K+", label: "Happy Customers" },
  { value: "50K+", label: "Orders Delivered" },
];

export function HeroSection() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/meals?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <section className="relative min-h-[65vh] flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Free delivery on your first order
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Delicious Food{" "}
              <span className="text-primary">Delivered</span>{" "}
              To Your Door
            </h1>

            <p className="text-lg text-muted-foreground max-w-md">
              Order from the best restaurants in your city. Fast delivery,
              fresh food, every time.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for food, restaurants..."
                  className="pl-10 h-12 bg-background border-border"
                />
              </div>
              <Button
                type="submit"
                className="h-12 px-6 bg-primary hover:bg-primary-hover text-white shrink-0"
              >
                Search
              </Button>
            </form>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              Delivering to{" "}
              <span className="font-medium text-foreground">
                Dhaka, Bangladesh
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-2">
              {heroStats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-2xl font-bold text-primary">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                onClick={() => router.push("/meals")}
                className="bg-primary hover:bg-primary-hover text-white h-11 px-6"
              >
                Order Now
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/providers")}
                className="h-11 px-6 border-primary text-primary hover:bg-primary/5"
              >
                View Restaurants
              </Button>
            </div>
          </div>

          {/* Right Content — Food Image */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="relative w-full max-w-lg aspect-square">
              {/* Floating cards */}
              <div className="absolute top-8 -left-4 bg-background border border-border rounded-2xl p-3 shadow-lg flex items-center gap-2 z-10">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
                  🍔
                </div>
                <div>
                  <p className="text-xs font-semibold">Burger King</p>
                  <p className="text-xs text-muted-foreground">25-30 min</p>
                </div>
              </div>

              <div className="absolute bottom-8 -right-4 bg-background border border-border rounded-2xl p-3 shadow-lg flex items-center gap-2 z-10">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-xl">
                  ⭐
                </div>
                <div>
                  <p className="text-xs font-semibold">Top Rated</p>
                  <p className="text-xs text-muted-foreground">4.9 Rating</p>
                </div>
              </div>

              {/* Main food image */}
              <div className="w-full h-full rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-9xl">
                🍱
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}