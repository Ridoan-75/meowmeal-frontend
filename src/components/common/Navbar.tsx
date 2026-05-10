"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  UtensilsCrossed,
  Heart,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { signOut } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/meals", label: "Meals" },
  { href: "/providers", label: "Restaurants" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

export function Navbar() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { totalItems } = useCartStore();
  const { count: wishlistCount } = useWishlistStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem("meowmeal_token");
    localStorage.removeItem("meowmeal_user_id");
    window.location.href = "/";
  };

  const getDashboardLink = () => {
    if (!user) return "/dashboard";
    if (user.role === "ADMIN") return "/dashboard/admin";
    if (user.role === "PROVIDER") return "/dashboard/provider";
    return "/dashboard/customer";
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <Image
              src="/logo.png"
              alt="MeowMeal"
              width={100}
              height={100}
              className="rounded-xl transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-black text-xl text-primary hidden sm:block tracking-tight">
              MeowMeal
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200",
                  isActive(link.href)
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Theme Toggle */}
            <div className="flex items-center justify-center h-11 w-11 rounded-xl border border-border/60 bg-background hover:bg-muted transition-all cursor-pointer">
              <ThemeToggle />
            </div>

            {/* Auth Loading Skeleton */}
            {isLoading && (
              <div className="hidden md:flex items-center gap-2">
                <div className="h-11 w-24 rounded-xl bg-muted animate-pulse" />
                <div className="h-11 w-24 rounded-xl bg-muted animate-pulse" />
              </div>
            )}

            {/* Authenticated */}
            {!isLoading && isAuthenticated && (
              <>
                <NotificationBell />

                {user?.role === "CUSTOMER" && (
                  <>
                    {/* Wishlist */}
                    <Link href="/dashboard/customer/wishlist">
                      <button className="relative flex items-center justify-center h-11 w-11 rounded-xl border border-border/60 bg-background hover:bg-muted transition-all cursor-pointer">
                        <Heart className="h-5 w-5 text-muted-foreground" />
                        {wishlistCount > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                            {wishlistCount > 9 ? "9+" : wishlistCount}
                          </span>
                        )}
                      </button>
                    </Link>

                    {/* Cart */}
                    <Link href="/dashboard/customer/cart">
                      <button className="relative flex items-center justify-center h-11 w-11 rounded-xl border border-border/60 bg-background hover:bg-muted transition-all cursor-pointer">
                        <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                        {totalItems > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                            {totalItems > 9 ? "9+" : totalItems}
                          </span>
                        )}
                      </button>
                    </Link>
                  </>
                )}

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 h-11 px-3 rounded-xl border border-border/60 bg-background hover:bg-muted transition-all cursor-pointer outline-none">
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarImage src={user?.image || ""} />
                        <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:block text-sm font-semibold max-w-[80px] truncate">
                        {user?.name?.split(" ")[0]}
                      </span>
                      <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    side="bottom"
                    sideOffset={8}
                    collisionPadding={16}
                    className="w-56 rounded-2xl p-2"
                  >
                    <DropdownMenuLabel>
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-sm truncate">
                          {user?.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                        <span className="w-fit rounded-lg bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wide mt-0.5">
                          {user?.role}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={getDashboardLink()}
                        className="cursor-pointer rounded-xl text-sm"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`${getDashboardLink()}/profile`}
                        className="cursor-pointer rounded-xl text-sm"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "CUSTOMER" && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard/customer/orders"
                          className="cursor-pointer rounded-xl text-sm"
                        >
                          <UtensilsCrossed className="mr-2 h-4 w-4" />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer rounded-xl text-sm text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Not Authenticated */}
            {!isLoading && !isAuthenticated && (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="h-11 px-5 rounded-xl text-sm font-semibold hover:bg-muted transition-all cursor-pointer"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="h-11 px-5 rounded-xl text-sm font-semibold bg-primary hover:brightness-110 text-white shadow-md shadow-primary/20 transition-all cursor-pointer">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden flex flex-col items-center justify-center h-11 w-11 rounded-xl hover:bg-muted transition-all cursor-pointer gap-[5px] border border-border/60">
                  <span
                    className={cn(
                      "block h-0.5 w-5 bg-foreground rounded-full transition-all duration-300",
                      mobileOpen ? "rotate-45 translate-y-[7px]" : "",
                    )}
                  />
                  <span
                    className={cn(
                      "block h-0.5 bg-foreground rounded-full transition-all duration-300",
                      mobileOpen ? "opacity-0 w-0" : "w-3",
                    )}
                  />
                  <span
                    className={cn(
                      "block h-0.5 w-5 bg-foreground rounded-full transition-all duration-300",
                      mobileOpen ? "-rotate-45 -translate-y-[7px]" : "",
                    )}
                  />
                </button>
              </SheetTrigger>

              <SheetContent side="right" className="w-72 p-0 [&>button]:hidden">
                <VisuallyHidden>
                  <SheetTitle>Navigation Menu</SheetTitle>
                </VisuallyHidden>
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="border-b border-border/50 px-5 py-6 flex items-center gap-3">
                    <Image
                      src="/logo.png"
                      alt="MeowMeal"
                      width={100}
                      height={100}
                    />
                    <div>
                      <p className="font-black text-base text-primary tracking-tight">
                        MeowMeal
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Delicious food, fast delivery
                      </p>
                    </div>
                  </div>

                  {/* Mobile Nav Links */}
                  <nav className="flex flex-col gap-0.5 p-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200",
                          isActive(link.href)
                            ? "text-primary bg-primary/8"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted",
                        )}
                      >
                        {isActive(link.href) && (
                          <span className="mr-2.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        )}
                        {link.label}
                      </Link>
                    ))}
                    {!isLoading && isAuthenticated && (
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200",
                          isActive(getDashboardLink())
                            ? "text-primary bg-primary/8"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted",
                        )}
                      >
                        {isActive(getDashboardLink()) && (
                          <span className="mr-2.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        )}
                        Dashboard
                      </Link>
                    )}
                  </nav>

                  {/* Mobile Auth — bottom */}
                  {!isLoading && !isAuthenticated && (
                    <div className="mt-auto p-4 border-t border-border/50 flex flex-col gap-2">
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        <Button
                          variant="outline"
                          className="w-full h-11 rounded-xl text-sm font-semibold cursor-pointer"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Button className="w-full h-11 rounded-xl text-sm font-semibold bg-primary hover:brightness-110 text-white cursor-pointer">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}

                  {!isLoading && isAuthenticated && (
                    <div className="mt-auto p-4 border-t border-border/50">
                      <Button
                        variant="outline"
                        className="w-full h-11 rounded-xl text-sm font-semibold border-destructive/40 text-destructive hover:bg-destructive/10 cursor-pointer"
                        onClick={() => {
                          handleSignOut();
                          setMobileOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
