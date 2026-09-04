import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { CHENNAI_CENTER } from "@/data/parking";
import type { Parking } from "@/lib/parking-engine";

export type MarkerTone = "available" | "limited" | "full" | "recommended";

function markerIcon(tone: MarkerTone, label: string) {
  return L.divIcon({
    className: "parkai-marker-wrapper",
    html: `<div class="parkai-marker" data-tone="${tone}">${label}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -14],
  });
}

function MapFocus({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.8 });
  }, [map, center, zoom]);
  return null;
}

export interface ParkingMapProps {
  parkings: Parking[];
  recommendedId?: string;
  center?: [number, number];
  zoom?: number;
  height?: number;
  onViewDetails?: (parkingId: string) => void;
}

export default function ParkingMap({
  parkings,
  recommendedId,
  center = CHENNAI_CENTER,
  zoom = 12,
  height = 560,
  onViewDetails,
}: ParkingMapProps) {
  const markers = useMemo(
    () =>
      parkings.map((p) => ({
        parking: p,
        tone: (p.parkingId === recommendedId ? "recommended" : p.status) as MarkerTone,
      })),
    [parkings, recommendedId],
  );

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      style={{ height, width: "100%" }}
      className="rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <MapFocus center={center} zoom={zoom} />
      {markers.map(({ parking, tone }) => (
        <Marker
          key={parking.parkingId}
          position={[parking.latitude, parking.longitude]}
          icon={markerIcon(tone, String(parking.available))}
        >
          <Popup>
            <div style={{ minWidth: 210 }}>
              <strong style={{ fontSize: 14 }}>{parking.name}</strong>
              <div style={{ fontSize: 12, color: "#5b6672", marginTop: 2 }}>{parking.area}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "8px 0", fontSize: 12 }}>
                <li>
                  Available spaces: <strong>{parking.available}</strong> / {parking.capacity}
                </li>
                <li>
                  Occupancy: <strong>{parking.occupancyPercentage}%</strong>
                </li>
                <li>
                  Price: <strong>₹{parking.pricePerHour}/hour</strong>
                </li>
                <li>
                  Predicted occupancy (30 min): <strong>{parking.prediction.next30}%</strong>
                </li>
              </ul>
              <button
                type="button"
                onClick={() => onViewDetails?.(parking.parkingId)}
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  borderRadius: 10,
                  border: "none",
                  background: "#136c86",
                  color: "white",
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                View Details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
