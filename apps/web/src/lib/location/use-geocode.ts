"use client";

import { useEffect, useRef, useState } from "react";

export interface GeoResult {
  id: string;
  name: string;
  fullAddress: string;
  district: string;
  lng: number;
  lat: number;
}

interface ContextEntry {
  name?: string;
}

interface FeatureResponse {
  id: string;
  properties: {
    name: string;
    full_address: string;
    context?: {
      locality?: ContextEntry;
      place?: ContextEntry;
      region?: ContextEntry;
    };
  };
  geometry: { coordinates: [number, number] };
}

function extractDistrict(ctx?: FeatureResponse["properties"]["context"]): string {
  if (!ctx) return "";
  const city = ctx.place?.name ?? ctx.region?.name ?? "";
  const gu = ctx.locality?.name ?? "";
  const shortCity = city
    .replace("특별시", "")
    .replace("광역시", "")
    .replace("특별자치시", "")
    .replace("특별자치도", "");
  return [shortCity, gu].filter(Boolean).join(" ");
}

export function useGeocode(query: string, enabled = true) {
  const [results, setResults] = useState<GeoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const search = async (q: string) => {
      abortRef.current?.abort();

      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!q.trim() || !token) {
        setResults([]);
        return;
      }

      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);

      try {
        const params = new URLSearchParams({
          q: q.trim(),
          language: "ko",
          country: "KR",
          limit: "5",
          access_token: token,
        });
        const res = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?${params}`, {
          signal: controller.signal,
        });
        const data = await res.json();

        const items: GeoResult[] = (data.features ?? []).map((f: FeatureResponse) => ({
          id: f.id,
          name: f.properties.name,
          fullAddress: f.properties.full_address,
          district: extractDistrict(f.properties.context),
          lng: f.geometry.coordinates[0],
          lat: f.geometry.coordinates[1],
        }));
        setResults(items);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, enabled]);

  const clear = () => setResults([]);

  return { results, loading, clear } as const;
}
