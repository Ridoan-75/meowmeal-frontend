"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";
import { NotificationBell } from "@/components/common/NotificationBell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Home, Menu, X } from "lucide-react";
import { signOut } from "@/lib/auth-client";

interface DashboardNavbarProps {
  onMenuClick?: () => void;
  mobileOpen?: boolean;
}

export function DashboardNavbar({ onMenuClick, mobileOpen }: DashboardNavbarProps) {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem("meowmeal_token");
    localStorage.removeItem("meowmeal_user_id");
    window.location.assign("/");
  };

  const getProfileLink = () => {
    if (user?.role === "ADMIN") return "/dashboard/admin/profile";
    if (user?.role === "PROVIDER") return "/dashboard/provider/profile";
    return "/dashboard/customer/profile";
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-border h-16 flex items-center px-4 sm:px-6">
      <div className="flex items-center justify-between w-full gap-4">

        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger — animated */}
          <button
            onClick={onMenuClick}
            className="md:hidden h-9 w-9 rounded-xl flex items-center justify-center hover:bg-muted border border-border/60 transition-all cursor-pointer"
          >
            <div className="relative h-5 w-5">
              <Menu className={cn(
                "absolute inset-0 h-5 w-5 transition-all duration-300",
                mobileOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
              )} />
              <X className={cn(
                "absolute inset-0 h-5 w-5 transition-all duration-300",
                mobileOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
              )} />
            </div>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.png"
              alt="MeowMeal"
              width={32}
              height={32}
              className="rounded-lg group-hover:scale-105 transition-transform"
            />
            <span className="font-black text-lg text-primary hidden sm:block tracking-tight">
              MeowMeal
            </span>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <NotificationBell />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-muted border border-border/60 transition-all cursor-pointer outline-none">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image || ""} />
                  <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col text-left">
                  <p className="text-xs font-bold leading-none">{user?.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">{user?.role}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-2xl p-2">
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal truncate px-2">
                {user?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer rounded-xl text-sm">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={getProfileLink()} className="cursor-pointer rounded-xl text-sm">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer rounded-xl text-sm"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}