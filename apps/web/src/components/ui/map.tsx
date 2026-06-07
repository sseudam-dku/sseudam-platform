"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import { useEffect, useRef, useState } from "react";
import MapGL, { Marker, NavigationControl, type MapRef } from "react-map-gl/mapbox";

import { cn } from "@/lib/cn";

interface MapProps {
  className?: string;
  center?: { lng: number; lat: number };
  marker?: { lng: number; lat: number };
  initialZoom?: number;
  onMove?: (center: { lng: number; lat: number }) => void;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const Map = ({ className, center, marker, initialZoom = 14, onMove }: MapProps) => {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    longitude: center?.lng ?? 127.0016,
    latitude: center?.lat ?? 37.2747,
    zoom: initialZoom,
  });

  useEffect(() => {
    if (!center) return;
    mapRef.current?.flyTo({ center: [center.lng, center.lat], zoom: 15, duration: 1500 });
  }, [center]);

  const handleStyleLoad = () => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const style = map.getStyle();
    for (const layer of style.layers ?? []) {
      const layout = "layout" in layer ? (layer.layout as Record<string, unknown>) : null;
      if (layout?.["text-field"]) {
        map.setLayoutProperty(layer.id, "text-field", [
          "coalesce",
          ["get", "name_ko"],
          ["get", "name"],
        ]);
      }
    }
  };

  if (!MAPBOX_TOKEN || MAPBOX_TOKEN === "your_mapbox_token_here") {
    return (
      <div
        className={cn(
          "rounded-12 flex items-center justify-center bg-neutral-100 text-neutral-400",
          className,
        )}>
        <p className="body-5 text-center">
          Mapbox 토큰을 설정해주세요
          <br />
          (.env.local → NEXT_PUBLIC_MAPBOX_TOKEN)
        </p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-12 overflow-hidden", className)}>
      <MapGL
        ref={mapRef}
        {...viewState}
        onMove={e => {
          setViewState(e.viewState);
          onMove?.({ lng: e.viewState.longitude, lat: e.viewState.latitude });
        }}
        onStyleData={handleStyleLoad}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: "100%", height: "100%" }}>
        <NavigationControl position="bottom-right" showCompass={false} />
        {marker && (
          <Marker longitude={marker.lng} latitude={marker.lat} anchor="center">
            <div className="relative flex items-center justify-center">
              <div className="absolute size-10 animate-ping rounded-full bg-green-500/30" />
              <div className="absolute size-6 animate-pulse rounded-full bg-green-500/20" />
              <div className="relative size-4 rounded-full border-2 border-white bg-green-500 shadow-md" />
            </div>
          </Marker>
        )}
      </MapGL>
    </div>
  );
};

export default Map;
