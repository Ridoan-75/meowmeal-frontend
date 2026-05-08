"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Store, MapPin, UtensilsCrossed, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { ProviderProfile } from "@/types";

export function TopProviders() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["top-providers"],
    queryFn: async () => {
      const res = await api.get("/providers?limit=8");
      return res.data.data as ProviderProfile[];
    },
  });

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
              Top Picks
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Top Restaurants
            </h2>
          </div>
          <button
            onClick={() => router.push("/providers")}
            className="group flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
          >
            View all
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-2xl overflow-hidden"
                >
                  <Skeleton className="h-44 w-full rounded-none" />
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
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                  {/* Cover Image */}
                  <div className="relative h-44 w-full overflow-hidden">
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

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

                    {/* Top row — Open badge left, Rating right */}
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

                      {/* Rating from DB */}
                      <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        <span className="text-white text-xs font-bold">
                          {provider.avgRating
                            ? provider.avgRating.toFixed(1)
                            : "New"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Logo — between cover and content */}
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
                      className="group/btn mt-auto w-full h-11 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold shadow-sm shadow-primary/20 transition-all mt-3"
                      onClick={() => router.push(`/providers/${provider.id}`)}
                    >
                      View Menu
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1.5 transition-transform duration-200" />
                    </Button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
