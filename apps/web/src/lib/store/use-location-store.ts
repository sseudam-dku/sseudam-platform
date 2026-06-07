"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "sseudam-location";

export interface LocationData {
  city: string;
  district: string;
}

interface LocationStoreSnapshot extends LocationData {
  isHydrated: boolean;
}

const DEFAULT_LOCATION: LocationData = {
  city: "서울",
  district: "중구",
};

const listeners = new Set<() => void>();

function parseStoredLocation(raw: string): LocationData {
  const trimmed = raw.trim();
  if (!trimmed) {
    return DEFAULT_LOCATION;
  }
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return {
      city: parts[0],
      district: parts.slice(1).join(" "),
    };
  }
  return { city: "서울", district: parts[0] };
}

function readLocationFromStorage(): LocationData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_LOCATION;
    }
    return parseStoredLocation(stored);
  } catch {
    return DEFAULT_LOCATION;
  }
}

function createSnapshot(isHydrated: boolean): LocationStoreSnapshot {
  if (!isHydrated) {
    return {
      ...DEFAULT_LOCATION,
      isHydrated: false,
    };
  }
  return {
    ...readLocationFromStorage(),
    isHydrated: true,
  };
}

let cachedSnapshot: LocationStoreSnapshot = createSnapshot(false);

function getClientSnapshot(): LocationStoreSnapshot {
  const next = createSnapshot(true);
  if (
    next.city === cachedSnapshot.city &&
    next.district === cachedSnapshot.district &&
    next.isHydrated === cachedSnapshot.isHydrated
  ) {
    return cachedSnapshot;
  }
  cachedSnapshot = next;
  return cachedSnapshot;
}

const getServerSnapshot = () => createSnapshot(false);

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => {
  if (typeof window === "undefined") {
    return cachedSnapshot;
  }
  return getClientSnapshot();
};

export function getLocationDisplayName(location: LocationData): string {
  return `${location.city} ${location.district}`;
}

export function useLocationStore() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isHydrated = snapshot.isHydrated;

  const setLocation = (city: string, district: string) => {
    if (isHydrated && city === cachedSnapshot.city && district === cachedSnapshot.district) {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, `${city} ${district}`);
    } catch {}
    cachedSnapshot = { city, district, isHydrated: true };
    for (const listener of listeners) {
      listener();
    }
  };

  const setLocationFromDisplay = (display: string) => {
    const parsed = parseStoredLocation(display);
    setLocation(parsed.city, parsed.district);
  };

  return {
    location: isHydrated ? getLocationDisplayName(snapshot) : "",
    city: isHydrated ? snapshot.city : "",
    district: isHydrated ? snapshot.district : "",
    isHydrated,
    setLocation,
    setLocationFromDisplay,
  } as const;
}
