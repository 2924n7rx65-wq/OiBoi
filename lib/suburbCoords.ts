export type LatLon = { lat: number; lon: number };

// Approximate centroid coordinates for the supported Brisbane suburbs.
export const SUBURB_COORDS: Record<string, LatLon> = {
  "West End": { lat: -27.4844, lon: 153.0090 },
  "Fortitude Valley": { lat: -27.4569, lon: 153.0345 },
  "New Farm": { lat: -27.4682, lon: 153.0466 },
  Paddington: { lat: -27.4631, lon: 152.9982 },
  Teneriffe: { lat: -27.4554, lon: 153.0468 },
  "South Brisbane": { lat: -27.4772, lon: 153.0179 },
  Newstead: { lat: -27.4503, lon: 153.0413 },
  Woolloongabba: { lat: -27.4865, lon: 153.0345 },
};

export const BRISBANE_CBD: LatLon = { lat: -27.4698, lon: 153.0251 };

/**
 * Returns coords for a suburb. Falls back to Brisbane CBD if not in the
 * supported list (e.g., inspiration competitors in other cities).
 */
export function coordsForSuburb(suburb: string | null | undefined): LatLon {
  if (!suburb) return BRISBANE_CBD;
  return SUBURB_COORDS[suburb] ?? BRISBANE_CBD;
}

/**
 * Pseudo-locations for the map: pins are positioned NEAR their real suburb
 * but with a generous deterministic offset so multiple competitors in the
 * same suburb don't stack into a single dot. ±~750m radius reads cleanly
 * at the zoom levels we use without ever putting a pin in the wrong suburb.
 */
export function jitterCoord(c: LatLon, seed: string): LatLon {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const rng1 = ((h >>> 0) % 10000) / 10000;
  const rng2 = ((h >>> 13) % 10000) / 10000;
  // Polar-coordinate spread keeps the cluster looking organic, not gridded.
  const angle = rng1 * Math.PI * 2;
  const radius = 0.003 + rng2 * 0.007; // ~330m to ~1.1km
  return {
    lat: c.lat + Math.sin(angle) * radius,
    lon: c.lon + Math.cos(angle) * radius,
  };
}
