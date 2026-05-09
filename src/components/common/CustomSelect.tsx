"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  icon?: React.ReactNode;
  className?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  icon,
  className,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "h-11 px-4 rounded-xl border border-border bg-background text-sm font-medium",
          "flex items-center gap-2 min-w-[140px] w-full",
          "hover:border-primary/50 transition-all cursor-pointer",
          open && "border-primary ring-2 ring-primary/20"
        )}
      >
        {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
        <span className="flex-1 text-left truncate">
          {selected?.label}
        </span>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
          open && "rotate-180"
        )} />
      </button>

      {open && (
        <div className="absolute z-50 top-[calc(100%+6px)] left-0 right-0 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => { onChange(option.value); setOpen(false); }}
              className={cn(
                "w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-all cursor-pointer",
                "hover:bg-accent/20 hover:text-accent",
                value === option.value
                  ? "bg-accent/10 text-accent"
                  : "text-foreground"
              )}
            >
              {option.label}
              {value === option.value && (
                <Check className="h-3.5 w-3.5 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}