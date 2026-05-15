"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LogIn, Users, Store, Shield } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginInput = z.infer<typeof loginSchema>;

const demoCredentials = [
  { role: "Customer", email: "rahim@gmail.com", password: "password123", icon: Users },
  { role: "Provider", email: "salamsbistro@gmail.com", password: "password123", icon: Store },
  { role: "Admin", email: "admin@meowmeal.com", password: "password123", icon: Shield },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const res = await signIn.email({ email: data.email, password: data.password });
      if (res.error) { toast.error(res.error.message || "Invalid credentials"); return; }
      if (res.data?.token) localStorage.setItem("meowmeal_token", res.data.token);
      if (res.data?.user?.id) localStorage.setItem("meowmeal_user_id", res.data.user.id);
      toast.success("Welcome back!");
      const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${res.data?.token || localStorage.getItem("meowmeal_token")}` },
      });
      const meData = await meRes.json();
      const role = meData?.data?.role;
      if (role === "ADMIN") window.location.assign("/dashboard/admin");
      else if (role === "PROVIDER") window.location.assign("/dashboard/provider");
      else window.location.assign("/dashboard/customer");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (cred: (typeof demoCredentials)[0]) => {
    setValue("email", cred.email, { shouldValidate: true });
    setValue("password", cred.password, { shouldValidate: true });
    setActiveDemo(cred.role);
  };

  const handleGoogleLogin = async () => {
    await signIn.social({ provider: "google", callbackURL: "https://meowmeal-frontend.vercel.app/auth/callback" });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-accent/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/4 blur-3xl" />
      </div>

      <div className="w-full max-w-[440px] relative z-10">

        {/* Card */}
        <div className="relative bg-card border border-border rounded-3xl p-8 shadow-2xl shadow-primary/5">

          {/* Card top orange bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-t-3xl" />

          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2.5 mb-7 group">
            <Image
              src="/logo.png"
              alt="MeowMeal"
              width={44}
              height={44}
              className="rounded-xl group-hover:scale-105 transition-transform"
            />
            <span className="text-primary text-xl font-black tracking-tight">MeowMeal</span>
          </Link>

          {/* Heading */}
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight">Welcome back 👋</h1>
            <p className="text-muted-foreground text-sm mt-1.5">
              Sign in to continue ordering delicious food
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
              Try a demo account
            </p>
            <div className="grid grid-cols-3 gap-2">
              {demoCredentials.map((cred) => (
                <button
                  key={cred.role}
                  type="button"
                  onClick={() => handleDemoLogin(cred)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border text-xs font-semibold transition-all duration-200 cursor-pointer",
                    activeDemo === cred.role
                      ? "border-primary/40 bg-primary/8 text-primary"
                      : "border-border bg-background hover:border-primary/30 hover:bg-primary/5 text-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-xl flex items-center justify-center transition-colors",
                    activeDemo === cred.role ? "bg-primary/15" : "bg-muted"
                  )}>
                    <cred.icon className={cn(
                      "h-4 w-4",
                      activeDemo === cred.role ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  {cred.role}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={cn(
                  "h-11 rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-colors",
                  errors.email && "border-red-500/50"
                )}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={cn(
                    "h-11 rounded-xl bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30 focus-visible:border-primary/50 pr-10 transition-colors",
                    errors.password && "border-red-500/50"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-11 rounded-xl text-sm font-bold text-white transition-all duration-200 cursor-pointer mt-1",
                "bg-primary hover:bg-primary/90 active:scale-[0.98]",
                "flex items-center justify-center gap-2",
                "shadow-lg shadow-primary/25 hover:shadow-primary/40",
                loading && "opacity-70 cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-widest">
                <span className="bg-card px-3 text-muted-foreground">or</span>
              </div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-11 rounded-xl border border-border bg-background text-sm font-semibold text-foreground flex items-center justify-center gap-2.5 hover:bg-muted hover:border-primary/30 transition-all duration-200 cursor-pointer active:scale-[0.98]"
            >
              <FaGoogle className="h-3.5 w-3.5 text-red-500" />
              Continue with Google
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-center text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:text-primary/80 font-bold transition-colors">
              Sign up
            </Link>
          </p>
        </div>

        {/* Bottom tagline */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          🍽️ Fresh food, fast delivery — MeowMeal
        </p>
      </div>
    </div>
  );
}