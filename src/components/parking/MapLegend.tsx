const ITEMS = [
  { tone: "bg-success", label: "Plenty of spaces (below 80% occupied)" },
  { tone: "bg-warning", label: "Limited spaces (80–98% occupied)" },
  { tone: "bg-destructive", label: "Full" },
  { tone: "bg-info", label: "Recommended parking" },
];

export function MapLegend() {
  return (
    <div className="surface p-4">
      <h3 className="font-display text-sm font-bold">Map legend</h3>
      <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
        {ITEMS.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span className={`h-3.5 w-3.5 rounded-full border-2 border-card ${item.tone}`} />
            {item.label}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        The number inside each marker is the count of currently available spaces.
      </p>
    </div>
  );
}
