"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Star, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import toast from "react-hot-toast";

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
  customer: {
    name: string;
  };
}

export default function ProviderReviewsPage() {
  const [selectedMealId, setSelectedMealId] = useState("");
  const [analysis, setAnalysis] = useState<ReviewAnalysis | null>(null);

  const { data: meals, isLoading: mealsLoading } = useQuery({
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
      return res.data.data;
    },
    enabled: !!selectedMealId,
  });

  const analysisMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/ai/analyze-reviews", {
        mealId: selectedMealId,
      });
      return res.data.data;
    },
    onSuccess: (data) => {
      setAnalysis(data);
      toast.success("Sentiment analysis complete!");
    },
    onError: () => toast.error("Failed to analyze reviews"),
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
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
      <div className="flex items-center gap-3">
        <Select
          value={selectedMealId}
          onValueChange={(val) => {
            setSelectedMealId(val);
            setAnalysis(null);
          }}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a meal to view reviews" />
          </SelectTrigger>
          <SelectContent>
            {meals?.map((meal) => (
              <SelectItem key={meal.id} value={meal.id}>
                {meal.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedMealId && reviews && reviews.length > 0 && (
          <Button
            onClick={() => analysisMutation.mutate()}
            disabled={analysisMutation.isPending}
            className="bg-primary hover:bg-primary-hover text-white gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {analysisMutation.isPending ? "Analyzing..." : "AI Analysis"}
          </Button>
        )}
      </div>

      {/* AI Analysis Results */}
      {analysis && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Sentiment Analysis
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="bg-green-500/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-green-600">
                {analysis.positiveCount}
              </p>
              <p className="text-xs text-green-600 font-medium">Positive</p>
            </div>
            <div className="bg-gray-500/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-gray-600">
                {analysis.neutralCount}
              </p>
              <p className="text-xs text-gray-600 font-medium">Neutral</p>
            </div>
            <div className="bg-red-500/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-red-600">
                {analysis.negativeCount}
              </p>
              <p className="text-xs text-red-600 font-medium">Negative</p>
            </div>
          </div>
          {analysis.commonPraises && analysis.commonPraises.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium mb-2">What customers love:</p>
              <div className="flex flex-wrap gap-2">
                {analysis.commonPraises.map((praise: string, i: number) => (
                  <Badge
                    key={i}
                    className="bg-green-500/10 text-green-600 border-0"
                  >
                    {praise}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {analysis.commonComplaints && analysis.commonComplaints.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium mb-2">Areas to improve:</p>
              <div className="flex flex-wrap gap-2">
                {analysis.commonComplaints.map(
                  (complaint: string, i: number) => (
                    <Badge
                      key={i}
                      className="bg-red-500/10 text-red-600 border-0"
                    >
                      {complaint}
                    </Badge>
                  )
                )}
              </div>
            </div>
          )}
          {analysis.suggestions && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
              <p className="text-sm font-medium text-primary mb-1">
                AI Suggestion:
              </p>
              <p className="text-sm text-muted-foreground">
                {analysis.suggestions}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Reviews List */}
      {selectedMealId && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold">
              Customer Reviews
              {reviews && (
                <span className="text-muted-foreground font-normal ml-2 text-sm">
                  ({reviews.length})
                </span>
              )}
            </h2>
          </div>

          {reviewsLoading ? (
            <div className="p-6 flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          ) : !reviews || reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Star className="h-10 w-10 text-muted-foreground/20 mb-3" />
              <p className="font-medium mb-1">No reviews yet</p>
              <p className="text-sm text-muted-foreground">
                Reviews will appear here once customers rate this meal
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {reviews.map((review: CustomerReview) => (
                <div key={review.id} className="px-6 py-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                        {review.customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {review.customer.name}
                        </p>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating
                                  ? "fill-accent text-accent"
                                  : "text-border"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.sentiment && (
                      <Badge
                        className={`text-xs border-0 ${
                          review.sentiment === "positive"
                            ? "bg-green-500/10 text-green-600"
                            : review.sentiment === "negative"
                            ? "bg-red-500/10 text-red-600"
                            : "bg-gray-500/10 text-gray-600"
                        }`}
                      >
                        {review.sentiment}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}