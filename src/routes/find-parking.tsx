import { createFileRoute } from "@tanstack/react-router";
import { Filter, Loader2, RotateCcw, SearchX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ParkingCard } from "@/components/parking/ParkingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { DESTINATIONS, type ParkingStatus, type VehicleType } from "@/data/parking";
import { searchParking, DEMO_CLOCK_LABEL } from "@/lib/parking-engine";
import { useParkingStore } from "@/store/parking-store";

export const Route = createFileRoute("/find-parking")({
  validateSearch: (search: Record<string, unknown>) => ({
    destination: typeof search.destination === "string" ? search.destination : "",
  }),
  head: () => ({
    meta: [
      { title: "Find Parking in Chennai — ParkAI" },
      {
        name: "description",
        content:
          "Search Chennai parking areas by destination, date, time, distance and vehicle type, and compare availability with predicted occupancy.",
      },
      { property: "og:title", content: "Find Parking in Chennai — ParkAI" },
      {
        property: "og:description",
        content: "Compare live-style availability, price and predicted occupancy for every parking area.",
      },
    ],
  }),
  component: FindParking,
});

const VEHICLES: { value: VehicleType | "any"; label: string }[] = [
  { value: "any", label: "Any vehicle" },
  { value: "car", label: "Car / Hatchback" },
  { value: "suv", label: "SUV / Large car" },
  { value: "bike", label: "Two-wheeler" },
  { value: "ev", label: "Electric vehicle" },
];

const STATUSES: { value: ParkingStatus | "any"; label: string }[] = [
  { value: "any", label: "Any status" },
  { value: "available", label: "Spaces available" },
  { value: "limited", label: "Limited spaces" },
  { value: "full", label: "Full" },
];

function FindParking() {
  const { parkings } = useParkingStore();
  const { destination: initialDestination } = Route.useSearch();

  const [destination, setDestination] = useState(initialDestination);
  const [query, setQuery] = useState(initialDestination);
  const [date, setDate] = useState("2026-09-03");
  const [time, setTime] = useState("18:00");
  const [maxDistanceKm, setMaxDistanceKm] = useState(1.5);
  const [vehicleType, setVehicleType] = useState<VehicleType | "any">("any");
  const [status, setStatus] = useState<ParkingStatus | "any">("any");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDestination(initialDestination);
    setQuery(initialDestination);
  }, [initialDestination]);

  const results = useMemo(
    () => searchParking(parkings, { destination: query, maxDistanceKm, vehicleType, status }),
    [parkings, query, maxDistanceKm, vehicleType, status],
  );

  const runSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setQuery(destination);
    window.setTimeout(() => {
      setLoading(false);
      toast.success("Search updated", {
        description: `${searchParking(parkings, { destination, maxDistanceKm, vehicleType, status }).length} parking areas match your filters.`,
      });
    }, 500);
  };

  const reset = () => {
    setDestination("");
    setQuery("");
    setMaxDistanceKm(1.5);
    setVehicleType("any");
    setStatus("any");
    toast.info("Filters reset");
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <header>
        <h1 className="text-3xl font-bold sm:text-4xl">Find Parking</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Enter your destination and preferences. Availability, occupancy and predictions come from
          the ParkAI demo dataset ({DEMO_CLOCK_LABEL}) — not an official live parking feed.
        </p>
      </header>

      <form onSubmit={runSearch} className="surface mt-6 grid gap-4 p-5 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            list="destinations"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. T Nagar"
            className="mt-1.5"
          />
          <datalist id="destinations">
            {DESTINATIONS.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="time">Arrival time</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="vehicle">Vehicle type</Label>
          <Select value={vehicleType} onValueChange={(v) => setVehicleType(v as VehicleType | "any")}>
            <SelectTrigger id="vehicle" className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VEHICLES.map((v) => (
                <SelectItem key={v.value} value={v.value}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="lg:col-span-2">
          <Label htmlFor="distance">
            Preferred parking distance · up to {maxDistanceKm.toFixed(1)} km
          </Label>
          <Slider
            id="distance"
            className="mt-4"
            min={0.2}
            max={2}
            step={0.1}
            value={[maxDistanceKm]}
            onValueChange={([v]) => setMaxDistanceKm(v)}
          />
        </div>
        <div>
          <Label htmlFor="status">Availability</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as ParkingStatus | "any")}>
            <SelectTrigger id="status" className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-2 lg:col-span-2">
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Filter className="mr-1.5 h-4 w-4" />}
            {loading ? "Searching…" : "Search parking"}
          </Button>
          <Button type="button" variant="outline" onClick={reset}>
            <RotateCcw className="mr-1.5 h-4 w-4" />
            Reset
          </Button>
        </div>
      </form>

      <div className="mt-8 flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-bold">
          {results.length} parking {results.length === 1 ? "area" : "areas"} found
          {query ? ` near “${query}”` : ""}
        </h2>
        <p className="text-xs text-muted-foreground">Sorted by highest free-space ratio</p>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="surface h-80 animate-pulse bg-secondary/60" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="surface mt-6 grid place-items-center gap-3 p-14 text-center">
          <SearchX className="h-10 w-10 text-muted-foreground" />
          <h3 className="font-display text-lg font-bold">No parking matches these filters</h3>
          <p className="max-w-md text-sm text-muted-foreground">
            Try increasing the preferred distance, choosing “Any status”, or searching a different
            destination such as “Guindy” or “Velachery”.
          </p>
          <Button variant="outline" onClick={reset}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((p) => (
            <ParkingCard key={p.parkingId} parking={p} />
          ))}
        </div>
      )}
    </div>
  );
}
