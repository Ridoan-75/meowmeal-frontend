"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, ArrowRight, Sparkles } from "lucide-react";
import { MealCard } from "@/components/common/MealCard";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import api from "@/lib/axios";
import { Meal } from "@/types";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/utils";

export default function WishlistPage() {
  const { setWishlistedIds } = useWishlistStore();

  const { data, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await api.get("/wishlist");
      return res.data as {
        data: Meal[];
        meta: { total: number; totalPages: number };
      };
    },
  });

  useEffect(() => {
    if (data?.data) {
      setWishlistedIds(data.data.map((m) => m.id));
    }
  }, [data]);

  const meals = data?.data || [];

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            My Wishlist
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {meals.length > 0
              ? `${meals.length} saved meal${meals.length > 1 ? "s" : ""}`
              : "Save your favorite meals"}
          </p>
        </div>

        {meals.length > 0 && (
          <Link
            href="/meals"
            className="flex items-center gap-2 h-9 px-4 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-all cursor-pointer w-fit"
          >
            Browse More
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Stats Banner */}
      {meals.length > 0 && !isLoading && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">
              You have {meals.length} saved meal{meals.length > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click the heart on any meal to remove it from your wishlist
            </p>
          </div>
          <Link
            href="/dashboard/customer/recommendations"
            className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Get AI picks
          </Link>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : meals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-2xl gap-5">
          <div className="relative">
            <div className="h-20 w-20 rounded-3xl bg-red-500/10 flex items-center justify-center">
              <Heart className="h-10 w-10 text-red-400" />
            </div>
            <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Your wishlist is empty</h3>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Save your favorite meals by clicking the heart icon on any meal card.
              They will appear here for easy access!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/meals"
              className={cn(
                "flex items-center gap-2 h-10 px-6 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer",
                "bg-primary hover:brightness-110 active:scale-[0.98]",
                "shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
              )}
            >
              Browse Meals
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/customer/recommendations"
              className="flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold border border-border hover:bg-muted transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              AI Picks
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
}