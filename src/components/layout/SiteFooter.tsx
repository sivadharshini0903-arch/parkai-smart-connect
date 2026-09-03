import { Link } from "@tanstack/react-router";
import { CircleParking } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <CircleParking className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold">ParkAI</span>
          </div>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            AI-Based Smart Parking Management &amp; Prediction System for Chennai. ParkAI combines
            live-style availability, interactive mapping and forecasted occupancy so drivers decide
            where to park before they arrive.
          </p>
          <p className="mt-4 rounded-lg bg-secondary px-3 py-2 text-xs text-secondary-foreground">
            Demo build: parking availability and predictions are simulated sample data, not an
            official real-time parking feed.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Product</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/find-parking" className="hover:text-foreground">
                Find Parking
              </Link>
            </li>
            <li>
              <Link to="/live-map" className="hover:text-foreground">
                Live Map
              </Link>
            </li>
            <li>
              <Link to="/ai-prediction" className="hover:text-foreground">
                AI Prediction
              </Link>
            </li>
            <li>
              <Link to="/recommendations" className="hover:text-foreground">
                Recommendations
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Project</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-foreground">
                About &amp; Architecture
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-foreground">
                Admin Dashboard
              </Link>
            </li>
            <li>Map data © OpenStreetMap contributors</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
        ParkAI – AI-Based Smart Parking Management &amp; Prediction System · CSE-AIML academic
        project
      </div>
    </footer>
  );
}
