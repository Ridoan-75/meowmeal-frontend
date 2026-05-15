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
      const res = await api.get(
        "/meals?limit=8&sortBy=createdAt&sortOrder=desc",
      );
      const raw = res.data.data;
      return (Array.isArray(raw) ? raw : raw?.meals || []) as Meal[];
    },
  });

  const meals = Array.isArray(data) ? data : [];

  return (
    <section className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="h-1 w-6 rounded-full bg-primary" />
              <p className="text-sm font-semibold text-primary uppercase tracking-wider">
                Popular Now
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Featured Meals
            </h2>
          </div>

          <button
            onClick={() => router.push("/meals")}
            className="group flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/15 px-4 py-2 rounded-full transition-all"
          >
            View all
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : meals.map((meal) => <MealCard key={meal.id} meal={meal} />)}
        </div>

        {/* Empty State */}
        {!isLoading && meals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
              🍽️
            </div>
            <p className="text-base font-semibold text-foreground">
              No meals available right now
            </p>
            <p className="text-sm text-muted-foreground">
              Check back soon — new meals are on the way!
            </p>
          </div>
        )}

        {/* Bottom View All Button */}
        {!isLoading && meals.length > 0 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => router.push("/meals")}
              className="group flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold text-sm px-8 py-3 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
            >
              View All Meals
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
