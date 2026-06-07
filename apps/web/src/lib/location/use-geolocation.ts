"use client";

import { useEffect, useState } from "react";

interface GeoPosition {
  lng: number;
  lat: number;
}

export function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition>();
  const [locating, setLocating] = useState(false);

  const locate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setPosition({ lng: pos.coords.longitude, lat: pos.coords.latitude });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  useEffect(() => {
    if (!navigator.geolocation) return;

    const timer = setTimeout(() => {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        pos => {
          setPosition({ lng: pos.coords.longitude, lat: pos.coords.latitude });
          setLocating(false);
        },
        () => setLocating(false),
        { enableHighAccuracy: true, timeout: 10_000 },
      );
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return { position, locating, locate } as const;
}
