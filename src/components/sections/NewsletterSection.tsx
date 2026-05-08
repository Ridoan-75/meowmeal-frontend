"use client";

import { useState } from "react";
import { Mail, CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { AxiosError } from "axios";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await api.post("/newsletter", { email });
      setSubscribed(true);
      toast.success("You are now subscribed!", { icon: "🎉" });
      setEmail("");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-[#12122a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Background blobs */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative px-6 py-16 sm:px-12 lg:px-20">
          {subscribed ? (
            /* Success State */
            <div className="flex flex-col items-center text-center gap-6 py-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-400" />
                </div>
                <div className="absolute inset-0 rounded-full bg-green-500/10 animate-ping" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                  You are subscribed!
                </h2>
                <p className="text-white/50 text-sm max-w-sm">
                  Thank you! You will receive exclusive deals and food updates
                  from MeowMeal.
                </p>
              </div>
              <button
                onClick={() => setSubscribed(false)}
                className="text-xs text-primary hover:text-primary/80 underline transition-colors"
              >
                Subscribe another email
              </button>
            </div>
          ) : (
            /* Default State */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left */}
              <div className="flex flex-col gap-5">
                <div className="inline-flex w-fit items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-primary/30">
                  <Sparkles className="h-4 w-4" />
                  Newsletter
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
                  Get the Best Deals{" "}
                  <span className="text-primary">Delivered</span> to Your Inbox
                </h2>

                <p className="text-white/50 text-sm leading-relaxed max-w-md">
                  Subscribe and get exclusive deals, new restaurant alerts, and
                  food tips delivered directly to your inbox. No spam, ever.
                </p>

                {/* Features */}
                <div className="flex flex-col gap-2">
                  {[
                    "Exclusive deals and discounts",
                    "New restaurant alerts",
                    "Weekly food tips and recipes",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-white/60 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Form */}
              {/* Right — Form */}
              <div className="flex flex-col gap-4">
                <div className="bg-white/8 border border-white/15 rounded-2xl p-8 flex flex-col gap-6 backdrop-blur-sm">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-white font-extrabold text-xl">
                      Subscribe Now
                    </h3>
                    <p className="text-white/40 text-sm">
                      Join 10,000+ food lovers today
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="h-13 pl-11 rounded-xl bg-white/8 border-white/15 text-white placeholder:text-white/25 focus-visible:ring-primary focus-visible:border-primary text-sm"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="h-13 w-full rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-base shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] transition-all"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Subscribing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Subscribe for Free
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>

                  <div className="flex items-center gap-3 pt-1 border-t border-white/10">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-green-400"
                        />
                      ))}
                    </div>
                    <p className="text-white/25 text-xs">
                      No spam ever. Unsubscribe at any time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
