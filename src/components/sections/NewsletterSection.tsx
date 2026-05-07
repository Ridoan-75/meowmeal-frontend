"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Subscribed successfully!");
    setEmail("");
    setLoading(false);
  };

  return (
    <section className="py-16 bg-secondary/50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Mail className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          Stay Updated
        </h2>
        <p className="text-muted-foreground mb-8">
          Subscribe to our newsletter and get exclusive deals, new restaurant
          alerts, and food tips delivered to your inbox.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="h-11 flex-1"
            required
          />
          <Button
            type="submit"
            disabled={loading}
            className="h-11 px-6 bg-primary hover:bg-primary-hover text-white shrink-0"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-4">
          No spam ever. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}