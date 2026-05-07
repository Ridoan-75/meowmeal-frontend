"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight, Store } from "lucide-react";

export function CTASection() {
  const router = useRouter();

  return (
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Order Food CTA */}
          <div className="flex flex-col gap-4">
            <span className="text-4xl">🍱</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Hungry? Order Now!
            </h2>
            <p className="text-white/80">
              Browse hundreds of restaurants and get your favorite food
              delivered in minutes.
            </p>
            <Button
              onClick={() => router.push("/meals")}
              className="w-fit bg-white text-primary hover:bg-white/90 font-semibold h-11 px-6"
            >
              Order Food Now
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          {/* Partner CTA */}
          <div className="flex flex-col gap-4 lg:border-l lg:border-white/20 lg:pl-12">
            <Store className="h-10 w-10 text-white/80" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Own a Restaurant?
            </h2>
            <p className="text-white/80">
              Partner with MeowMeal and reach thousands of hungry customers in
              your city.
            </p>
            <Button
              onClick={() => router.push("/register")}
              variant="outline"
              className="w-fit border-white text-white hover:bg-white/10 font-semibold h-11 px-6"
            >
              Become a Partner
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}