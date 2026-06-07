"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "sseudam-location";
const DEFAULT_LOCATION = "서울 마포구";

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_LOCATION;
  } catch {
    return DEFAULT_LOCATION;
  }
};

const getServerSnapshot = () => DEFAULT_LOCATION;

export function useLocationStore() {
  const location = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLocation = (name: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, name);
    } catch {}
    for (const listener of listeners) listener();
  };

  return { location, setLocation } as const;
}
