"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight, Store, UtensilsCrossed } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";

export function CTASection() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const handlePartnerClick = () => {
    if (!isAuthenticated) {
      router.push("/register");
      return;
    }
    if (user?.role === "PROVIDER") {
      router.push("/dashboard/provider");
      return;
    }
    if (user?.role === "CUSTOMER" || user?.role === "ADMIN") {
      toast.info(
        "You are already logged in as a Customer. Please create a new Provider account.",
        {
          duration: 4000,
          style: {
            background: "#FF6B35",
            color: "#ffffff",
            border: "none",
            fontWeight: "500",
          },
          icon: (
            <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-black">i</span>
            </div>
          ),
        }
      );
      setTimeout(() => {
        router.push("/register?role=PROVIDER");
      }, 1500);
      return;
    }
  };

  return (
    <section className="py-16 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Order Food CTA */}
          <div className="flex flex-col gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Hungry? Order Now!
            </h2>
            <p className="text-muted-foreground">
              Browse hundreds of restaurants and get your favorite food
              delivered in minutes.
            </p>
            <Button
              onClick={() => router.push("/meals")}
              className="w-fit bg-primary hover:bg-primary-hover text-white font-semibold h-12 px-7 rounded-xl cursor-pointer shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all"
            >
              Order Food Now
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          {/* Partner CTA */}
          <div className="flex flex-col gap-4 lg:border-l lg:border-border lg:pl-12">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Own a Restaurant?
            </h2>
            <p className="text-muted-foreground">
              Partner with MeowMeal and reach thousands of hungry customers in
              your city.
            </p>
            <Button
              onClick={handlePartnerClick}
              variant="outline"
              className="w-fit border-primary text-primary hover:bg-primary hover:text-white font-semibold h-12 px-7 rounded-xl cursor-pointer hover:scale-105 transition-all"
            >
              {isAuthenticated && user?.role === "PROVIDER"
                ? "Go to Dashboard"
                : "Become a Partner"}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}