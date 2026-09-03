import { Link } from "@tanstack/react-router";
import { Clock, Footprints, IndianRupee, MapPin, Navigation, Star, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { OccupancyMeter } from "@/components/parking/OccupancyMeter";
import { DemandBadge, StatusBadge } from "@/components/parking/StatusBadge";
import { Button } from "@/components/ui/button";
import type { Parking } from "@/lib/parking-engine";
import { cn } from "@/lib/utils";

export function ParkingCard({
  parking,
  badges,
  highlight,
  className,
}: {
  parking: Parking;
  badges?: string[];
  highlight?: boolean;
  className?: string;
}) {
  const openNavigation = () => {
    const url = `https://www.openstreetmap.org/directions?to=${parking.latitude}%2C${parking.longitude}`;
    toast.success(`Navigation started to ${parking.name}`, {
      description: "Opening turn-by-turn directions in a new tab.",
    });
    if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      className={cn(
        "surface lift flex h-full flex-col p-5",
        highlight && "ring-2 ring-primary/40",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-bold">{parking.name}</h3>
          <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-2">{parking.address}</span>
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-semibold">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          {parking.rating.toFixed(1)}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <StatusBadge status={parking.status} />
        <DemandBadge level={parking.demandLevel} />
        {badges?.map((b) => (
          <span
            key={b}
            className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20 ring-inset"
          >
            {b}
          </span>
        ))}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs text-muted-foreground">Available</dt>
          <dd className="font-display text-xl font-bold text-success tabular-nums">
            {parking.available}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Capacity</dt>
          <dd className="font-display text-xl font-bold tabular-nums">{parking.capacity}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Distance</dt>
          <dd className="font-display text-xl font-bold tabular-nums">
            {parking.distanceKm.toFixed(1)}
            <span className="text-sm font-medium"> km</span>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Price / hour</dt>
          <dd className="flex items-center font-display text-xl font-bold tabular-nums">
            <IndianRupee className="h-4 w-4" />
            {parking.pricePerHour}
          </dd>
        </div>
      </dl>

      <OccupancyMeter value={parking.occupancyPercentage} className="mt-4" />

      <div className="mt-4 grid gap-2 rounded-xl bg-secondary/70 p-3 text-xs sm:grid-cols-2">
        <p className="flex items-center gap-1.5 text-secondary-foreground">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          Predicted availability in 30 min:{" "}
          <strong className="tabular-nums">{100 - parking.prediction.next30}%</strong>
        </p>
        <p className="flex items-center gap-1.5 text-secondary-foreground">
          <Footprints className="h-3.5 w-3.5 text-primary" />
          {parking.walkingTime} min walk to destination
        </p>
        <p className="flex items-center gap-1.5 text-secondary-foreground">
          <Clock className="h-3.5 w-3.5 text-primary" />
          {parking.openingHours}
        </p>
        <p className="text-muted-foreground">
          {parking.prediction.minutesToFull !== null
            ? `Likely full in ~${parking.prediction.minutesToFull} min`
            : "No fill-up risk in the next 4 hours"}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <Button asChild className="flex-1">
          <Link to="/parking/$parkingId" params={{ parkingId: parking.parkingId }}>
            View Details
          </Link>
        </Button>
        <Button variant="outline" className="flex-1" onClick={openNavigation}>
          <Navigation className="mr-1.5 h-4 w-4" />
          Navigate
        </Button>
      </div>
    </article>
  );
}
