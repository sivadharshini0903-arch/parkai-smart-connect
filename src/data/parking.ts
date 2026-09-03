/**
 * Centralized ParkAI demo dataset.
 *
 * NOTE: This is SIMULATED demo data for a college project demonstration.
 * It is not an official real-time parking feed. All derived values
 * (available spaces, occupancy %, predictions) are computed dynamically.
 */

export type ParkingStatus = "available" | "limited" | "full";
export type DemandLevel = "low" | "moderate" | "high";
export type VehicleType = "car" | "bike" | "ev" | "suv";

export interface ParkingRecord {
  parkingId: string;
  name: string;
  address: string;
  area: string;
  latitude: number;
  longitude: number;
  capacity: number;
  occupied: number;
  pricePerHour: number;
  rating: number;
  walkingTime: number; // minutes from the nearby landmark
  distanceKm: number; // demo distance from city reference point
  openingHours: string;
  vehicleTypes: VehicleType[];
  secured: boolean;
  accessible: boolean;
  evCharging: boolean;
  /** 24 hourly occupancy ratios (0-1) used by the demo prediction engine. */
  historical: number[];
}

/** Typical Chennai city-centre demand curve (index = hour of day). */
const CITY_CURVE = [
  0.18, 0.14, 0.12, 0.12, 0.15, 0.22, 0.34, 0.48, 0.66, 0.78, 0.82, 0.85, 0.86, 0.83, 0.8, 0.82,
  0.86, 0.9, 0.93, 0.9, 0.82, 0.68, 0.48, 0.3,
];

/** Leisure / beach-mall style curve which peaks in the evening. */
const LEISURE_CURVE = [
  0.1, 0.08, 0.07, 0.07, 0.08, 0.12, 0.18, 0.24, 0.32, 0.42, 0.52, 0.62, 0.7, 0.7, 0.68, 0.72, 0.8,
  0.88, 0.95, 0.96, 0.92, 0.8, 0.6, 0.32,
];

/** Transit hub curve with sharp morning and evening commuter peaks. */
const TRANSIT_CURVE = [
  0.22, 0.2, 0.18, 0.18, 0.24, 0.4, 0.62, 0.84, 0.94, 0.9, 0.8, 0.74, 0.72, 0.72, 0.74, 0.8, 0.88,
  0.95, 0.92, 0.8, 0.66, 0.52, 0.38, 0.28,
];

