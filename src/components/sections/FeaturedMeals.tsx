"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
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
      // response structure: { data: Meal[] } or { data: { meals: Meal[] } }
      const raw = res.data.data;
      return (Array.isArray(raw) ? raw : raw?.meals || []) as Meal[];
    },
  });

  const meals = Array.isArray(data) ? data : [];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
              Popular Now
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Featured Meals
            </h2>
          </div>
          <button
            onClick={() => router.push("/meals")}
            className="group flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
          >
            View all
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
        </div>

        {/* Empty State */}
        {!isLoading && meals.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No meals available right now.</p>
          </div>
        )}
      </div>
    </section>
  );
}