import { cn } from "@/lib/utils";

export function OccupancyMeter({
  value,
  label,
  className,
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  const tone = value >= 90 ? "bg-destructive" : value >= 80 ? "bg-warning" : "bg-success";
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>{label ?? "Occupancy"}</span>
        <span className="tabular-nums text-foreground">{value}%</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Occupancy"}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-500", tone)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
