"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { BarChart2 } from "lucide-react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  MessageSquare,
  User,
} from "lucide-react";

const providerMenuItems = [
  { href: "/dashboard/provider", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/provider/meals", label: "My Meals", icon: UtensilsCrossed },
  { href: "/dashboard/provider/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/provider/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/dashboard/provider/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/dashboard/provider/profile", label: "Profile", icon: User },
];

export default function ProviderDashboardLayout({
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
    if (!isLoading && user && user.role !== "PROVIDER") {
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
          menuItems={providerMenuItems}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
}