"use client";

import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">

        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 h-7 w-7 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted transition-all cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon */}
        <div className={cn(
          "h-14 w-14 rounded-2xl flex items-center justify-center mx-auto",
          variant === "danger" ? "bg-destructive/10" : "bg-yellow-500/10"
        )}>
          <AlertTriangle className={cn(
            "h-7 w-7",
            variant === "danger" ? "text-destructive" : "text-yellow-500"
          )} />
        </div>

        {/* Text */}
        <div className="text-center flex flex-col gap-2">
          <h3 className="text-lg font-extrabold">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 h-10 rounded-xl border border-border bg-background text-sm font-semibold hover:bg-muted transition-all cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer disabled:opacity-50",
              "flex items-center justify-center gap-2",
              variant === "danger"
                ? "bg-destructive hover:brightness-110 active:scale-[0.98] shadow-[0_2px_8px_rgba(239,68,68,0.3)]"
                : "bg-yellow-500 hover:brightness-110 active:scale-[0.98]"
            )}
          >
            {loading ? (
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}