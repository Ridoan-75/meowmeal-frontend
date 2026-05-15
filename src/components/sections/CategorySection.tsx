"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import { Category } from "@/types";
import { ChevronRight, ArrowRight, ChevronLeft } from "lucide-react";
import { useRef } from "react";

export function CategorySection() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data.data as Category[];
    },
  });

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "right" ? 300 : -300,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
              Categories
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Browse by Cuisine
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Scroll Buttons — desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="h-9 w-9 rounded-xl bg-card border border-border hover:bg-primary/10 hover:border-primary flex items-center justify-center transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="h-9 w-9 rounded-xl bg-card border border-border hover:bg-primary/10 hover:border-primary flex items-center justify-center transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => router.push("/meals")}
              className="group flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
            >
              View all
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          className="flex items-start gap-4 overflow-x-auto pb-3 scrollbar-none scroll-smooth"
        >
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-3 shrink-0"
                >
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))
            : data?.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() =>
                    router.push(`/meals?categoryId=${category.id}`)
                  }
                  className="group flex flex-col items-center gap-2.5 shrink-0 w-24"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  {/* Circle Image */}
                  <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-border group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300 bg-secondary">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Hover tint */}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/15 transition-all duration-300" />
                  </div>

                  {/* Label */}
                  <span className="text-xs sm:text-[13px] font-semibold text-center text-foreground/70 group-hover:text-primary transition-colors duration-200 leading-tight w-full">
                    {category.name}
                  </span>
                </button>
              ))}
        </div>

        {/* Mobile CTA */}
        <div className="flex justify-center mt-6 sm:hidden">
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