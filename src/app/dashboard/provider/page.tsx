"use client";

import { useQuery } from "@tanstack/react-query";
import {
  UtensilsCrossed,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

interface OrderItem {
  id: string;
  quantity: number;
  meal: { title: string };
}

interface Order {
  id: string;
  createdAt: string;
  customer: { name: string };
  items: OrderItem[];
  totalAmount: number;
  status: string;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  PLACED: { color: "bg-blue-500/10 text-blue-600", label: "Placed" },
  PREPARING: { color: "bg-yellow-500/10 text-yellow-600", label: "Preparing" },
  READY: { color: "bg-purple-500/10 text-purple-600", label: "Ready" },
  DELIVERED: { color: "bg-green-500/10 text-green-600", label: "Delivered" },
  CANCELLED: { color: "bg-red-500/10 text-red-600", label: "Cancelled" },
};

export default function ProviderDashboardPage() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["provider-dashboard"],
    queryFn: async () => {
      const res = await api.get("/providers/me/dashboard");
      return res.data.data;
    },
  });

  const statsCards = [
    {
      label: "Total Meals",
      value: stats?.totalMeals || 0,
      icon: UtensilsCrossed,
      color: "bg-primary/10 text-primary",
      href: "/dashboard/provider/meals",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: "bg-blue-500/10 text-blue-500",
      href: "/dashboard/provider/orders",
    },
    {
      label: "Total Revenue",
      value: `৳${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "bg-green-500/10 text-green-500",
      href: "/dashboard/provider/analytics",
    },
    {
      label: "This Month",
      value: `৳${stats?.monthlyRevenue?.[stats?.monthlyRevenue?.length - 1]?.revenue?.toLocaleString() || 0}`,
      icon: TrendingUp,
      color: "bg-yellow-500/10 text-yellow-500",
      href: "/dashboard/provider/analytics",
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
            Here is what is happening with your restaurant today
          </p>
        </div>
        <Link
          href="/dashboard/provider/analytics"
          className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
        >
          <TrendingUp className="h-3.5 w-3.5" />
          View Analytics
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

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-bold">Recent Orders</h2>
          <Link
            href="/dashboard/provider/orders"
            className="flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
          >
            View all
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6"><Skeleton className="h-40 w-full" /></div>
        ) : !stats?.recentOrders || stats.recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-semibold">No orders yet</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Orders will appear here once customers start ordering
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {stats.recentOrders.map((order: Order) => (
              <div
                key={order.id}
                className="flex items-center gap-4 px-6 py-3 hover:bg-muted/20 transition-colors flex-wrap"
              >
                {/* Avatar */}
                <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {order.customer.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{order.customer.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Clock className="h-3 w-3" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Items */}
                <div className="hidden sm:flex flex-col gap-0.5 min-w-0 max-w-[160px]">
                  {order.items.slice(0, 2).map((item) => (
                    <p key={item.id} className="text-xs text-muted-foreground truncate">
                      {item.quantity}x {item.meal.title}
                    </p>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-xs text-primary">+{order.items.length - 2} more</p>
                  )}
                </div>

                {/* Amount */}
                <span className="text-sm font-extrabold text-primary shrink-0">
                  ৳{order.totalAmount}
                </span>

                {/* Status */}
                <Badge className={cn("text-xs border-0 font-semibold shrink-0", statusConfig[order.status]?.color)}>
                  {statusConfig[order.status]?.label || order.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}