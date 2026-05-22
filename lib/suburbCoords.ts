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
 * Lightly jitter a coordinate so multiple pins in the same suburb don't stack.
 * Deterministic based on a seed string (e.g., competitor id).
 */
export function jitterCoord(c: LatLon, seed: string): LatLon {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const rng1 = ((h >>> 0) % 1000) / 1000;
  const rng2 = ((h >>> 8) % 1000) / 1000;
  // ~250m radius of jitter
  return {
    lat: c.lat + (rng1 - 0.5) * 0.003,
    lon: c.lon + (rng2 - 0.5) * 0.003,
  };
}