export const PARKING_DATA: ParkingRecord[] = [
  {
    parkingId: "pk-chennai-central",
    name: "Chennai Central Parking",
    address: "Wall Tax Road, Park Town, Chennai 600003",
    area: "Park Town",
    latitude: 13.0827,
    longitude: 80.2757,
    capacity: 320,
    occupied: 265,
    pricePerHour: 40,
    rating: 4.3,
    walkingTime: 4,
    distanceKm: 0.4,
    openingHours: "Open 24 hours",
    vehicleTypes: ["car", "bike", "suv", "ev"],
    secured: true,
    accessible: true,
    evCharging: true,
    historical: TRANSIT_CURVE,
  },
  {
    parkingId: "pk-marina",
    name: "Marina Beach Parking",
    address: "Kamarajar Salai, Marina Beach, Chennai 600005",
    area: "Marina",
    latitude: 13.0524,
    longitude: 80.2825,
    capacity: 250,
    occupied: 205,
    pricePerHour: 30,
    rating: 4.0,
    walkingTime: 6,
    distanceKm: 0.9,
    openingHours: "05:00 – 23:30",
    vehicleTypes: ["car", "bike", "suv"],
    secured: false,
    accessible: true,
    evCharging: false,
    historical: LEISURE_CURVE,
  },
  {
    parkingId: "pk-tnagar",
    name: "T Nagar Smart Parking",
    address: "Usman Road, T Nagar, Chennai 600017",
    area: "T Nagar",
    latitude: 13.0418,
    longitude: 80.2341,
    capacity: 180,
    occupied: 131,
    pricePerHour: 50,
    rating: 4.5,
    walkingTime: 3,
    distanceKm: 0.3,
    openingHours: "06:00 – 23:00",
    vehicleTypes: ["car", "bike", "ev"],
    secured: true,
    accessible: true,
    evCharging: true,
    historical: CITY_CURVE,
  },
  {
    parkingId: "pk-phoenix",
    name: "Phoenix Mall Parking",
    address: "Velachery Main Road, Velachery, Chennai 600042",
    area: "Velachery",
    latitude: 12.9911,
    longitude: 80.2176,
    capacity: 400,
    occupied: 300,
    pricePerHour: 45,
    rating: 4.6,
    walkingTime: 2,
    distanceKm: 0.1,
    openingHours: "09:00 – 00:00",
    vehicleTypes: ["car", "bike", "suv", "ev"],
    secured: true,
    accessible: true,
    evCharging: true,
    historical: LEISURE_CURVE,
  },
  {
    parkingId: "pk-anna-nagar",
    name: "Anna Nagar Parking",
    address: "2nd Avenue, Anna Nagar, Chennai 600040",
    area: "Anna Nagar",
    latitude: 13.0878,
    longitude: 80.2101,
    capacity: 150,
    occupied: 96,
    pricePerHour: 35,
    rating: 4.1,
    walkingTime: 5,
    distanceKm: 0.6,
    openingHours: "06:00 – 22:30",
    vehicleTypes: ["car", "bike"],
    secured: true,
    accessible: false,
    evCharging: false,
    historical: CITY_CURVE,
  },
  {
    parkingId: "pk-guindy-metro",
    name: "Guindy Metro Parking",
    address: "Anna Salai, Guindy, Chennai 600032",
    area: "Guindy",
    latitude: 13.0067,
    longitude: 80.2206,
    capacity: 220,
    occupied: 170,
    pricePerHour: 25,
    rating: 4.2,
    walkingTime: 2,
    distanceKm: 0.2,
    openingHours: "04:30 – 23:30",
    vehicleTypes: ["car", "bike", "ev"],
    secured: true,
    accessible: true,
    evCharging: true,
    historical: TRANSIT_CURVE,
  },
  {
    parkingId: "pk-besant-nagar",
    name: "Besant Nagar Parking",
    address: "Elliot's Beach Road, Besant Nagar, Chennai 600090",
    area: "Besant Nagar",
    latitude: 13.0002,
    longitude: 80.2668,
    capacity: 120,
    occupied: 72,
    pricePerHour: 20,
    rating: 4.4,
    walkingTime: 7,
    distanceKm: 1.1,
    openingHours: "05:30 – 23:00",
    vehicleTypes: ["car", "bike", "suv"],
    secured: false,
    accessible: true,
    evCharging: false,
    historical: LEISURE_CURVE,
  },
  {
    parkingId: "pk-egmore",
    name: "Egmore Parking",
    address: "Gandhi Irwin Road, Egmore, Chennai 600008",
    area: "Egmore",
    latitude: 13.0732,
    longitude: 80.2609,
    capacity: 160,
    occupied: 120,
    pricePerHour: 38,
    rating: 3.9,
    walkingTime: 4,
    distanceKm: 0.5,
    openingHours: "Open 24 hours",
    vehicleTypes: ["car", "bike"],
    secured: true,
    accessible: false,
    evCharging: false,
    historical: TRANSIT_CURVE,
  },
  {
    parkingId: "pk-adyar",
    name: "Adyar Signal Parking",
    address: "Sardar Patel Road, Adyar, Chennai 600020",
    area: "Adyar",
    latitude: 13.0067,
    longitude: 80.2565,
    capacity: 200,
    occupied: 150,
    pricePerHour: 32,
    rating: 4.0,
    walkingTime: 5,
    distanceKm: 0.7,
    openingHours: "06:00 – 23:00",
    vehicleTypes: ["car", "bike", "suv"],
    secured: true,
    accessible: true,
    evCharging: false,
    historical: CITY_CURVE,
  },
  {
    parkingId: "pk-mylapore",
    name: "Mylapore Temple Parking",
    address: "North Mada Street, Mylapore, Chennai 600004",
    area: "Mylapore",
    latitude: 13.0339,
    longitude: 80.2698,
    capacity: 140,
    occupied: 98,
    pricePerHour: 28,
    rating: 4.2,
    walkingTime: 3,
    distanceKm: 0.4,
    openingHours: "05:00 – 22:00",
    vehicleTypes: ["car", "bike"],
    secured: false,
    accessible: true,
    evCharging: false,
    historical: LEISURE_CURVE,
  },
  {
    parkingId: "pk-omr-tidel",
    name: "Tidel Park OMR Parking",
    address: "Rajiv Gandhi Salai, Taramani, Chennai 600113",
    area: "Taramani",
    latitude: 12.9878,
    longitude: 80.2477,
    capacity: 180,
    occupied: 108,
    pricePerHour: 42,
    rating: 4.5,
    walkingTime: 3,
    distanceKm: 0.3,
    openingHours: "06:00 – 23:59",
    vehicleTypes: ["car", "bike", "ev", "suv"],
    secured: true,
    accessible: true,
    evCharging: true,
    historical: CITY_CURVE,
  },
  {
    parkingId: "pk-airport",
    name: "Chennai Airport Parking",
    address: "GST Road, Meenambakkam, Chennai 600027",
    area: "Meenambakkam",
    latitude: 12.9816,
    longitude: 80.1636,
    capacity: 130,
    occupied: 51,
    pricePerHour: 60,
    rating: 4.3,
    walkingTime: 6,
    distanceKm: 0.8,
    openingHours: "Open 24 hours",
    vehicleTypes: ["car", "suv", "ev"],
    secured: true,
    accessible: true,
    evCharging: true,
    historical: TRANSIT_CURVE,
  },
];

/** Destinations users can search in the demo. */
export const DESTINATIONS = [
  "T Nagar",
  "Marina Beach",
  "Chennai Central",
  "Velachery",
  "Anna Nagar",
  "Guindy",
  "Besant Nagar",
  "Egmore",
  "Adyar",
  "Mylapore",
  "Taramani (OMR)",
  "Chennai Airport",
];

export const CHENNAI_CENTER: [number, number] = [13.0418, 80.2341];
