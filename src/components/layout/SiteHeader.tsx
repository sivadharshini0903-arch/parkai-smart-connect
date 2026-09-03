import { Link } from "@tanstack/react-router";
import { CircleParking, Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/find-parking", label: "Find Parking" },
  { to: "/live-map", label: "Live Map" },
  { to: "/ai-prediction", label: "AI Prediction" },
  { to: "/recommendations", label: "Recommendations" },
  { to: "/about", label: "About" },
  { to: "/admin", label: "Admin Dashboard" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-card">
            <CircleParking className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold">ParkAI</span>
            <span className="block text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
              Find it. Park it. Done.
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-0.5 xl:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-2">
          <Button asChild size="sm" className="hidden shadow-card sm:inline-flex">
            <Link to="/find-parking">Find Parking</Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="xl:hidden"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card xl:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-3 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "bg-accent text-accent-foreground" }}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="mt-2 sm:hidden">
              <Link to="/find-parking" onClick={() => setOpen(false)}>
                Find Parking
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
