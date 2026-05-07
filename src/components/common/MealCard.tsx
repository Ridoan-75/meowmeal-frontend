"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Clock, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Meal } from "@/types";

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={meal.images[0] || "/placeholder-food.jpg"}
          alt={meal.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        {!meal.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Unavailable</Badge>
          </div>
        )}
        {meal.avgRating && meal.avgRating >= 4.5 && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-accent text-accent-foreground text-xs font-bold">
              Top Rated
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Provider */}
        <p className="text-xs text-muted-foreground font-medium truncate">
          {meal.provider.shopName}
        </p>

        {/* Title */}
        <h3 className="font-semibold text-sm line-clamp-2 leading-snug">
          {meal.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {meal.avgRating !== undefined && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-accent text-accent" />
              <span className="font-medium text-foreground">
                {meal.avgRating.toFixed(1)}
              </span>
              {meal.totalReviews !== undefined && (
                <span>({meal.totalReviews})</span>
              )}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {meal.prepTime} min
          </div>
        </div>

        {/* Tags */}
        {meal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {meal.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-2 py-0"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Price + Button */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-bold text-primary text-base">
            ৳{meal.price}
          </span>
          <Link href={`/meals/${meal.id}`}>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary-hover text-white text-xs h-8"
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}