import type { Niche } from "./types";

export interface Discoverable {
  id: string;
  name: string;
  handle: string;
  niche: Niche;
  suburb: string;
  /** "Pro" / "Agency" plan gate — for the demo these aren't selectable */
  plan: "Pro" | "Agency";
}

/**
 * Additional Brisbane competitors surfaced during onboarding as "we found
 * a few more on your block — upgrade to track them." Not in the seeded
 * competitor list, used purely to show the discovery pipeline is real.
 */
export const DISCOVERABLES: Discoverable[] = [
  // Gyms
  { id: "d-gym-1", name: "Vault Strength Co", handle: "@vaultstrengthbne", niche: "gym", suburb: "West End", plan: "Pro" },
  { id: "d-gym-2", name: "Element Pilates", handle: "@element.pilates", niche: "gym", suburb: "Paddington", plan: "Pro" },
  { id: "d-gym-3", name: "Coastal Boxing Club", handle: "@coastalboxing", niche: "gym", suburb: "Newstead", plan: "Agency" },
  { id: "d-gym-4", name: "Hyrox Brisbane HQ", handle: "@hyroxbne", niche: "gym", suburb: "Fortitude Valley", plan: "Pro" },

  // Restaurants
  { id: "d-rest-1", name: "The Black Lab", handle: "@blacklab.newfarm", niche: "restaurant", suburb: "New Farm", plan: "Pro" },
  { id: "d-rest-2", name: "Solano Bistro", handle: "@solano.bistro", niche: "restaurant", suburb: "South Brisbane", plan: "Pro" },
  { id: "d-rest-3", name: "Kettle & Tin", handle: "@kettleandtin", niche: "restaurant", suburb: "Paddington", plan: "Agency" },
  { id: "d-rest-4", name: "Salt Meats Cheese", handle: "@saltmeatscheese", niche: "restaurant", suburb: "Teneriffe", plan: "Pro" },

  // Cafes
  { id: "d-cafe-1", name: "Lockwood Coffee", handle: "@lockwoodcoffee", niche: "cafe", suburb: "Paddington", plan: "Pro" },
  { id: "d-cafe-2", name: "The Gunshop", handle: "@thegunshop.westend", niche: "cafe", suburb: "West End", plan: "Pro" },
  { id: "d-cafe-3", name: "Bear Bones Espresso", handle: "@bearbones.espresso", niche: "cafe", suburb: "Woolloongabba", plan: "Agency" },
  { id: "d-cafe-4", name: "Strauss Brisbane", handle: "@strauss.brisbane", niche: "cafe", suburb: "Fortitude Valley", plan: "Pro" },

  // Retail
  { id: "d-ret-1", name: "Slow Goods", handle: "@slowgoods.westend", niche: "retail", suburb: "West End", plan: "Pro" },
  { id: "d-ret-2", name: "Op Spot Vintage", handle: "@opspotvintage", niche: "retail", suburb: "Woolloongabba", plan: "Pro" },
  { id: "d-ret-3", name: "Vinnies New Farm", handle: "@vinniesqld", niche: "retail", suburb: "New Farm", plan: "Agency" },
  { id: "d-ret-4", name: "Backspace Vintage", handle: "@backspace.vintage", niche: "retail", suburb: "Paddington", plan: "Pro" },
];

export function discoverablesFor(niche: Niche): Discoverable[] {
  return DISCOVERABLES.filter((d) => d.niche === niche);
}
