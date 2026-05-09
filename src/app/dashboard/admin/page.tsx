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
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import api from "@/lib/axios";
import {
  TopMeal,
  NewsletterSubscriber,
  RecentOrder,
  OrderStatus,
} from "@/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const statusConfig: Record<string, { color: string; label: string; dot: string }> = {
  PLACED: { color: "bg-blue-500/10 text-blue-500", label: "Placed", dot: "#3B82F6" },
  PREPARING: { color: "bg-yellow-500/10 text-yellow-500", label: "Preparing", dot: "#FFB800" },
  READY: { color: "bg-purple-500/10 text-purple-500", label: "Ready", dot: "#A855F7" },
  DELIVERED: { color: "bg-green-500/10 text-green-500", label: "Delivered", dot: "#22C55E" },
  CANCELLED: { color: "bg-red-500/10 text-red-500", label: "Cancelled", dot: "#EF4444" },
};

const statsConfig = [
  { key: "totalUsers", label: "Total Users", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", prefix: "" },
  { key: "totalProviders", label: "Restaurants", icon: Store, color: "text-primary", bg: "bg-primary/10", prefix: "" },
  { key: "totalOrders", label: "Total Orders", icon: ShoppingBag, color: "text-yellow-500", bg: "bg-yellow-500/10", prefix: "" },
  { key: "totalMeals", label: "Total Meals", icon: UtensilsCrossed, color: "text-green-500", bg: "bg-green-500/10", prefix: "" },
  { key: "totalRevenue", label: "Revenue", icon: DollarSign, color: "text-purple-500", bg: "bg-purple-500/10", prefix: "৳" },
];

const tooltipStyle = {
  contentStyle: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    fontSize: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  },
};

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

  const totalOrdersByStatus = (stats?.ordersByStatus || []).reduce(
    (sum: number, o: { count: number }) => sum + o.count, 0
  );

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Platform overview & analytics</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-green-500/10 text-green-600 px-3 py-1.5 rounded-xl font-semibold">
          <Activity className="h-3.5 w-3.5" />
          Live Data
        </div>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {statsConfig.map((stat) => (
            <div
              key={stat.key}
              className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", stat.bg)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-extrabold">
                  {stat.prefix}{stats?.overview?.[stat.key]?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Monthly Revenue — Gradient Area */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold">Monthly Revenue</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Last 6 months earnings</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-extrabold text-primary">
                ৳{stats?.overview?.totalRevenue?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-muted-foreground">Total delivered</p>
            </div>
          </div>
          {isLoading ? <Skeleton className="h-48 w-full" /> : (
            <ResponsiveContainer width="100%" height={192}>
              <AreaChart data={stats?.monthlyRevenue || []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                <Tooltip {...tooltipStyle} formatter={(val) => [`৳${val}`, "Revenue"]} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FF6B35"
                  strokeWidth={2.5}
                  fill="url(#revenueGrad)"
                  dot={{ fill: "#FF6B35", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#FF6B35" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Orders by Status — Donut */}
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3">
          <div>
            <h2 className="font-bold">Order Status</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{totalOrdersByStatus} total orders</p>
          </div>
          {isLoading ? <Skeleton className="h-48 w-full" /> : (
            <>
              <div className="relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={stats?.ordersByStatus || []}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {(stats?.ordersByStatus || []).map((entry: OrderStatus, index: number) => (
                        <Cell key={`cell-${index}`} fill={statusConfig[entry.status]?.dot || "#ccc"} />
                      ))}
                    </Pie>
                    <Tooltip
                      {...tooltipStyle}
                      formatter={(val, name) => [val, statusConfig[name as string]?.label || name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center pointer-events-none">
                  <span className="text-2xl font-extrabold">{totalOrdersByStatus}</span>
                  <span className="text-xs text-muted-foreground">Orders</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {(stats?.ordersByStatus || []).map((o: OrderStatus) => {
                  const percent = totalOrdersByStatus
                    ? Math.round((o.count / totalOrdersByStatus) * 100)
                    : 0;
                  return (
                    <div key={o.status} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full shrink-0" style={{ background: statusConfig[o.status]?.dot }} />
                        <span className="text-muted-foreground">{statusConfig[o.status]?.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${percent}%`, background: statusConfig[o.status]?.dot }}
                          />
                        </div>
                        <span className="font-bold w-6 text-right">{percent}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Monthly Orders — Bottom to Top Gradient Line */}
      <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold">Monthly Orders</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Order volume over last 6 months</p>
          </div>
          <span className="text-xl font-extrabold text-primary">
            {stats?.overview?.totalOrders?.toLocaleString() || 0}
          </span>
        </div>
        {isLoading ? <Skeleton className="h-44 w-full" /> : (
          <ResponsiveContainer width="100%" height={176}>
            <LineChart data={stats?.monthlyOrders || []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ordersGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#FFB800" />
                  <stop offset="100%" stopColor="#FF6B35" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
              <Tooltip {...tooltipStyle} formatter={(val) => [val, "Orders"]} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="url(#ordersGrad)"
                strokeWidth={3}
                dot={{ fill: "var(--card)", r: 5, strokeWidth: 2, stroke: "#FF6B35" }}
                activeDot={{ r: 7, fill: "#FF6B35", stroke: "var(--card)", strokeWidth: 2 }}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Top Meals */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <h2 className="font-bold text-sm">Top Meals</h2>
            <button
              onClick={() => router.push("/dashboard/admin/orders")}
              className="flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {isLoading ? (
              <div className="p-5"><Skeleton className="h-40 w-full" /></div>
            ) : (stats?.topMeals || []).length === 0 ? (
              <div className="px-5 py-8 text-center text-xs text-muted-foreground">No data yet</div>
            ) : (
              (stats?.topMeals || []).slice(0, 5).map((meal: TopMeal, index: number) => (
                <div key={meal.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
                  <span className="text-xs font-black text-muted-foreground/40 w-4 shrink-0">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{meal.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{meal.provider.shopName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <span className="text-xs font-extrabold text-primary">৳{meal.price}</span>
                    <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 h-4">
                      {meal.orderCount}x
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <h2 className="font-bold text-sm">Recent Orders</h2>
            <button
              onClick={() => router.push("/dashboard/admin/orders")}
              className="flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {isLoading ? (
              <div className="p-5"><Skeleton className="h-40 w-full" /></div>
            ) : (stats?.recentOrders || []).length === 0 ? (
              <div className="px-5 py-8 text-center text-xs text-muted-foreground">No orders yet</div>
            ) : (
              (stats?.recentOrders || []).slice(0, 5).map((order: RecentOrder) => (
                <div key={order.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black shrink-0">
                    {order.customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{order.customer.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">#{order.id.slice(-6).toUpperCase()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs font-extrabold text-primary">৳{order.totalAmount}</span>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ background: statusConfig[order.status]?.dot }} />
                      <span className="text-[10px] text-muted-foreground">{statusConfig[order.status]?.label}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <h2 className="font-bold text-sm">Newsletter</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground font-medium">
                {subscribers?.meta?.total || 0} total
              </span>
              <button
                onClick={() => router.push("/dashboard/admin/newsletter")}
                className="flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
              >
                View all <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-border">
            {subscribers?.data?.length > 0 ? (
              subscribers.data.map((sub: NewsletterSubscriber) => (
                <div key={sub.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <a href={`mailto:${sub.email}`} className="text-xs font-medium hover:text-primary transition-colors truncate block">
                      {sub.email}
                    </a>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-xs text-muted-foreground">No subscribers yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}