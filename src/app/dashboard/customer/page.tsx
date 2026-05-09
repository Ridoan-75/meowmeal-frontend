"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
  Heart,
  UtensilsCrossed,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/providers/AuthProvider";
import api from "@/lib/axios";
import { Order } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { color: string; label: string }> = {
  PLACED: { color: "bg-blue-500/10 text-blue-600", label: "Placed" },
  PREPARING: { color: "bg-yellow-500/10 text-yellow-600", label: "Preparing" },
  READY: { color: "bg-purple-500/10 text-purple-600", label: "Ready" },
  DELIVERED: { color: "bg-green-500/10 text-green-600", label: "Delivered" },
  CANCELLED: { color: "bg-red-500/10 text-red-600", label: "Cancelled" },
};

export default function CustomerDashboardPage() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["customer-orders"],
    queryFn: async () => {
      const res = await api.get("/orders/my-orders?limit=100");
      return res.data.data as Order[];
    },
  });

  const orders = data || [];
  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) =>
    ["PLACED", "PREPARING", "READY"].includes(o.status)
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;
  const cancelledOrders = orders.filter((o) => o.status === "CANCELLED").length;
  const recentOrders = orders.slice(0, 5);

  const statsCards = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "bg-primary/10 text-primary",
      href: "/dashboard/customer/orders",
    },
    {
      label: "Active Orders",
      value: activeOrders,
      icon: Clock,
      color: "bg-yellow-500/10 text-yellow-500",
      href: "/dashboard/customer/orders",
    },
    {
      label: "Delivered",
      value: deliveredOrders,
      icon: CheckCircle,
      color: "bg-green-500/10 text-green-500",
      href: "/dashboard/customer/orders",
    },
    {
      label: "Cancelled",
      value: cancelledOrders,
      icon: XCircle,
      color: "bg-red-500/10 text-red-500",
      href: "/dashboard/customer/orders",
    },
  ];

  const quickLinks = [
    {
      label: "Browse Meals",
      description: "Discover new dishes",
      icon: UtensilsCrossed,
      href: "/meals",
      color: "bg-primary/10 text-primary",
    },
    {
      label: "My Wishlist",
      description: "Saved favorites",
      icon: Heart,
      href: "/dashboard/customer/wishlist",
      color: "bg-red-500/10 text-red-500",
    },
    {
      label: "AI Picks",
      description: "Personalized for you",
      icon: Sparkles,
      href: "/dashboard/customer/recommendations",
      color: "bg-purple-500/10 text-purple-500",
    },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here is your order summary and quick actions
          </p>
        </div>
        <Link
          href="/meals"
          className={cn(
            "flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold text-white",
            "bg-primary hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer",
            "shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
          )}
        >
          Order Now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer"
            >
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", link.color)}>
              <link.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold">{link.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-bold">Recent Orders</h2>
          <Link
            href="/dashboard/customer/orders"
            className="flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-6 py-4 border-b border-border last:border-0">
                <Skeleton className="h-14 w-full" />
              </div>
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
              <ShoppingBag className="h-7 w-7 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-semibold">No orders yet</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Start ordering from our amazing restaurants
              </p>
            </div>
            <Link
              href="/meals"
              className="flex items-center gap-2 h-9 px-5 rounded-xl bg-primary text-white text-sm font-semibold hover:brightness-110 transition-all cursor-pointer"
            >
              Browse Meals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-4 px-6 py-3 hover:bg-muted/20 transition-colors flex-wrap"
              >
                {/* Order ID */}
                <span className="text-sm font-mono font-bold text-primary min-w-[100px]">
                  #{order.id.slice(-8).toUpperCase()}
                </span>

                {/* Items */}
                <p className="flex-1 text-sm text-muted-foreground truncate min-w-[120px]">
                  {order.items.map((i) => i.meal.title).join(", ")}
                </p>

                {/* Total */}
                <span className="text-sm font-extrabold text-primary shrink-0">
                  ৳{order.totalAmount}
                </span>

                {/* Status */}
                <Badge className={cn("text-xs border-0 font-semibold shrink-0", statusConfig[order.status]?.color)}>
                  {statusConfig[order.status]?.label || order.status}
                </Badge>

                {/* Date */}
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}