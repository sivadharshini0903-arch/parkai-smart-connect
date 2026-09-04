import { Brain, CircleAlert, Sparkles } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { DemandBadge } from "@/components/parking/StatusBadge";
import { predictionSeries, type Parking } from "@/lib/parking-engine";
import { cn } from "@/lib/utils";

export function PredictionCard({ parking, className }: { parking: Parking; className?: string }) {
  const series = predictionSeries(parking);
  const p = parking.prediction;

  return (
    <section className={cn("surface p-6", className)}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Brain className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-lg font-bold">AI Occupancy Prediction</h2>
            <p className="text-xs text-muted-foreground">
              Demo AI prediction · simulated model output
            </p>
          </div>
        </div>
        <DemandBadge level={p.demandLevel} />
      </header>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        {[
          { label: "Current", value: parking.occupancyPercentage },
          { label: "Next 30 min", value: p.next30 },
          { label: "Next 60 min", value: p.next60 },
          { label: "Next 2 hours", value: p.next120 },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-secondary/70 p-3">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="font-display text-2xl font-bold tabular-nums">{item.value}%</p>
          </div>
        ))}
      </div>

      <div className="mt-5 h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="predFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} unit="%" />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--color-border)",
                fontSize: 12,
              }}
              formatter={(value) => [`${value}%`, "Occupancy"]}
            />
            <Area
              type="monotone"
              dataKey="occupancy"
              stroke="var(--color-chart-1)"
              strokeWidth={2.5}
              fill="url(#predFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <p className="flex items-start gap-2 text-muted-foreground">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          {p.explanation}
        </p>
        {p.minutesToFull !== null && (
          <p className="flex items-start gap-2 rounded-xl bg-warning/20 p-3 text-warning-foreground">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            Likely to become full in approximately {p.minutesToFull} minutes.
          </p>
        )}
        <p className="text-xs font-semibold text-muted-foreground">
          Prediction confidence: {p.confidence}%
        </p>
      </div>
    </section>
  );
}
