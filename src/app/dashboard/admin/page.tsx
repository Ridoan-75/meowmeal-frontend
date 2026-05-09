"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Store,
  ShoppingBag,
  UtensilsCrossed,
  DollarSign,
  Mail,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import api from "@/lib/axios";
import { OrderStatus, TopMeal, NewsletterSubscriber, RecentOrder } from "@/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const statusConfig: Record<string, { color: string; label: string }> = {
  PLACED: { color: "bg-blue-500/10 text-blue-600", label: "Placed" },
  PREPARING: { color: "bg-yellow-500/10 text-yellow-600", label: "Preparing" },
  READY: { color: "bg-purple-500/10 text-purple-600", label: "Ready" },
  DELIVERED: { color: "bg-green-500/10 text-green-600", label: "Delivered" },
  CANCELLED: { color: "bg-red-500/10 text-red-600", label: "Cancelled" },
};

const PIE_COLORS = ["#3B82F6", "#FFB800", "#A855F7", "#22C55E", "#EF4444"];

const statsConfig = [
  { key: "totalUsers", label: "Total Users", icon: Users, color: "bg-blue-500/10 text-blue-500", prefix: "" },
  { key: "totalProviders", label: "Restaurants", icon: Store, color: "bg-primary/10 text-primary", prefix: "" },
  { key: "totalOrders", label: "Total Orders", icon: ShoppingBag, color: "bg-yellow-500/10 text-yellow-500", prefix: "" },
  { key: "totalMeals", label: "Total Meals", icon: UtensilsCrossed, color: "bg-green-500/10 text-green-500", prefix: "" },
  { key: "totalRevenue", label: "Total Revenue", icon: DollarSign, color: "bg-purple-500/10 text-purple-500", prefix: "৳" },
];

export default function AdminDashboardPage() {
  const router = useRouter();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await api.get("/admin/dashboard");
      return res.data.data;
    },
  });

  const { data: subscribers } = useQuery({
    queryKey: ["newsletter-subscribers"],
    queryFn: async () => {
      const res = await api.get("/newsletter?limit=5");
      return res.data;
    },
  });

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Platform overview and analytics
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary px-3 py-2 rounded-xl">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          Live Data
        </div>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {statsConfig.map((stat) => (
            <div
              key={stat.key}
              className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-0.5 transition-all"
            >
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold">
                  {stat.prefix}{stats?.overview?.[stat.key]?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Monthly Revenue */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold">Monthly Revenue</h2>
            <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
              Last 6 months
            </span>
          </div>
          {isLoading ? (
            <Skeleton className="h-52 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats?.monthlyRevenue || []}>
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

        {/* Orders by Status Pie */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-bold mb-6">Orders by Status</h2>
          {isLoading ? (
            <Skeleton className="h-52 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stats?.ordersByStatus || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                >
                  {(stats?.ordersByStatus || []).map((_: OrderStatus, index: number) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Legend formatter={(value) => <span className="text-xs">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Monthly Orders Line Chart */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold">Monthly Orders</h2>
          <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            Last 6 months
          </span>
        </div>
        {isLoading ? (
          <Skeleton className="h-52 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats?.monthlyOrders || []}>
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
              <Line
                type="monotone"
                dataKey="count"
                stroke="#FF6B35"
                strokeWidth={2.5}
                dot={{ fill: "#FF6B35", r: 4 }}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Meals */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-bold">Top Selling Meals</h2>
            <button
              onClick={() => router.push("/dashboard/admin/orders")}
              className="flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
            >
              View all
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          {isLoading ? (
            <div className="p-6"><Skeleton className="h-40 w-full" /></div>
          ) : (
            <div className="divide-y divide-border">
              {(stats?.topMeals || []).slice(0, 5).map((meal: TopMeal, index: number) => (
                <div key={meal.id} className="flex items-center gap-4 px-6 py-3 hover:bg-muted/30 transition-colors">
                  <span className="text-sm font-black text-muted-foreground/40 w-5 shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{meal.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{meal.provider.shopName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-sm font-extrabold text-primary">৳{meal.price}</span>
                    <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5">
                      {meal.orderCount} orders
                    </Badge>
                  </div>
                </div>
              ))}
              {(!stats?.topMeals || stats.topMeals.length === 0) && (
                <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                  No meal data yet
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-bold">Recent Orders</h2>
            <button
              onClick={() => router.push("/dashboard/admin/orders")}
              className="flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
            >
              View all
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          {isLoading ? (
            <div className="p-6"><Skeleton className="h-40 w-full" /></div>
          ) : (
            <div className="divide-y divide-border">
              {(stats?.recentOrders || []).slice(0, 5).map((order: RecentOrder) => (
                <div key={order.id} className="flex items-center gap-3 px-6 py-3 hover:bg-muted/30 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black shrink-0">
                    {order.customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{order.customer.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-sm font-extrabold text-primary">৳{order.totalAmount}</span>
                    <Badge className={cn("text-[10px] border-0 px-1.5", statusConfig[order.status]?.color)}>
                      {statusConfig[order.status]?.label || order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                  No orders yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Subscribers */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-bold">Recent Newsletter Subscribers</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full font-medium">
              {subscribers?.meta?.total || 0} total
            </span>
            <button
              onClick={() => router.push("/dashboard/admin/newsletter")}
              className="flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
            >
              View all
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>
        <div className="divide-y divide-border">
          {subscribers?.data?.length > 0 ? (
            subscribers.data.map((sub: NewsletterSubscriber) => (
              <div key={sub.id} className="flex items-center justify-between px-6 py-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <a href={`mailto:${sub.email}`} className="text-sm hover:text-primary transition-colors font-medium">
                    {sub.email}
                  </a>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              No subscribers yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}