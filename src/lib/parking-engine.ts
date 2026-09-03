/**
 * ParkAI demo prediction + recommendation engine.
 *
 * IMPORTANT: this is a deterministic, rule-based *simulated* model used for the
 * demo build. It is intentionally isolated behind small pure functions so it can
 * later be replaced by a real Python (FastAPI) ML service — Random Forest /
 * XGBoost / Linear Regression — with the same input/output contract:
 *
 *   input : { currentOccupancy, hour, dayOfWeek, historicalOccupancy, capacity }
 *   output: { predicted30, predicted60, predicted120, demandLevel, confidence }
 *
 * See `predictOccupancy()` below for the swap point.
 */

import {
  PARKING_DATA,
  type DemandLevel,
  type ParkingRecord,
  type ParkingStatus,
  type VehicleType,
} from "@/data/parking";

/**
 * Fixed demo clock (18:00 — Chennai evening peak). Using a constant instead of
 * `new Date()` keeps server render and client render identical and makes the
 * demo reproducible during a presentation.
 */
export const DEMO_HOUR = 18;
export const DEMO_DAY = 4; // Thursday
export const DEMO_CLOCK_LABEL = "18:00 IST · Thursday (demo clock)";

export const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n));

export interface PredictionInput {
  currentOccupancy: number; // 0-100
  hour: number;
  dayOfWeek: number;
  capacity: number;
  historical: number[];
}

export interface Prediction {
  next30: number;
  next60: number;
  next120: number;
  demandLevel: DemandLevel;
  confidence: number;
  explanation: string;
  minutesToFull: number | null;
  simulated: true;
}

/** ---- MODEL SWAP POINT ------------------------------------------------- */
export function predictOccupancy(input: PredictionInput): Prediction {
  const { currentOccupancy, hour, dayOfWeek, capacity, historical } = input;

  const at = (h: number) => historical[((h % 24) + 24) % 24] * 100;
  const now = at(hour);
  const trend30 = (at(hour + 1) - now) / 2;
  const trend60 = at(hour + 1) - now;
  const trend120 = at(hour + 2) - now;

  // Weekends bring more leisure demand, small capacity penalty for big lots.
  const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 1.08 : 1;
  const capacityRelief = capacity > 300 ? 0.94 : capacity < 150 ? 1.05 : 1;

  const project = (delta: number, weight: number) =>
    Math.round(clamp((currentOccupancy + delta * weight) * weekendFactor * capacityRelief));

  const next30 = project(trend30, 1);
  const next60 = project(trend60, 1);
  const next120 = project(trend120, 1.15);

  const peak = Math.max(next30, next60, next120);
  const demandLevel: DemandLevel = peak >= 85 ? "high" : peak >= 60 ? "moderate" : "low";

  const rising = next60 > currentOccupancy;
  const explanation = rising
    ? "Historical occupancy patterns indicate increasing demand during this period."
    : next60 < currentOccupancy - 2
      ? "Historical patterns show demand easing over the next hour as vehicles exit."
      : "Occupancy is expected to stay close to its current level in the short term.";

  // Linear extrapolation of the 60-minute slope to reach 100%.
  const slopePerMinute = (next60 - currentOccupancy) / 60;
  const minutesToFull =
    slopePerMinute > 0.05 && currentOccupancy < 100
      ? Math.round((100 - currentOccupancy) / slopePerMinute)
      : null;

  // Confidence is higher when the trend is stable and the lot is larger.
  const volatility = Math.abs(trend120) + Math.abs(trend60);
  const confidence = Math.round(clamp(96 - volatility * 0.8 - (capacity < 150 ? 4 : 0), 68, 97));

  return {
    next30,
    next60,
    next120,
    demandLevel,
    confidence,
    explanation,
    minutesToFull: minutesToFull && minutesToFull <= 240 ? minutesToFull : null,
    simulated: true,
  };
}
/** ---------------------------------------------------------------------- */

export interface Parking extends ParkingRecord {
  available: number;
  occupancyPercentage: number;
  status: ParkingStatus;
  prediction: Prediction;
  demandLevel: DemandLevel;
}

export function statusOf(occupancyPercentage: number, available: number): ParkingStatus {
  if (available <= 0 || occupancyPercentage >= 99) return "full";
  if (occupancyPercentage >= 80) return "limited";
  return "available";
}

export function deriveParking(record: ParkingRecord, hour = DEMO_HOUR, day = DEMO_DAY): Parking {
  const occupied = clamp(record.occupied, 0, record.capacity);
  const available = record.capacity - occupied;
  const occupancyPercentage = Math.round((occupied / record.capacity) * 100);
  const prediction = predictOccupancy({
    currentOccupancy: occupancyPercentage,
    hour,
    dayOfWeek: day,
    capacity: record.capacity,
    historical: record.historical,
  });

  return {
    ...record,
    occupied,
    available,
    occupancyPercentage,
    status: statusOf(occupancyPercentage, available),
    prediction,
    demandLevel: prediction.demandLevel,
  };
}

