import type { DemandLevel, ParkingStatus } from "@/data/parking";
import { cn } from "@/lib/utils";

const statusStyles: Record<ParkingStatus, string> = {
  available: "bg-success/12 text-success ring-success/25",
  limited: "bg-warning/25 text-warning-foreground ring-warning/40",
  full: "bg-destructive/12 text-destructive ring-destructive/25",
};

const statusText: Record<ParkingStatus, string> = {
  available: "Available",
  limited: "Limited",
  full: "Full",
};

const demandStyles: Record<DemandLevel, string> = {
  low: "bg-success/12 text-success ring-success/25",
  moderate: "bg-info/12 text-info ring-info/25",
  high: "bg-destructive/12 text-destructive ring-destructive/25",
};

const base =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset";

export function StatusBadge({ status, className }: { status: ParkingStatus; className?: string }) {
  return (
    <span className={cn(base, statusStyles[status], className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusText[status]}
    </span>
  );
}

export function DemandBadge({ level, className }: { level: DemandLevel; className?: string }) {
  return (
    <span className={cn(base, demandStyles[level], className)}>
      {level === "low" ? "Low" : level === "moderate" ? "Moderate" : "High"} demand
    </span>
  );
}
