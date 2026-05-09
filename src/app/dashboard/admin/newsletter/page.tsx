"use client";

import { useQuery } from "@tanstack/react-query";
import { Mail, Users, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["newsletter-subscribers"],
    queryFn: async () => {
      const res = await api.get("/newsletter?limit=100");
      return res.data as {
        data: Subscriber[];
        meta: { total: number };
      };
    },
  });

  const subscribers = data?.data || [];
  const total = data?.meta?.total || 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Newsletter</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage email subscribers
          </p>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-extrabold">{total}</p>
            <p className="text-sm text-muted-foreground">Total Subscribers</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center shrink-0">
            <Mail className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-extrabold">
              {
                subscribers.filter((s) => {
                  const date = new Date(s.createdAt);
                  const now = new Date();
                  return (
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </p>
            <p className="text-sm text-muted-foreground">This Month</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-extrabold">
              {
                subscribers.filter((s) => {
                  const date = new Date(s.createdAt);
                  const now = new Date();
                  const diff = now.getTime() - date.getTime();
                  return diff <= 7 * 24 * 60 * 60 * 1000;
                }).length
              }
            </p>
            <p className="text-sm text-muted-foreground">This Week</p>
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-bold text-sm">All Subscribers</h2>
          <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full font-medium">
            {total} total
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 border-b border-border">
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : subscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
              <Mail className="h-7 w-7 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-semibold">No subscribers yet</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Subscribers will appear here
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {["#", "Email", "Subscribed On", "Time"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-muted-foreground px-6 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub, index) => (
                  <tr
                    key={sub.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    {/* Index */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground font-mono">
                        {index + 1}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Mail className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <a
                          href={`mailto:${sub.email}`}
                          className="text-sm font-medium hover:text-primary transition-colors"
                        >
                          {sub.email}
                        </a>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <span className="text-sm">
                        {new Date(sub.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>

                    {/* Time */}
                    <td className="px-6 py-4">
                      <span className="text-xs text-muted-foreground">
                        {new Date(sub.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
