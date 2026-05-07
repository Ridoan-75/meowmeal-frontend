"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, Store, ShoppingBag, Star } from "lucide-react";
import api from "@/lib/axios";

const defaultStats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Happy Customers",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Store,
    value: "500+",
    label: "Restaurants",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: ShoppingBag,
    value: "50,000+",
    label: "Orders Delivered",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Star,
    value: "4.8",
    label: "Average Rating",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {defaultStats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <stat.icon className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/70 mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}