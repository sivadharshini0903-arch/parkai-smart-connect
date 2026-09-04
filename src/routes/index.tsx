import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  CarFront,
  CircleParking,
  Gauge,
  LayoutDashboard,
  Map,
  ParkingCircle,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AlertsPanel } from "@/components/parking/AlertsPanel";
import { MapPanel } from "@/components/parking/MapPanel";
import { ParkingCard } from "@/components/parking/ParkingCard";
import { StatCard } from "@/components/parking/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEMO_CLOCK_LABEL } from "@/lib/parking-engine";
import { useParkingStore } from "@/store/parking-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ParkAI — Park Smarter, Arrive Faster in Chennai" },
      {
        name: "description",
        content:
          "ParkAI shows available parking across Chennai, predicts future occupancy and recommends the smartest parking area before you arrive.",
      },
      { property: "og:title", content: "ParkAI — Park Smarter, Arrive Faster" },
      {
        property: "og:description",
        content:
          "Find it. Park it. Done. Live-style availability, AI occupancy prediction and smart parking recommendations.",
      },
    ],
  }),
  component: Home,
});

const FEATURES = [
  {
    icon: Gauge,
    title: "Real-Time Availability",
    body: "Every parking area reports capacity, occupied bays and free spaces, with occupancy recalculated on every update.",
  },
  {
    icon: Brain,
    title: "AI Parking Prediction",
    body: "A demo prediction engine forecasts occupancy 30 minutes, 1 hour and 2 hours ahead with a confidence score.",
  },
  {
    icon: Sparkles,
    title: "Smart Recommendations",
    body: "Availability, distance, price and predicted availability are scored together to rank the best place to park.",
  },
  {
    icon: Map,
    title: "Live Interactive Map",
    body: "OpenStreetMap markers at real Chennai coordinates, colour-coded by availability with filters and a legend.",
  },
];

const STEPS = [
  { icon: Search, title: "Search", body: "Enter your destination, time and vehicle type." },
  { icon: ParkingCircle, title: "Discover", body: "See nearby parking areas ranked by availability." },
  { icon: TrendingUp, title: "Predict", body: "Check forecasted occupancy before you drive." },
  { icon: CarFront, title: "Park", body: "Navigate straight to the recommended parking bay." },
];

function Home() {
  const { parkings, stats, alerts } = useParkingStore();
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");

  const topPicks = [...parkings]
    .sort((a, b) => b.available / b.capacity - a.available / a.capacity)
    .slice(0, 3);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      toast.error("Enter a destination", { description: "Try “T Nagar” or “Marina Beach”." });
      return;
    }
    navigate({ to: "/find-parking", search: { destination: destination.trim() } });
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient border-b border-border">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-primary ring-1 ring-primary/20 ring-inset">
              <CircleParking className="h-3.5 w-3.5" />
              AI-Based Smart Parking Management &amp; Prediction System
            </span>
            <h1 className="mt-5 text-4xl font-bold sm:text-5xl lg:text-6xl">
              Park Smarter. <span className="text-gradient">Arrive Faster.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              Find available parking, predict future availability, and choose the smartest parking
              location before you arrive.
            </p>

            <form onSubmit={submit} className="surface mt-8 flex flex-col gap-2 p-3 sm:flex-row">
              <label className="sr-only" htmlFor="hero-destination">
                Destination
              </label>
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="hero-destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where are you going? e.g. T Nagar"
                  className="h-11 border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
                />
              </div>
              <Button type="submit" size="lg" className="shadow-card">
                Find Parking
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/live-map">View Live Map</Link>
              </Button>
            </form>

            <p className="mt-3 text-xs text-muted-foreground">
              Demo dataset · {DEMO_CLOCK_LABEL} · 12 Chennai parking areas simulated
            </p>
          </div>

          <div className="surface overflow-hidden p-3">
            <MapPanel parkings={parkings} height={420} zoom={11} />
            <p className="px-1 pt-3 text-xs text-muted-foreground">
              Live-style map of Chennai parking areas — markers show currently free spaces.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Parking Areas" value={stats.areas} icon={ParkingCircle} hint="Across Chennai city" />
          <StatCard
            label="Total Spaces"
            value={stats.totalSpaces.toLocaleString("en-IN")}
            icon={CarFront}
            tone="info"
            hint="Combined network capacity"
          />
          <StatCard
            label="Available Spaces"
            value={stats.availableSpaces.toLocaleString("en-IN")}
            icon={CircleParking}
            tone="success"
            hint="Free right now"
          />
          <StatCard
            label="Average Occupancy"
            value={`${stats.averageOccupancy}%`}
            icon={Gauge}
            tone="warning"
            hint={`${stats.highDemandCount} areas in high demand`}
          />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">Everything a driver needs, in one place</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          ParkAI moves beyond “how many spaces are free now” and answers the harder question: how
          many will still be free when you get there.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <article key={title} className="surface lift p-5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">How ParkAI works</h2>
          <p className="mt-2 text-sm text-muted-foreground">Search → Discover → Predict → Park</p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="relative rounded-xl border border-border bg-background p-5">
                <span className="font-display text-xs font-bold tracking-widest text-primary">
                  STEP {i + 1}
                </span>
                <span className="mt-3 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 font-display text-base font-bold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Top picks + alerts */}
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Most available right now</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ranked by free space ratio across the demo network.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/find-parking">
                Browse all parking <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topPicks.map((p) => (
              <ParkingCard key={p.parkingId} parking={p} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <AlertsPanel alerts={alerts} title="Your parking alerts" />
          <div className="surface p-5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <LayoutDashboard className="h-4.5 w-4.5" />
            </span>
            <h3 className="mt-3 font-display text-base font-bold">Operating a parking network?</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              The admin dashboard tracks occupancy trends, peak hours and predicted demand, and lets
              operators update capacity and pricing live.
            </p>
            <Button asChild className="mt-4 w-full">
              <Link to="/admin">Open Admin Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
