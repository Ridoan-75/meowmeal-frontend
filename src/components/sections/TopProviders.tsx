"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Store, MapPin, UtensilsCrossed, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { ProviderProfile } from "@/types";
import { useRef } from "react";

export function TopProviders() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["top-providers"],
    queryFn: async () => {
      const res = await api.get("/providers?limit=8");
      return res.data.data as ProviderProfile[];
    },
  });

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "right" ? 320 : -320,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative py-20 bg-secondary/30 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-accent/6 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="h-1 w-6 rounded-full bg-primary" />
              <p className="text-sm font-semibold text-primary uppercase tracking-wider">
                Top Picks
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Top Restaurants
            </h2>
          </div>

          {/* View all — header */}
          <button
            onClick={() => router.push("/providers")}
            className="group flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/15 px-4 py-2 rounded-full transition-all"
          >
            View all
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Scroll Row */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-3 scrollbar-none scroll-smooth"
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-3xl overflow-hidden shrink-0 w-[260px]"
                >
                  <Skeleton className="h-40 w-full rounded-none" />
                  <div className="flex justify-center -mt-7 mb-2">
                    <Skeleton className="h-14 w-14 rounded-2xl" />
                  </div>
                  <div className="px-5 pb-5 flex flex-col gap-3">
                    <Skeleton className="h-5 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                    <Skeleton className="h-11 w-full rounded-xl mt-1" />
                  </div>
                </div>
              ))
            : data?.map((provider) => (
                <div
                  key={provider.id}
                  className="group bg-card border border-border rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/8 hover:-translate-y-1.5 transition-all duration-300 flex flex-col shrink-0 w-[260px]"
                >
                  {/* Cover Image */}
                  <div className="relative h-40 w-full overflow-hidden">
                    {provider.coverImage ? (
                      <Image
                        src={provider.coverImage}
                        alt={provider.shopName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Store className="h-12 w-12 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <Badge
                        className={`text-xs font-semibold border-0 ${
                          provider.isOpen
                            ? "bg-green-500/90 text-white"
                            : "bg-red-500/90 text-white"
                        }`}
                      >
                        {provider.isOpen ? "Open" : "Closed"}
                      </Badge>
                      <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        <span className="text-white text-xs font-bold">
                          {provider.avgRating ? provider.avgRating.toFixed(1) : "New"}
                        </span>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card to-transparent" />
                  </div>

                  {/* Logo */}
                  <div className="flex justify-center -mt-7 relative z-10">
                    <div className="h-14 w-14 rounded-2xl border-2 border-background bg-background overflow-hidden shadow-lg">
                      {provider.logo ? (
                        <Image
                          src={provider.logo}
                          alt={provider.shopName}
                          width={56}
                          height={56}
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                          <Store className="h-6 w-6 text-primary" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-5 pb-5 pt-3 flex flex-col flex-1 gap-2 items-center text-center">
                    <h3 className="font-bold text-base truncate w-full">
                      {provider.shopName}
                    </h3>
                    <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {provider.city}
                      </div>
                      {provider._count && (
                        <div className="flex items-center gap-1">
                          <UtensilsCrossed className="h-3 w-3" />
                          {provider._count.meals} items
                        </div>
                      )}
                    </div>
                    {provider.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {provider.description}
                      </p>
                    )}
                    <Button
                      className="mt-auto w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-sm shadow-primary/20 transition-all mt-3"
                      onClick={() => router.push(`/providers/${provider.id}`)}
                    >
                      View Menu
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </div>
                </div>
              ))}
        </div>

        {/* Bottom — Arrows + View All */}
        {!isLoading && (
          <div className="flex items-center justify-center gap-4 mt-8">
            {/* Left Arrow */}
            <button
              onClick={() => scroll("left")}
              className="h-10 w-10 rounded-full bg-card border border-border hover:bg-primary/10 hover:border-primary flex items-center justify-center transition-all shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* View All Button */}
            <button
              onClick={() => router.push("/providers")}
              className="group flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold text-sm px-8 py-3 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
            >
              View All Restaurants
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => scroll("right")}
              className="h-10 w-10 rounded-full bg-card border border-border hover:bg-primary/10 hover:border-primary flex items-center justify-center transition-all shadow-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}