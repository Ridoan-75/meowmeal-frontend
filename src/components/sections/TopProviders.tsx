"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronRight, Store, MapPin } from "lucide-react";
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Top Restaurants
            </h2>
            <p className="text-muted-foreground mt-1">
              Most loved restaurants in your city
            </p>
          </div>
          <button
            onClick={() => router.push("/providers")}
            className="flex items-center gap-1 text-sm text-primary hover:underline font-medium"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-2xl overflow-hidden"
                >
                  <Skeleton className="h-32 w-full rounded-none" />
                  <div className="p-4 flex flex-col gap-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-full rounded-lg mt-2" />
                  </div>
                </div>
              ))
            : data?.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                >
                  {/* Cover Image */}
                  <div className="relative h-32 w-full bg-gradient-to-br from-primary/20 to-accent/20">
                    {provider.coverImage && (
                      <Image
                        src={provider.coverImage}
                        alt={provider.shopName}
                        fill
                        className="object-cover"
                      />
                    )}
                    {/* Logo */}
                    <div className="absolute -bottom-5 left-4">
                      <div className="h-12 w-12 rounded-xl border-2 border-background bg-background overflow-hidden shadow-md">
                        {provider.logo ? (
                          <Image
                            src={provider.logo}
                            alt={provider.shopName}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                            <Store className="h-5 w-5 text-primary" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Open/Close Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge
                        className={
                          provider.isOpen
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }
                      >
                        {provider.isOpen ? "Open" : "Closed"}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 pt-8 flex flex-col flex-1 gap-1">
                    <h3 className="font-semibold truncate">
                      {provider.shopName}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {provider.city}
                    </div>
                    {provider._count && (
                      <p className="text-xs text-muted-foreground">
                        {provider._count.meals} menu items
                      </p>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-auto w-full border-primary text-primary hover:bg-primary/5 mt-3"
                      onClick={() => router.push(`/providers/${provider.id}`)}
                    >
                      View Menu
                    </Button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}