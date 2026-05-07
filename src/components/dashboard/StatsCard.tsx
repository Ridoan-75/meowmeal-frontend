import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  color?: "primary" | "green" | "blue" | "yellow";
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  color = "primary",
}: StatsCardProps) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    green: "bg-green-500/10 text-green-500",
    blue: "bg-blue-500/10 text-blue-500",
    yellow: "bg-accent/10 text-accent",
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
      <div
        className={cn(
          "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
          colorMap[color]
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}