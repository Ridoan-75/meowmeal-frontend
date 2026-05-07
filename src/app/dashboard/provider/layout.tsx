"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealCard } from "@/components/common/MealCard";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import api from "@/lib/axios";
import { Meal } from "@/types";
import toast from "react-hot-toast";

interface RecommendedMeal extends Meal {
  reason: string;
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<RecommendedMeal[]>(
    []
  );

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.get("/ai/recommendations");
      return res.data.data as RecommendedMeal[];
    },
    onSuccess: (data) => {
      setRecommendations(data);
    },
    onError: () => {
      toast.error(
        "No order history found. Place some orders first to get recommendations!"
      );
    },
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Recommendations
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Personalized meal suggestions based on your order history
          </p>
        </div>
        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="bg-primary hover:bg-primary-hover text-white gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${mutation.isPending ? "animate-spin" : ""}`}
          />
          {mutation.isPending ? "Generating..." : "Get Recommendations"}
        </Button>
      </div>

      {/* Content */}
      {mutation.isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.map((meal) => (
              <div key={meal.id} className="flex flex-col gap-2">
                <MealCard meal={meal} />
                <div className="bg-primary/5 border border-primary/20 rounded-xl px-3 py-2">
                  <p className="text-xs text-primary flex items-start gap-1.5">
                    <Sparkles className="h-3 w-3 mt-0.5 shrink-0" />
                    {meal.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-2xl">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Get Personalized Recommendations
          </h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            Our AI analyzes your order history and suggests meals you will love.
            Click the button above to get started.
          </p>
          <Button
            onClick={() => mutation.mutate()}
            className="bg-primary hover:bg-primary-hover text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Recommendations
          </Button>
        </div>
      )}
    </div>
  );
}