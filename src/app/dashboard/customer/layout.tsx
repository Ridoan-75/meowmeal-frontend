"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  User,
  Sparkles,
  Heart,
} from "lucide-react";

const customerMenuItems = [
  { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/customer/orders", label: "My Orders", icon: ShoppingBag },
  { href: "/dashboard/customer/wishlist", label: "My Wishlist", icon: Heart },
  { href: "/dashboard/customer/cart", label: "My Cart", icon: ShoppingCart },
  {
    href: "/dashboard/customer/recommendations",
    label: "AI Recommendations",
    icon: Sparkles,
  },
  { href: "/dashboard/customer/profile", label: "Profile", icon: User },
];

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
    if (!isLoading && user && user.role !== "CUSTOMER") {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <DashboardNavbar onMenuClick={() => setMobileOpen(true)} />
      <div className="flex">
        <Sidebar
          menuItems={customerMenuItems}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
}
