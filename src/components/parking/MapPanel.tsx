import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import type { ParkingMapProps } from "@/components/parking/ParkingMap";
import { cn } from "@/lib/utils";

const ParkingMap = lazy(() => import("@/components/parking/ParkingMap"));

function MapSkeleton({ height }: { height: number }) {
  return (
    <div
      className="city-grid grid animate-pulse place-items-center rounded-xl bg-secondary"
      style={{ height }}
    >
      <p className="text-sm font-medium text-muted-foreground">Loading interactive map…</p>
    </div>
  );
}

export function MapPanel({ className, ...props }: ParkingMapProps & { className?: string }) {
  const height = props.height ?? 560;
  return (
    <div className={cn("overflow-hidden", className)}>
      <ClientOnly fallback={<MapSkeleton height={height} />}>
        <Suspense fallback={<MapSkeleton height={height} />}>
          <ParkingMap {...props} />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
