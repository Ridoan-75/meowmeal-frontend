"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import { Category } from "@/types";
import { ChevronRight } from "lucide-react";

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
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Browse by Category
            </h2>
            <p className="text-muted-foreground mt-1">
              Find your favorite cuisine
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

        {/* Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            : data?.map((category) => (
                <button
                  key={category.id}
                  onClick={() =>
                    router.push(`/meals?categoryId=${category.id}`)
                  }
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-xs font-medium text-center group-hover:text-primary transition-colors">
                    {category.name}
                  </span>
                </button>
              ))}
        </div>
      </div>
    </section>
  );
}