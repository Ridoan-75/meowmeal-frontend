"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";
import { NotificationBell } from "@/components/common/NotificationBell";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Home, Menu } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface DashboardNavbarProps {
  onMenuClick?: () => void;
}

export function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem("meowmeal_token");
    router.push("/");
    router.refresh();
  };

  const getProfileLink = () => {
    if (user?.role === "ADMIN") return "/dashboard/admin/profile";
    if (user?.role === "PROVIDER") return "/dashboard/provider/profile";
    return "/dashboard/customer/profile";
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b border-border h-16 flex items-center px-4 sm:px-6">
      <div className="flex items-center justify-between w-full gap-4">

        {/* Left — Hamburger (mobile) + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={onMenuClick}
            className="md:hidden h-9 w-9 rounded-xl flex items-center justify-center hover:bg-muted transition-all cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="MeowMeal"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-black text-lg text-primary hidden sm:block">
              meowmeal
            </span>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationBell />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-muted transition-all cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image || ""} />
                  <AvatarFallback className="bg-primary text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col text-left">
                  <p className="text-xs font-semibold leading-none">{user?.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{user?.role}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal truncate">
                {user?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={getProfileLink()} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive cursor-pointer"
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