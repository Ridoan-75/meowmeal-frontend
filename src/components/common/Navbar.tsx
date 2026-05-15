"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";
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
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  UtensilsCrossed,
  Heart,
  ChevronDown,
  X,
  Menu,
  Home,
  UtensilsCrossed as MealsIcon,
  Store,
  Info,
  Phone,
  BookOpen,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { signOut } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/meals", label: "Meals", icon: MealsIcon },
  { href: "/providers", label: "Restaurants", icon: Store },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone },
  { href: "/blog", label: "Blog", icon: BookOpen },
];

export function Navbar() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { totalItems } = useCartStore();
  const { count: wishlistCount } = useWishlistStore();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll when mobile nav open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
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
              {isLoading && (
                <div className="hidden md:flex items-center gap-2">
                  <div className="h-11 w-24 rounded-xl bg-muted animate-pulse" />
                  <div className="h-11 w-24 rounded-xl bg-muted animate-pulse" />
                </div>
              )}

              {!isLoading && isAuthenticated && (
                <>
                  <NotificationBell />
                  {user?.role === "CUSTOMER" && (
                    <>
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
                    <Button className="h-11 px-5 rounded-xl text-sm font-semibold bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 transition-all cursor-pointer">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden flex items-center justify-center h-11 w-11 rounded-xl hover:bg-muted transition-all cursor-pointer border border-border/60"
              >
                <div className="relative h-5 w-5">
                  <Menu
                    className={cn(
                      "absolute inset-0 h-5 w-5 transition-all duration-300",
                      mobileOpen
                        ? "opacity-0 rotate-90 scale-50"
                        : "opacity-100 rotate-0 scale-100",
                    )}
                  />
                  <X
                    className={cn(
                      "absolute inset-0 h-5 w-5 transition-all duration-300",
                      mobileOpen
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 -rotate-90 scale-50",
                    )}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Nav Overlay ── */}
      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed top-0 left-0 right-0 bottom-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300 lg:hidden",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      />

      {/* Drawer — bigger, centered */}
      <div
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[380px] lg:hidden transition-all duration-300 ease-in-out",
          mobileOpen
            ? "opacity-100 scale-100 -translate-x-1/2 -translate-y-1/2"
            : "opacity-0 scale-90 -translate-x-1/2 -translate-y-[40%] pointer-events-none",
        )}
      >
        <div className="bg-card border border-border rounded-3xl shadow-2xl shadow-black/10 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="MeowMeal"
                width={36}
                height={36}
                className="rounded-xl"
              />
              <div>
                <p className="font-black text-sm text-primary tracking-tight">
                  MeowMeal
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Delicious food, fast delivery
                </p>
              </div>
            </div>
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="h-8 w-8 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1 p-3">
            {navLinks.map((link, index) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  style={{
                    transitionDelay: mobileOpen ? `${index * 40}ms` : "0ms",
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-200",
                    active
                      ? "text-primary bg-primary/10 border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                      active ? "bg-primary/15" : "bg-secondary",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  {link.label}
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}

            {!isLoading && isAuthenticated && (
              <Link
                href={getDashboardLink()}
                onClick={handleNavClick}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-200",
                  isActive(getDashboardLink())
                    ? "text-primary bg-primary/10 border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-xl flex items-center justify-center shrink-0",
                    isActive(getDashboardLink())
                      ? "bg-primary/15"
                      : "bg-secondary",
                  )}
                >
                  <LayoutDashboard className="h-4 w-4" />
                </div>
                Dashboard
                {isActive(getDashboardLink()) && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            )}
          </nav>

          {/* Auth Bottom */}
          <div className="p-3 border-t border-border/50">
            {!isLoading && !isAuthenticated && (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={handleNavClick}>
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-2xl text-sm font-semibold cursor-pointer"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={handleNavClick}>
                  <Button className="w-full h-11 rounded-2xl text-sm font-semibold bg-primary hover:bg-primary/90 text-white cursor-pointer shadow-lg shadow-primary/20">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {!isLoading && isAuthenticated && (
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={user?.image || ""} />
                  <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileOpen(false);
                  }}
                  className="h-9 w-9 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive flex items-center justify-center transition-all shrink-0"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
