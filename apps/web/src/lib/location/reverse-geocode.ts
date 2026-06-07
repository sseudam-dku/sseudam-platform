interface ContextEntry {
  name?: string;
}

interface ReverseContext {
  locality?: ContextEntry;
  place?: ContextEntry;
  region?: ContextEntry;
}

function extractDistrict(ctx?: ReverseContext): string {
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

export async function reverseGeocode(
  lng: number,
  lat: number,
): Promise<{ name: string; district: string } | null> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) return null;

  try {
    const params = new URLSearchParams({
      language: "ko",
      limit: "1",
      access_token: token,
    });
    const res = await fetch(
      `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&${params}`,
    );
    const data = await res.json();
    const feature = data.features?.[0];
    if (!feature) return null;

    const name = feature.properties?.full_address ?? feature.properties?.name ?? "";
    const district = extractDistrict(feature.properties?.context);
    return { name, district };
  } catch {
    return null;
  }
}
