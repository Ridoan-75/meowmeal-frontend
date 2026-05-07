"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { MealCard } from "@/components/common/MealCard";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import api from "@/lib/axios";
import { Meal } from "@/types";

export function FeaturedMeals() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["featured-meals"],
    queryFn: async () => {
      const res = await api.get("/meals?limit=8&sortBy=createdAt&sortOrder=desc");
      return res.data.data as Meal[];
    },
  });

  return (
    <section className="py-16 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Featured Meals</h2>
            <p className="text-muted-foreground mt-1">
              Most popular dishes right now
            </p>
          </div>
          <button
            onClick={() => router.push("/meals")}
            className="flex items-center gap-1 text-sm text-primary hover:underline font-medium"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : data?.map((meal) => <MealCard key={meal.id} meal={meal} />)}
        </div>
      </div>
    </section>
  );
}