"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Sparkles, RefreshCw, Wand2 } from "lucide-react";
import { MealCard } from "@/components/common/MealCard";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import api from "@/lib/axios";
import { Meal } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RecommendedMeal extends Meal {
  reason: string;
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<RecommendedMeal[]>([]);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.get("/ai/recommendations");
      return res.data.data as RecommendedMeal[];
    },
    onSuccess: (data) => {
      setRecommendations(data);
      toast.success(`${data.length} recommendations generated!`, { duration: 2000 });
    },
    onError: () => {
      toast.error("No order history found. Place some orders first!");
    },
  });

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Recommendations
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Personalized meal suggestions based on your order history
          </p>
        </div>

        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className={cn(
            "flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer w-fit",
            "bg-primary hover:brightness-110 active:scale-[0.98]",
            "shadow-[0_2px_8px_rgba(0,0,0,0.15)]",
            "disabled:opacity-60 disabled:cursor-not-allowed"
          )}
        >
          {mutation.isPending ? (
            <>
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              {recommendations.length > 0 ? "Regenerate" : "Get Recommendations"}
            </>
          )}
        </button>
      </div>

      {/* AI Info Banner */}
      {recommendations.length === 0 && !mutation.isPending && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Wand2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">How it works</p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Our AI analyzes your order history and preferences to suggest meals
              you will love. The more you order, the better the recommendations get.
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {mutation.isPending && (
        <>
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-3">
            <span className="h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin shrink-0" />
            <div>
              <p className="text-sm font-semibold text-primary">AI is analyzing your taste...</p>
              <p className="text-xs text-muted-foreground mt-0.5">Looking at your order history and preferences</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </>
      )}

      {/* Results */}
      {!mutation.isPending && recommendations.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-muted-foreground">
              {recommendations.length} meals recommended for you
            </p>
            <div className="flex items-center gap-1.5 text-xs text-primary font-semibold bg-primary/10 px-3 py-1.5 rounded-xl">
              <Sparkles className="h-3 w-3" />
              AI Powered
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((meal, index) => (
              <div key={meal.id} className="flex flex-col gap-2">
                {/* Rank Badge */}
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground truncate">
                    #{index + 1} Pick for you
                  </span>
                </div>

                <MealCard meal={meal} />

                {/* AI Reason */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl px-3 py-2.5 flex items-start gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-primary leading-relaxed">{meal.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!mutation.isPending && recommendations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-2xl gap-5">
          <div className="relative">
            <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-accent flex items-center justify-center">
              <Wand2 className="h-3 w-3 text-white" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Get Personalized Recommendations</h3>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Our AI analyzes your order history and suggests meals you all love.
              Click below to get started!
            </p>
          </div>

          <button
            onClick={() => mutation.mutate()}
            className={cn(
              "flex items-center gap-2 h-11 px-7 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer",
              "bg-primary hover:brightness-110 active:scale-[0.98]",
              "shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
            )}
          >
            <Sparkles className="h-4 w-4" />
            Generate Recommendations
          </button>
        </div>
      )}
    </div>
  );
}