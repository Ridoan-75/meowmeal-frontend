"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import {
  Brain,
  Mail,
  LayoutDashboard,
  Users,
  ShoppingBag,
  Tag,
  Store,
} from "lucide-react";

const adminMenuItems = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/orders", label: "All Orders", icon: ShoppingBag },
  { href: "/dashboard/admin/categories", label: "Categories", icon: Tag },
  { href: "/dashboard/admin/providers", label: "Providers", icon: Store },
  { href: "/dashboard/admin/ai-analytics", label: "AI Analytics", icon: Brain },
  { href: "/dashboard/admin/profile", label: "Profile", icon: Users },
  { href: "/dashboard/admin/newsletter", label: "Newsletter", icon: Mail },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user && user.role !== "ADMIN") {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated) {
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
          menuItems={adminMenuItems}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
}