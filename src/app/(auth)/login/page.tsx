"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LogIn, Sparkles, Users, Store, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";
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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const res = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (res.error) {
        toast.error(res.error.message || "Invalid credentials");
        return;
      }

      if (res.data?.token) {
        localStorage.setItem("meowmeal_token", res.data.token);
      }
      if (res.data?.user?.id) {
        localStorage.setItem("meowmeal_user_id", res.data.user.id);
      }

      toast.success("Welcome back!");
      router.push("/dashboard/customer");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (cred: typeof demoCredentials[0]) => {
    setValue("email", cred.email, { shouldValidate: true });
    setValue("password", cred.password, { shouldValidate: true });
    setActiveDemo(cred.role);
  };

  const handleGoogleLogin = async () => {
    await signIn.social({ provider: "google" });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-card border border-border rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/30 p-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-8">
            <Image src="/logo.png" alt="MeowMeal" width={100} height={100} className="rounded-xl" />
            <span className="font-black text-xl text-primary tracking-tight">MeowMeal</span>
          </Link>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl font-extrabold">Welcome back</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Sign in to continue ordering delicious food
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2.5">
              <p className="text-xl text-muted-foreground font-medium">Try a demo account</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {demoCredentials.map((cred) => (
                <button
                  key={cred.role}
                  type="button"
                  onClick={() => handleDemoLogin(cred)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 py-3 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer",
                    activeDemo === cred.role
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50 hover:bg-muted text-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                    activeDemo === cred.role ? "bg-primary/20" : "bg-muted"
                  )}>
                    <cred.icon className={cn(
                      "h-4 w-4 transition-all",
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
              <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={cn(
                  "h-11 rounded-xl",
                  errors.email && "border-destructive focus-visible:ring-destructive"
                )}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={cn(
                    "h-11 rounded-xl pr-10",
                    errors.password && "border-destructive focus-visible:ring-destructive"
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
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-11 rounded-xl text-sm font-bold text-white transition-all cursor-pointer mt-1",
                "bg-primary hover:brightness-110 active:scale-[0.98]",
                "flex items-center justify-center gap-2",
                "shadow-lg shadow-primary/25",
                loading && "opacity-80 cursor-not-allowed"
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
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground">or</span>
              </div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-11 rounded-xl border border-border text-sm font-semibold flex items-center justify-center gap-2 hover:bg-muted transition-all cursor-pointer active:scale-[0.98]"
            >
              Continue with Google
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-center text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}