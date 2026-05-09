"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Star, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { Meal } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReviewAnalysis {
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  commonPraises?: string[];
  commonComplaints?: string[];
  suggestions?: string;
}

interface CustomerReview {
  id: string;
  rating: number;
  comment: string;
  sentiment?: string;
  createdAt: string;
  customer: { name: string };
}

export default function ProviderReviewsPage() {
  const [selectedMealId, setSelectedMealId] = useState("");
  const [analysis, setAnalysis] = useState<ReviewAnalysis | null>(null);

  const { data: meals } = useQuery({
    queryKey: ["provider-meals-list"],
    queryFn: async () => {
      const profileRes = await api.get("/providers/me/profile");
      const providerId = profileRes.data.data.id;
      const res = await api.get(`/meals/provider/${providerId}?limit=100`);
      return res.data.data as Meal[];
    },
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["meal-reviews", selectedMealId],
    queryFn: async () => {
      const res = await api.get(`/reviews?mealId=${selectedMealId}&limit=20`);
      return res.data.data as CustomerReview[];
    },
    enabled: !!selectedMealId,
  });

  const analysisMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/ai/analyze-reviews", { mealId: selectedMealId });
      return res.data.data;
    },
    onSuccess: (data) => {
      setAnalysis(data);
      toast.success("Sentiment analysis complete!", { duration: 2000 });
    },
    onError: () => toast.error("Failed to analyze reviews"),
  });

  const avgRating = reviews?.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Star className="h-6 w-6 text-accent" />
            Reviews & AI Analysis
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            View customer reviews and get AI-powered insights
          </p>
        </div>

        {/* Meal Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <Select
            value={selectedMealId}
            onValueChange={(val) => { setSelectedMealId(val); setAnalysis(null); }}
          >
            <SelectTrigger className="w-64 rounded-xl h-10">
              <SelectValue placeholder="Select a meal..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {meals?.map((meal) => (
                <SelectItem key={meal.id} value={meal.id}>{meal.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedMealId && reviews && reviews.length > 0 && (
            <button
              onClick={() => analysisMutation.mutate()}
              disabled={analysisMutation.isPending}
              className={cn(
                "flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer",
                "bg-primary hover:brightness-110 active:scale-[0.98]",
                "shadow-[0_2px_8px_rgba(0,0,0,0.15)]",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
            >
              {analysisMutation.isPending ? (
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {analysisMutation.isPending ? "Analyzing..." : "AI Analysis"}
            </button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      {selectedMealId && reviews && reviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-1">
            <p className="text-xs text-muted-foreground font-medium">Total Reviews</p>
            <p className="text-2xl font-extrabold">{reviews.length}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-1">
            <p className="text-xs text-muted-foreground font-medium">Avg Rating</p>
            <div className="flex items-center gap-1.5">
              <p className="text-2xl font-extrabold">{avgRating.toFixed(1)}</p>
              <Star className="h-5 w-5 fill-accent text-accent" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-1">
            <p className="text-xs text-muted-foreground font-medium">5 Star</p>
            <p className="text-2xl font-extrabold text-green-600">
              {reviews.filter((r) => r.rating === 5).length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-1">
            <p className="text-xs text-muted-foreground font-medium">1-2 Star</p>
            <p className="text-2xl font-extrabold text-red-500">
              {reviews.filter((r) => r.rating <= 2).length}
            </p>
          </div>
        </div>
      )}

      {/* AI Analysis */}
      {analysis && (
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm">AI Sentiment Analysis</p>
              <p className="text-xs text-muted-foreground">Powered by Gemini AI</p>
            </div>
          </div>

          {/* Sentiment Counts */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-500/10 rounded-2xl p-4 text-center">
              <p className="text-3xl font-extrabold text-green-600">{analysis.positiveCount}</p>
              <p className="text-xs text-green-600 font-semibold mt-1">Positive</p>
            </div>
            <div className="bg-secondary rounded-2xl p-4 text-center">
              <p className="text-3xl font-extrabold text-muted-foreground">{analysis.neutralCount}</p>
              <p className="text-xs text-muted-foreground font-semibold mt-1">Neutral</p>
            </div>
            <div className="bg-red-500/10 rounded-2xl p-4 text-center">
              <p className="text-3xl font-extrabold text-red-600">{analysis.negativeCount}</p>
              <p className="text-xs text-red-600 font-semibold mt-1">Negative</p>
            </div>
          </div>

          {/* Progress Bar */}
          {(() => {
            const total = analysis.positiveCount + analysis.neutralCount + analysis.negativeCount;
            const posPercent = total ? (analysis.positiveCount / total) * 100 : 0;
            const neuPercent = total ? (analysis.neutralCount / total) * 100 : 0;
            const negPercent = total ? (analysis.negativeCount / total) * 100 : 0;
            return (
              <div className="h-3 rounded-full overflow-hidden flex gap-0.5">
                {posPercent > 0 && (
                  <div className="bg-green-500 rounded-full transition-all" style={{ width: `${posPercent}%` }} />
                )}
                {neuPercent > 0 && (
                  <div className="bg-secondary rounded-full transition-all" style={{ width: `${neuPercent}%` }} />
                )}
                {negPercent > 0 && (
                  <div className="bg-red-500 rounded-full transition-all" style={{ width: `${negPercent}%` }} />
                )}
              </div>
            );
          })()}

          {/* Praises */}
          {analysis.commonPraises && analysis.commonPraises.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">What customers love:</p>
              <div className="flex flex-wrap gap-2">
                {analysis.commonPraises.map((praise, i) => (
                  <Badge key={i} className="bg-green-500/10 text-green-600 border-0 font-semibold">
                    👍 {praise}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Complaints */}
          {analysis.commonComplaints && analysis.commonComplaints.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">Areas to improve:</p>
              <div className="flex flex-wrap gap-2">
                {analysis.commonComplaints.map((complaint, i) => (
                  <Badge key={i} className="bg-red-500/10 text-red-600 border-0 font-semibold">
                    ⚠️ {complaint}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Suggestion */}
          {analysis.suggestions && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3">
              <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-primary mb-1">AI Suggestion</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{analysis.suggestions}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reviews List */}
      {selectedMealId && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-bold text-sm">Customer Reviews</h2>
            {reviews && (
              <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full font-medium">
                {reviews.length} reviews
              </span>
            )}
          </div>

          {reviewsLoading ? (
            <div className="p-6 flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : !reviews || reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
                <Star className="h-7 w-7 text-muted-foreground/40" />
              </div>
              <div>
                <p className="font-semibold">No reviews yet</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Reviews will appear here once customers rate this meal
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {reviews.map((review) => (
                <div key={review.id} className="px-6 py-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                        {review.customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold">{review.customer.name}</p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3.5 w-3.5",
                                i < review.rating ? "fill-accent text-accent" : "text-border"
                              )}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">
                            {review.rating}/5
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                          {review.comment}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {review.sentiment && (
                        <Badge
                          className={cn("text-xs border-0 font-semibold",
                            review.sentiment === "positive"
                              ? "bg-green-500/10 text-green-600"
                              : review.sentiment === "negative"
                              ? "bg-red-500/10 text-red-600"
                              : "bg-secondary text-muted-foreground"
                          )}
                        >
                          {review.sentiment}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State — no meal selected */}
      {!selectedMealId && (
        <div className="bg-card border border-border rounded-2xl flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
            <Star className="h-7 w-7 text-muted-foreground/40" />
          </div>
          <div>
            <p className="font-semibold">Select a meal to view reviews</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Choose a meal from the dropdown above
            </p>
          </div>
        </div>
      )}
    </div>
  );
}