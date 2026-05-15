import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { AIChatbot } from "@/components/common/AIChatbot";
import { Toaster } from "@/components/ui/sonner";
import { LenisProvider } from "@/providers/LenisProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MeowMeal — Food Delivery",
  description: "Order delicious food from the best restaurants near you",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body
        className={`${plusJakartaSans.variable} font-sans antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <LenisProvider>
          <ThemeProvider>
            <QueryProvider>
              <AuthProvider>
                {children}
                <AIChatbot />
                <Toaster position="top-right" richColors theme="system" />
              </AuthProvider>
            </QueryProvider>
          </ThemeProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
