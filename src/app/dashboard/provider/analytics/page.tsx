"use client";

import { useQuery } from "@tanstack/react-query";
import {
  UtensilsCrossed,
  ShoppingBag,
  DollarSign,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import Link from "next/link";

const statusConfig: Record<string, { color: string; label: string }> = {
  PLACED: { color: "bg-blue-500/10 text-blue-600", label: "Placed" },
  PREPARING: { color: "bg-yellow-500/10 text-yellow-600", label: "Preparing" },
  READY: { color: "bg-purple-500/10 text-purple-600", label: "Ready" },
  DELIVERED: { color: "bg-green-500/10 text-green-600", label: "Delivered" },
  CANCELLED: { color: "bg-red-500/10 text-red-600", label: "Cancelled" },
};

interface OrderItem {
  quantity: number;
  price: number;
  meal: { title: string };
}

interface RecentOrder {
  id: string;
  customer: { name: string };
  totalAmount: number;
  createdAt: string;
  status: string;
  items: OrderItem[];
}

export default function ProviderAnalyticsPage() {
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
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "Total Revenue",
      value: `৳${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "bg-green-500/10 text-green-500",
    },
    {
      label: "Avg Rating",
      value: stats?.avgRating ? `${stats.avgRating} ★` : "N/A",
      icon: Star,
      color: "bg-yellow-500/10 text-yellow-500",
    },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your restaurant performance overview
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary px-3 py-2 rounded-xl">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          Live Data
        </div>
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
            <div
              key={stat.label}
              className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Revenue Chart */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold">Monthly Revenue</h2>
          <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            Last 6 months
          </span>
        </div>
        {isLoading ? (
          <Skeleton className="h-52 w-full" />
        ) : !stats?.monthlyRevenue || stats.monthlyRevenue.length === 0 ? (
          <div className="h-52 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No revenue data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="revenue" fill="#FF6B35" radius={[6, 6, 0, 0]} name="Revenue (৳)" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-bold">Recent Orders</h2>
            <Link
              href="/dashboard/provider/orders"
              className="text-xs text-primary hover:underline font-semibold"
            >
              View all
            </Link>
          </div>

          {isLoading ? (
            <div className="p-6"><Skeleton className="h-40 w-full" /></div>
          ) : !stats?.recentOrders || stats.recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <p className="text-sm text-muted-foreground">No orders yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {stats.recentOrders.map((order: RecentOrder) => (
                <div key={order.id} className="flex items-center gap-3 px-6 py-3 hover:bg-muted/20 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {order.customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{order.customer.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Clock className="h-3 w-3" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-primary shrink-0">
                    ৳{order.totalAmount}
                  </span>
                  <Badge className={cn("text-xs border-0 font-semibold shrink-0", statusConfig[order.status]?.color)}>
                    {statusConfig[order.status]?.label || order.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Status + Top Items */}
        <div className="flex flex-col gap-4">

          {/* Order Status Breakdown */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-bold mb-4">Order Status Breakdown</h2>
            {isLoading ? (
              <Skeleton className="h-28 w-full" />
            ) : (
              <div className="flex flex-col gap-3">
                {[
                  { status: "DELIVERED", icon: CheckCircle, color: "text-green-500" },
                  { status: "PREPARING", icon: Clock, color: "text-yellow-500" },
                  { status: "PLACED", icon: ShoppingBag, color: "text-blue-500" },
                  { status: "CANCELLED", icon: XCircle, color: "text-red-500" },
                ].map(({ status, icon: Icon, color }) => {
                  const count = stats?.recentOrders?.filter(
                    (o: RecentOrder) => o.status === status
                  ).length || 0;
                  const total = stats?.recentOrders?.length || 1;
                  const percent = Math.round((count / total) * 100);

                  return (
                    <div key={status} className="flex items-center gap-3">
                      <Icon className={cn("h-4 w-4 shrink-0", color)} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">{statusConfig[status]?.label}</span>
                          <span className="text-xs font-bold">{count}</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all", {
                              "bg-green-500": status === "DELIVERED",
                              "bg-yellow-500": status === "PREPARING",
                              "bg-blue-500": status === "PLACED",
                              "bg-red-500": status === "CANCELLED",
                            })}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Items */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-bold mb-4">Recently Ordered Items</h2>
            {isLoading ? (
              <Skeleton className="h-28 w-full" />
            ) : (
              <div className="flex flex-col gap-3">
                {stats?.recentOrders
                  ?.flatMap((o: RecentOrder) => o.items)
                  .slice(0, 4)
                  .map((item: OrderItem, i: number) => (
                    <div key={i} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-6 w-6 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                          {item.quantity}x
                        </div>
                        <span className="text-sm truncate">{item.meal.title}</span>
                      </div>
                      <span className="text-sm font-bold text-primary shrink-0">
                        ৳{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-2">No orders yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}