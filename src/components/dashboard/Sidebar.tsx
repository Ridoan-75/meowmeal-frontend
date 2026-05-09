"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const renderNavLinks = () => (
    <nav className="flex flex-col gap-1 p-3 pt-4">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              isActive
                ? "bg-primary text-white shadow-sm shadow-primary/25"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 min-h-[calc(100vh-4rem)] bg-background border-r border-border">
        {renderNavLinks()}
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <aside className="relative z-10 w-64 bg-background h-full flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <span className="font-black text-lg text-primary">Menu</span>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-muted transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {renderNavLinks()}
          </aside>
        </div>
      )}
    </>
  );
}