import { create } from "zustand";
import type { LocationUpdate } from "@/types";

interface LocationStore {
  /** deliveryId → latest location */
  locations: Record<string, LocationUpdate>;
  updateLocation: (loc: LocationUpdate) => void;
  clearLocation: (deliveryId: string) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  locations: {},
  updateLocation: (loc) =>
    set(s => ({ locations: { ...s.locations, [loc.deliveryId]: loc } })),
  clearLocation: (deliveryId) =>
    set(s => {
      const next = { ...s.locations };
      delete next[deliveryId];
      return { locations: next };
    }),
}));
