"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Trash2 } from "lucide-react";
import { MealCard } from "@/components/common/MealCard";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { Meal } from "@/types";
import { toast } from "sonner";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlistStore";
import { useEffect } from "react";

export default function WishlistPage() {
  const queryClient = useQueryClient();
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

  // Sync wishlist store with DB
  useEffect(() => {
    if (data?.data) {
      setWishlistedIds(data.data.map((m) => m.id));
    }
  }, [data]);

  const meals = data?.data || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            My Wishlist
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {meals.length > 0
              ? `${meals.length} saved meals`
              : "No saved meals yet"}
          </p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : meals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-2xl">
          <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-lg font-bold mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm">
            Save your favorite meals by clicking the heart icon on any meal card.
          </p>
          <Link href="/meals">
            <Button className="bg-primary hover:bg-primary-hover text-white rounded-xl">
              Browse Meals
            </Button>
          </Link>
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