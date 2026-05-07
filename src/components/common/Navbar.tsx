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
  ChefHat,
  Menu,
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  UtensilsCrossed,
  MapPin,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const publicLinks = [
  { href: "/meals", label: "Browse Meals" },
  { href: "/providers", label: "Restaurants" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const { totalItems } = useCartStore();
  const router = useRouter();
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

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="MeowMeal"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="font-bold text-xl text-primary hidden sm:block">
              meowmeal
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link
                  href="/blog"
                  className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  Blog
                </Link>
                <Link
                  href="/privacy"
                  className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  Privacy
                </Link>
              </>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <NotificationBell />

                {/* Cart — Customer only */}
                {user?.role === "CUSTOMER" && (
                  <Link href="/dashboard/customer/cart">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative rounded-full"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                          {totalItems > 9 ? "9+" : totalItems}
                        </span>
                      )}
                    </Button>
                  </Link>
                )}

                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative rounded-full h-9 w-9 p-0"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.image || ""} />
                        <AvatarFallback className="bg-primary text-white text-sm font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-xs text-muted-foreground font-normal truncate">
                          {user?.email}
                        </p>
                        <span className="inline-flex w-fit text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                          {user?.role}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()} className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`${getDashboardLink()}/profile`}
                        className="cursor-pointer"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "CUSTOMER" && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard/customer/orders"
                          className="cursor-pointer"
                        >
                          <UtensilsCrossed className="mr-2 h-4 w-4" />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                    )}
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
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary-hover text-white"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-full"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center gap-3 p-4 border-b border-border">
                    <Image
                      src="/logo.png"
                      alt="MeowMeal"
                      width={32}
                      height={32}
                      className="rounded-lg"
                    />
                    <span className="font-bold text-lg text-primary">
                      meowmeal
                    </span>
                  </div>

                  {/* Mobile Links */}
                  <nav className="flex flex-col p-4 gap-1">
                    {publicLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                    {isAuthenticated && (
                      <>
                        <Link
                          href="/blog"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                        >
                          Blog
                        </Link>
                        <Link
                          href={getDashboardLink()}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                        >
                          Dashboard
                        </Link>
                      </>
                    )}
                  </nav>

                  {/* Mobile Auth Buttons */}
                  {!isAuthenticated && (
                    <div className="mt-auto p-4 border-t border-border flex flex-col gap-2">
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Button className="w-full bg-primary hover:bg-primary-hover text-white">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Mobile Sign Out */}
                  {isAuthenticated && (
                    <div className="mt-auto p-4 border-t border-border">
                      <Button
                        variant="outline"
                        className="w-full text-destructive border-destructive hover:bg-destructive/10"
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