export function deriveAll(records: ParkingRecord[] = PARKING_DATA): Parking[] {
  return records.map((r) => deriveParking(r));
}

/* ------------------------------ aggregates ------------------------------ */

export interface NetworkStats {
  areas: number;
  totalSpaces: number;
  occupiedSpaces: number;
  availableSpaces: number;
  averageOccupancy: number;
  highDemandCount: number;
}

export function networkStats(list: Parking[]): NetworkStats {
  const totalSpaces = list.reduce((s, p) => s + p.capacity, 0);
  const occupiedSpaces = list.reduce((s, p) => s + p.occupied, 0);
  return {
    areas: list.length,
    totalSpaces,
    occupiedSpaces,
    availableSpaces: totalSpaces - occupiedSpaces,
    averageOccupancy: totalSpaces ? Math.round((occupiedSpaces / totalSpaces) * 100) : 0,
    highDemandCount: list.filter((p) => p.demandLevel === "high").length,
  };
}

/* --------------------------- recommendations ---------------------------- */

export interface RecommendationFilters {
  destination: string;
  maxWalkKm: number;
  maxPrice: number;
  vehicleType: VehicleType;
}

export interface ScoredParking {
  parking: Parking;
  score: number;
  breakdown: {
    availability: number;
    distance: number;
    price: number;
    predicted: number;
  };
  reasons: string[];
}

/**
 * Recommendation Score = Availability + Distance + Price + Predicted Availability
 * (each component normalised to 0-25, total 0-100).
 */
export function scoreParking(
  parking: Parking,
  filters: RecommendationFilters,
  priceCeiling: number,
): ScoredParking {
  const availability = (parking.available / parking.capacity) * 25;
  const distance = clamp((1 - parking.distanceKm / Math.max(filters.maxWalkKm, 0.1)) * 25, 0, 25);
  const price = clamp((1 - parking.pricePerHour / Math.max(priceCeiling, 1)) * 25, 0, 25);
  const predicted = ((100 - parking.prediction.next30) / 100) * 25;
  const score = Math.round(availability + distance + price + predicted);

  const reasons = [
    `${parking.available} spaces currently available`,
    `${100 - parking.prediction.next30}% predicted availability after 30 minutes`,
    `${parking.distanceKm.toFixed(1)} km from destination · ${parking.walkingTime} min walk`,
    parking.pricePerHour <= 35 ? "Affordable price for this area" : `₹${parking.pricePerHour}/hour`,
  ];

  return {
    parking,
    score,
    breakdown: {
      availability: Math.round(availability),
      distance: Math.round(distance),
      price: Math.round(price),
      predicted: Math.round(predicted),
    },
    reasons,
  };
}

export function recommend(list: Parking[], filters: RecommendationFilters): ScoredParking[] {
  const priceCeiling = Math.max(...list.map((p) => p.pricePerHour), filters.maxPrice);
  const dest = filters.destination.trim().toLowerCase();

  return list
    .filter((p) => p.vehicleTypes.includes(filters.vehicleType))
    .filter((p) => p.pricePerHour <= filters.maxPrice)
    .filter((p) => p.distanceKm <= filters.maxWalkKm)
    .filter((p) =>
      dest ? `${p.name} ${p.area} ${p.address}`.toLowerCase().includes(dest) || true : true,
    )
    .map((p) => scoreParking(p, filters, priceCeiling))
    .sort((a, b) => b.score - a.score);
}

export function badgesFor(list: ScoredParking[]) {
  if (!list.length) return new Map<string, string[]>();
  const map = new Map<string, string[]>();
  const push = (id: string, badge: string) =>
    map.set(id, [...(map.get(id) ?? []), badge]);

  push(list[0].parking.parkingId, "Best Overall");
  const closest = [...list].sort((a, b) => a.parking.distanceKm - b.parking.distanceKm)[0];
  push(closest.parking.parkingId, "Closest");
  const cheapest = [...list].sort((a, b) => a.parking.pricePerHour - b.parking.pricePerHour)[0];
  push(cheapest.parking.parkingId, "Cheapest");
  const most = [...list].sort((a, b) => b.parking.available - a.parking.available)[0];
  push(most.parking.parkingId, "Most Available");
  return map;
}

/* ------------------------------- searching ------------------------------ */

export interface SearchFilters {
  destination: string;
  maxDistanceKm: number;
  vehicleType: VehicleType | "any";
  status: ParkingStatus | "any";
}

export function searchParking(list: Parking[], filters: SearchFilters): Parking[] {
  const q = filters.destination.trim().toLowerCase();
  return list
    .filter((p) =>
      q ? `${p.name} ${p.area} ${p.address}`.toLowerCase().includes(q.replace(/\(.*\)/, "").trim()) : true,
    )
    .filter((p) => p.distanceKm <= filters.maxDistanceKm)
    .filter((p) => (filters.vehicleType === "any" ? true : p.vehicleTypes.includes(filters.vehicleType)))
    .filter((p) => (filters.status === "any" ? true : p.status === filters.status))
    .sort((a, b) => b.available / b.capacity - a.available / a.capacity);
}

