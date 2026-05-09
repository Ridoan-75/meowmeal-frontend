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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
    router.push("/");
    router.refresh();
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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20 lg:h-24 gap-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="MeowMeal"
              width={100}
              height={100}
              className="rounded-xl"
            />
            <span className="font-black text-xl text-primary hidden sm:block tracking-tight">
              MeowMeal
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-5 py-3 text-[15px] font-semibold transition-all duration-300",
                  isActive(link.href)
                    ? "text-primary"
                    : "text-foreground/70 hover:text-primary",
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute left-0 bottom-0 h-[2px] rounded-full bg-primary transition-all duration-300",
                    isActive(link.href) ? "w-full" : "w-0",
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Dark Mode */}
            <div className="flex items-center justify-center h-12 w-12 rounded-2xl border border-border bg-background shadow-sm cursor-pointer">
              <ThemeToggle />
            </div>

            {/* Auth Loading Skeleton */}
            {isLoading && (
              <div className="hidden md:flex items-center gap-2">
                <div className="h-10 w-20 rounded-2xl bg-muted animate-pulse" />
                <div className="h-10 w-20 rounded-2xl bg-muted animate-pulse" />
              </div>
            )}

            {/* Authenticated */}
            {!isLoading && isAuthenticated && (
              <>
                <NotificationBell />

                {user?.role === "CUSTOMER" && (
                  <>
                    <Link href="/dashboard/customer/wishlist">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-12 w-12 rounded-2xl hover:bg-primary/10 transition-all cursor-pointer"
                      >
                        <Heart className="h-5 w-5" />
                        {wishlistCount > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                            {wishlistCount > 9 ? "9+" : wishlistCount}
                          </span>
                        )}
                      </Button>
                    </Link>

                    <Link href="/dashboard/customer/cart">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-12 w-12 rounded-2xl hover:bg-primary/10 transition-all cursor-pointer"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        {totalItems > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                            {totalItems > 9 ? "9+" : totalItems}
                          </span>
                        )}
                      </Button>
                    </Link>
                  </>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-12 px-3 rounded-2xl flex items-center gap-2 hover:bg-muted transition-all cursor-pointer"
                    >
                      <Avatar className="h-9 w-9 border">
                        <AvatarImage src={user?.image || ""} />
                        <AvatarFallback className="bg-primary text-white font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="hidden sm:block h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-60 rounded-2xl p-2"
                  >
                    <DropdownMenuLabel>
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold">{user?.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                        <span className="w-fit rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {user?.role}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={getDashboardLink()}
                        className="cursor-pointer rounded-lg"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`${getDashboardLink()}/profile`}
                        className="cursor-pointer rounded-lg"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "CUSTOMER" && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard/customer/orders"
                          className="cursor-pointer rounded-lg"
                        >
                          <UtensilsCrossed className="mr-2 h-4 w-4" />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer rounded-lg text-destructive focus:text-destructive"
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
                    variant="outline"
                    className="h-12 px-6 rounded-2xl font-semibold border-border hover:border-primary hover:text-primary transition-all cursor-pointer"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="h-12 px-6 rounded-2xl font-semibold bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 transition-all cursor-pointer">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden flex flex-col items-center justify-center h-12 w-12 rounded-2xl hover:bg-muted transition-all cursor-pointer gap-1.5 border border-border">
                  <span
                    className={cn(
                      "block h-0.5 w-6 bg-foreground rounded-full transition-all duration-300",
                      mobileOpen ? "rotate-45 translate-y-2" : "",
                    )}
                  />
                  <span
                    className={cn(
                      "block h-0.5 bg-foreground rounded-full transition-all duration-300",
                      mobileOpen ? "opacity-0 w-0" : "w-4",
                    )}
                  />
                  <span
                    className={cn(
                      "block h-0.5 w-6 bg-foreground rounded-full transition-all duration-300",
                      mobileOpen ? "-rotate-45 -translate-y-2" : "",
                    )}
                  />
                </button>
              </SheetTrigger>

              <SheetContent side="right" className="w-80 p-0 [&>button]:hidden">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="relative overflow-hidden border-b border-border">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-accent/10" />
                    <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
                    <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-accent/20 blur-xl" />
                    <div className="relative flex flex-col items-center justify-center py-8 gap-3">
                      <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-lg shadow-primary/20 border-2 border-primary/20">
                        <Image
                          src="/logo.png"
                          alt="MeowMeal"
                          width={100}
                          height={100}
                          className="object-cover"
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-black text-xl text-primary tracking-tight">
                          MeowMeal
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Delicious food delivered fast
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Nav Links */}
                  <nav className="flex flex-col gap-1 p-5">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "relative flex items-center px-5 py-4 text-sm font-semibold rounded-xl transition-all duration-300",
                          isActive(link.href)
                            ? "text-primary bg-primary/5"
                            : "text-foreground/70 hover:text-primary hover:bg-muted",
                        )}
                      >
                        {link.label}
                        {isActive(link.href) && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-full" />
                        )}
                      </Link>
                    ))}
                    {!isLoading && isAuthenticated && (
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "relative flex items-center px-5 py-4 text-sm font-semibold rounded-xl transition-all duration-300",
                          isActive(getDashboardLink())
                            ? "text-primary bg-primary/5"
                            : "text-foreground/70 hover:text-primary hover:bg-muted",
                        )}
                      >
                        Dashboard
                        {isActive(getDashboardLink()) && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-full" />
                        )}
                      </Link>
                    )}
                  </nav>

                  {!isLoading && !isAuthenticated && (
                    <div className="mt-auto p-5 border-t border-border flex flex-col gap-3">
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        <Button
                          variant="outline"
                          className="w-full h-12 rounded-2xl cursor-pointer"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Button className="w-full h-12 rounded-2xl bg-primary hover:bg-primary-hover text-white cursor-pointer">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}

                  {!isLoading && isAuthenticated && (
                    <div className="mt-auto p-5 border-t border-border">
                      <Button
                        variant="outline"
                        className="w-full h-12 rounded-2xl border-destructive text-destructive hover:bg-destructive/10 cursor-pointer"
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
