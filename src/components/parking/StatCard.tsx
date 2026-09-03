import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: "primary" | "success" | "warning" | "info";
  className?: string;
}

const toneClass: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/12 text-success",
  warning: "bg-warning/20 text-warning-foreground",
  info: "bg-info/12 text-info",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
  className,
}: StatCardProps) {
  return (
    <div className={cn("surface lift p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
          {label}
        </p>
        {Icon && (
          <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", toneClass[tone])}>
            <Icon className="h-4.5 w-4.5" />
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-3xl font-bold tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