/* -------------------------------- alerts -------------------------------- */

export interface ParkAlert {
  id: string;
  tone: "warning" | "critical" | "success" | "info";
  icon: string;
  message: string;
  parkingId: string;
}

export function buildAlerts(list: Parking[]): ParkAlert[] {
  const alerts: ParkAlert[] = [];

  for (const p of list) {
    if (p.status === "full") {
      alerts.push({
        id: `${p.parkingId}-full`,
        tone: "critical",
        icon: "🚨",
        message: `${p.name} is currently full — consider a nearby alternative.`,
        parkingId: p.parkingId,
      });
    } else if (p.prediction.minutesToFull !== null && p.prediction.minutesToFull <= 30) {
      alerts.push({
        id: `${p.parkingId}-soon-full`,
        tone: "critical",
        icon: "🚨",
        message: `${p.name} is predicted to become full within ${p.prediction.minutesToFull} minutes.`,
        parkingId: p.parkingId,
      });
    } else if (p.occupancyPercentage >= 80) {
      alerts.push({
        id: `${p.parkingId}-high`,
        tone: "warning",
        icon: "⚠️",
        message: `${p.name} is reaching high occupancy (${p.occupancyPercentage}%).`,
        parkingId: p.parkingId,
      });
    } else if (p.occupancyPercentage <= 55) {
      alerts.push({
        id: `${p.parkingId}-free`,
        tone: "success",
        icon: "✅",
        message: `${p.name} currently has high availability (${p.available} spaces).`,
        parkingId: p.parkingId,
      });
    }
  }

  const order = { critical: 0, warning: 1, success: 2, info: 3 };
  return alerts.sort((a, b) => order[a.tone] - order[b.tone]).slice(0, 8);
}

/* ------------------------------- analytics ------------------------------ */

export function occupancyTimeline(list: Parking[]) {
  const capacity = list.reduce((s, p) => s + p.capacity, 0) || 1;
  return Array.from({ length: 24 }, (_, hour) => {
    const occupied = list.reduce((s, p) => s + p.capacity * p.historical[hour], 0);
    return {
      hour: `${String(hour).padStart(2, "0")}:00`,
      occupancy: Math.round((occupied / capacity) * 100),
      demand: Math.round(occupied),
    };
  });
}

export function predictionSeries(parking: Parking) {
  return [
    { label: "Now", occupancy: parking.occupancyPercentage },
    { label: "+30 min", occupancy: parking.prediction.next30 },
    { label: "+60 min", occupancy: parking.prediction.next60 },
    { label: "+2 hrs", occupancy: parking.prediction.next120 },
  ];
}

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEK_FACTOR = [0.92, 0.9, 0.94, 1, 1.12, 1.18, 1.04];

export function weeklyUsage(list: Parking[]) {
  const base = list.reduce((s, p) => s + p.occupied, 0);
  return WEEK.map((day, i) => ({
    day,
    vehicles: Math.round(base * WEEK_FACTOR[i] * 2.4),
    occupancy: Math.round(clamp((base / (list.reduce((s, p) => s + p.capacity, 0) || 1)) * 100 * WEEK_FACTOR[i])),
  }));
}

export function areaComparison(list: Parking[]) {
  return list.map((p) => ({
    name: p.area,
    occupied: p.occupied,
    available: p.available,
    occupancy: p.occupancyPercentage,
  }));
}

export function peakHours(list: Parking[]) {
  return occupancyTimeline(list)
    .filter((_, i) => i % 2 === 0)
    .map((row) => ({ hour: row.hour, occupancy: row.occupancy }));
}

export function analyticsSummary(list: Parking[]) {
  const timeline = occupancyTimeline(list);
  const peak = timeline.reduce((a, b) => (b.occupancy > a.occupancy ? b : a), timeline[0]);
  const sorted = [...list].sort((a, b) => b.occupancyPercentage - a.occupancyPercentage);
  const week = weeklyUsage(list);
  return {
    peakHour: peak.hour,
    peakOccupancy: peak.occupancy,
    mostCrowded: sorted[0],
    leastUtilised: sorted[sorted.length - 1],
    averageOccupancy: networkStats(list).averageOccupancy,
    dailyDemand: list.reduce((s, p) => s + p.occupied, 0) * 3,
    weeklyDemand: week.reduce((s, d) => s + d.vehicles, 0),
    predictedDemand: Math.round(
      list.reduce((s, p) => s + (p.prediction.next120 / 100) * p.capacity, 0),
    ),
  };
}

/* ------------------------------ formatting ------------------------------ */

export const statusLabel: Record<ParkingStatus, string> = {
  available: "Spaces available",
  limited: "Limited spaces",
  full: "Full",
};

export const demandLabel: Record<DemandLevel, string> = {
  low: "Low demand",
  moderate: "Moderate demand",
  high: "High demand",
};

export const rupees = (n: number) => `₹${n}`;
