"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import { Category } from "@/types";
import { ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CategorySection() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data.data as Category[];
    },
  });

  return (
    <section className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
              Categories
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Browse by Cuisine
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

        {/* Categories */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl" />
                  <Skeleton className="h-3 w-14" />
                </div>
              ))
            : data?.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() =>
                    router.push(`/meals?categoryId=${category.id}`)
                  }
                  className="group flex flex-col items-center gap-2.5"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Image Container */}
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden bg-secondary border-2 border-transparent group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/15 transition-all duration-300">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-300" />
                  </div>

                  {/* Label */}
                  <span className="text-xs sm:text-[13px] font-semibold text-center text-foreground/70 group-hover:text-primary transition-colors duration-200 leading-tight">
                    {category.name}
                  </span>
                </button>
              ))}
        </div>

        {/* Bottom CTA — Mobile */}
        <div className="flex justify-center mt-8 md:hidden">
          <button
            onClick={() => router.push("/meals")}
            className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/15 px-5 py-2.5 rounded-full transition-all"
          >
            Browse all categories
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}