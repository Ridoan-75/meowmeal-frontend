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
  {
    role: "Customer",
    email: "rahim@gmail.com",
    password: "password123",
    icon: Users,
  },
  {
    role: "Provider",
    email: "salamsbistro@gmail.com",
    password: "password123",
    icon: Store,
  },
  {
    role: "Admin",
    email: "admin@meowmeal.com",
    password: "password123",
    icon: Shield,
  },
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

      const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${res.data?.token || localStorage.getItem("meowmeal_token")}`,
        },
      });
      const meData = await meRes.json();
      const role = meData?.data?.role;

      if (role === "ADMIN") {
        window.location.assign("/dashboard/admin");
      } else if (role === "PROVIDER") {
        window.location.assign("/dashboard/provider");
      } else {
        window.location.assign("/dashboard/customer");
      }
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
  await signIn.social({
    provider: "google",
    callbackURL: "https://meowmeal-frontend.vercel.app/dashboard/customer",
  });
};

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-orange-500/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-orange-400/6 blur-[120px] pointer-events-none" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="w-full max-w-[420px] relative z-10">
        {/* Card */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-7 backdrop-blur-sm shadow-2xl shadow-black/40">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="MeowMeal"
              width={100}
              height={100}
              className="rounded-xl"
            />
            <span className="text-white text-xl font-bold ">MeowMeal</span>
          </Link>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-white text-2xl font-bold">Welcome back</h1>
            <p className="text-zinc-500 text-sm mt-1">
              Sign in to continue ordering delicious food
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mb-6">
            <p className="text-zinc-400 text-sm font-medium mb-2.5">
              Try a demo account
            </p>
            <div className="grid grid-cols-3 gap-2">
              {demoCredentials.map((cred) => (
                <button
                  key={cred.role}
                  type="button"
                  onClick={() => handleDemoLogin(cred)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 py-3 px-3 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer",
                    activeDemo === cred.role
                      ? "border-orange-500/50 bg-orange-500/10 text-orange-400"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-700 text-zinc-400",
                  )}
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
                      activeDemo === cred.role
                        ? "bg-orange-500/20"
                        : "bg-zinc-800",
                    )}
                  >
                    <cred.icon
                      className={cn(
                        "h-4 w-4",
                        activeDemo === cred.role
                          ? "text-orange-400"
                          : "text-zinc-500",
                      )}
                    />
                  </div>
                  {cred.role}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3.5"
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold text-zinc-400 uppercase tracking-wider"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className={cn(
                  "h-11 rounded-xl bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-orange-500/30 focus-visible:border-orange-500/50 transition-colors",
                  errors.email && "border-red-500/50",
                )}
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-semibold text-zinc-400 uppercase tracking-wider"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={cn(
                    "h-11 rounded-xl bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-orange-500/30 focus-visible:border-orange-500/50 pr-9 transition-colors",
                    errors.password && "border-red-500/50",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-11 rounded-xl text-sm font-semibold text-white transition-all duration-200 cursor-pointer mt-1",
                "bg-orange-500 hover:bg-orange-400 active:scale-[0.98]",
                "flex items-center justify-center gap-2",
                "shadow-lg shadow-orange-500/20",
                loading && "opacity-70 cursor-not-allowed",
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
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-widest">
                <span className="bg-zinc-900/60 px-3 text-zinc-600">or</span>
              </div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-11 rounded-xl border border-zinc-800 bg-zinc-900 text-sm font-medium text-zinc-300 flex items-center justify-center gap-2.5 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white transition-all duration-200 cursor-pointer active:scale-[0.98]"
            >
              <FaGoogle className="h-3.5 w-3.5 text-red-400" />
              Continue with Google
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-center text-zinc-600 mt-5">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
