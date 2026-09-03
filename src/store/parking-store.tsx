import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { PARKING_DATA, type ParkingRecord } from "@/data/parking";
import { buildAlerts, deriveAll, networkStats, type Parking } from "@/lib/parking-engine";

interface ParkingStoreValue {
  records: ParkingRecord[];
  parkings: Parking[];
  stats: ReturnType<typeof networkStats>;
  alerts: ReturnType<typeof buildAlerts>;
  getById: (id: string) => Parking | undefined;
  upsertParking: (record: ParkingRecord) => void;
  updateParking: (id: string, patch: Partial<ParkingRecord>) => void;
  removeParking: (id: string) => void;
  resetData: () => void;
}

const ParkingStoreContext = createContext<ParkingStoreValue | null>(null);

export function ParkingStoreProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<ParkingRecord[]>(PARKING_DATA);

  const upsertParking = useCallback((record: ParkingRecord) => {
    setRecords((prev) => {
      const exists = prev.some((r) => r.parkingId === record.parkingId);
      return exists ? prev.map((r) => (r.parkingId === record.parkingId ? record : r)) : [...prev, record];
    });
  }, []);

  const updateParking = useCallback((id: string, patch: Partial<ParkingRecord>) => {
    setRecords((prev) => prev.map((r) => (r.parkingId === id ? { ...r, ...patch } : r)));
  }, []);

  const removeParking = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.parkingId !== id));
  }, []);

  const resetData = useCallback(() => setRecords(PARKING_DATA), []);

  const value = useMemo<ParkingStoreValue>(() => {
    const parkings = deriveAll(records);
    return {
      records,
      parkings,
      stats: networkStats(parkings),
      alerts: buildAlerts(parkings),
      getById: (id: string) => parkings.find((p) => p.parkingId === id),
      upsertParking,
      updateParking,
      removeParking,
      resetData,
    };
  }, [records, upsertParking, updateParking, removeParking, resetData]);

  return <ParkingStoreContext.Provider value={value}>{children}</ParkingStoreContext.Provider>;
}

export function useParkingStore() {
  const ctx = useContext(ParkingStoreContext);
  if (!ctx) throw new Error("useParkingStore must be used inside <ParkingStoreProvider>");
  return ctx;
}
