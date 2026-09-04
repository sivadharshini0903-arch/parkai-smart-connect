import { Link } from "@tanstack/react-router";
import { BellRing } from "lucide-react";

import type { ParkAlert } from "@/lib/parking-engine";
import { cn } from "@/lib/utils";

const toneClass: Record<ParkAlert["tone"], string> = {
  critical: "border-destructive/30 bg-destructive/8",
  warning: "border-warning/45 bg-warning/15",
  success: "border-success/30 bg-success/8",
  info: "border-info/30 bg-info/8",
};

export function AlertsPanel({
  alerts,
  title = "Smart Alerts",
  limit = 5,
  className,
}: {
  alerts: ParkAlert[];
  title?: string;
  limit?: number;
  className?: string;
}) {
  const shown = alerts.slice(0, limit);

  return (
    <section className={cn("surface p-5", className)}>
      <header className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
          <BellRing className="h-4.5 w-4.5" />
        </span>
        <div>
          <h2 className="font-display text-base font-bold">{title}</h2>
          <p className="text-xs text-muted-foreground">
            Generated from occupancy thresholds and demo predictions
          </p>
        </div>
      </header>

      {shown.length === 0 ? (
        <p className="mt-4 rounded-xl bg-secondary p-4 text-sm text-muted-foreground">
          No alerts right now — every parking area is within normal occupancy limits.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {shown.map((alert) => (
            <li key={alert.id}>
              <Link
                to="/parking/$parkingId"
                params={{ parkingId: alert.parkingId }}
                className={cn(
                  "flex items-start gap-2.5 rounded-xl border p-3 text-sm transition-colors hover:bg-secondary",
                  toneClass[alert.tone],
                )}
              >
                <span aria-hidden>{alert.icon}</span>
                <span>{alert.message}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
