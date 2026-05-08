"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, Phone, Store, ChevronLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MealCard } from "@/components/common/MealCard";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import api from "@/lib/axios";
import { Meal } from "@/types";

export default function ProviderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: provider, isLoading } = useQuery({
    queryKey: ["provider", id],
    queryFn: async () => {
      const res = await api.get(`/providers/${id}`);
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <>
        <main className="min-h-screen bg-background">
          <Skeleton className="h-48 w-full rounded-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!provider) {
    return (
      <>
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Store className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Restaurant not found</h2>
            <Button onClick={() => router.push("/providers")}>
              Browse Restaurants
            </Button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-background">
        {/* Cover Image */}
        <div className="relative h-48 sm:h-64 w-full bg-gradient-to-br from-primary/20 to-accent/20">
          {provider.coverImage && (
            <Image
              src={provider.coverImage}
              alt={provider.shopName}
              fill
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-4 left-4 sm:left-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 text-white/80 hover:text-white text-sm mb-2 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Provider Info */}
          <div className="relative -mt-8 mb-8">
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Logo */}
              <div className="h-16 w-16 rounded-2xl border-2 border-background bg-background overflow-hidden shadow-lg shrink-0">
                {provider.logo ? (
                  <Image
                    src={provider.logo}
                    alt={provider.shopName}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                    <Store className="h-7 w-7 text-primary" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold">{provider.shopName}</h1>
                  {provider.isVerified && (
                    <Badge className="bg-blue-500/10 text-blue-600 border-0 text-xs">
                      Verified
                    </Badge>
                  )}
                  <Badge
                    className={
                      provider.isOpen
                        ? "bg-green-500/10 text-green-600 border-0 text-xs"
                        : "bg-red-500/10 text-red-600 border-0 text-xs"
                    }
                  >
                    {provider.isOpen ? "Open Now" : "Closed"}
                  </Badge>
                </div>

                {provider.description && (
                  <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                    {provider.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-primary" />
                    {provider.address}, {provider.city}
                  </div>
                  {provider.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-primary" />
                      {provider.phone}
                    </div>
                  )}
                  {provider._count && (
                    <div className="flex items-center gap-1">
                      <Store className="h-3 w-3 text-primary" />
                      {provider._count.meals} menu items
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-6">Menu</h2>
            {provider.meals && provider.meals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {provider.meals.map((meal: Meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-card border border-border rounded-2xl">
                <Store className="h-10 w-10 text-muted-foreground/20 mb-3" />
                <p className="font-medium mb-1">No meals available</p>
                <p className="text-sm text-muted-foreground">
                  This restaurant has not added any meals yet
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}