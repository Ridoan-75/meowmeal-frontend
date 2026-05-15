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
    primary: {
      icon: "bg-primary/10 text-primary border-primary/20",
      value: "text-primary",
      glow: "hover:shadow-primary/8",
      bar: "bg-primary",
    },
    green: {
      icon: "bg-green-500/10 text-green-500 border-green-500/20",
      value: "text-green-500",
      glow: "hover:shadow-green-500/8",
      bar: "bg-green-500",
    },
    blue: {
      icon: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      value: "text-blue-500",
      glow: "hover:shadow-blue-500/8",
      bar: "bg-blue-500",
    },
    yellow: {
      icon: "bg-accent/10 text-accent border-accent/20",
      value: "text-accent",
      glow: "hover:shadow-accent/8",
      bar: "bg-accent",
    },
  };

  const c = colorMap[color];

  return (
    <div className={cn(
      "relative bg-card border border-border rounded-3xl p-5 flex items-center gap-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group",
      c.glow
    )}>

      {/* Top accent bar */}
      <div className={cn("absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300", c.bar)} />

      {/* Icon */}
      <div className={cn(
        "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-110",
        c.icon
      )}>
        <Icon className="h-6 w-6" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {title}
        </p>
        <p className={cn("text-3xl font-extrabold leading-none", c.value)}>
          {value}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      {/* Bg watermark icon */}
      <div className="absolute -right-3 -bottom-3 opacity-[0.04] pointer-events-none">
        <Icon className="h-20 w-20" />
      </div>
    </div>
  );
}