"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LucideIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  menuItems: MenuItem[];
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ menuItems, mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Lock body scroll when mobile sidebar open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const renderNavLinks = () => (
    <nav className="flex flex-col gap-1 p-3 pt-4">
      {menuItems.map((item, index) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            style={{ transitionDelay: mobileOpen ? `${index * 40}ms` : "0ms" }}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200",
              isActive
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <div className={cn(
              "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 transition-colors",
              isActive ? "bg-white/20" : "bg-secondary"
            )}>
              <item.icon className="h-4 w-4" />
            </div>
            {item.label}
            {isActive && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 min-h-[calc(100vh-4rem)] bg-background border-r border-border">
        {renderNavLinks()}
      </aside>

      {/* ── Mobile Sidebar ── */}
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Drawer — slide from left */}
      <aside
        className={cn(
          "md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-card border-r border-border shadow-2xl shadow-black/10 flex flex-col transition-all duration-300 ease-in-out",
          mobileOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="MeowMeal" width={36} height={36} className="rounded-xl" />
            <div>
              <p className="font-black text-sm text-primary tracking-tight">MeowMeal</p>
              <p className="text-[10px] text-muted-foreground">Dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav Links */}
        {renderNavLinks()}
      </aside>
    </>
  );
}