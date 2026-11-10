/* The towns. Misty named these six on 2026-11-09 as the areas they serve most,
   and asked to leave Flint out. Fenton is home, so its service pages ARE the main
   service pages plus a hub. Every town gets a hub at /service-areas/<id>/ and a
   page for each service in the matrix below. */

import { SERVICES, service, type Service, type ServiceId } from './services';

export interface City {
  id: string;
  name: string;
  county: 'Genesee' | 'Oakland' | 'Livingston';
  /** Approximate drive from Fenton, for the hub pages. */
  drive: string;
  home?: boolean;
  /** Has inland lakes with lakefront lawns, so the lake pump page exists. */
  lakes?: boolean;
  /** Position on the service map, 0 to 100 from the left and from the top. */
  map: [number, number];
}

const ALL: City[] = [
  { id: 'fenton', name: 'Fenton', county: 'Genesee', drive: 'Home base', home: true, lakes: true, map: [67, 42] },
  { id: 'linden', name: 'Linden', county: 'Genesee', drive: 'About 10 minutes', lakes: true, map: [48, 39] },
  { id: 'grand-blanc', name: 'Grand Blanc', county: 'Genesee', drive: 'About 20 minutes', map: [84, 13] },
  { id: 'holly', name: 'Holly', county: 'Oakland', drive: 'About 15 minutes', lakes: true, map: [85, 44] },
  { id: 'hartland', name: 'Hartland', county: 'Livingston', drive: 'About 20 minutes', lakes: true, map: [55, 75] },
  { id: 'howell', name: 'Howell', county: 'Livingston', drive: 'About 30 minutes', lakes: true, map: [13, 86] },
];

/** Every town the content may name. Content validates against this list. */
export const ALL_CITIES = ALL;
export const CITIES = ALL;
export const city = (id: string) => CITIES.find((c) => c.id === id)!;
export const hubPath = (c: City) => `/service-areas/${c.id}-mi/`;
export const cityLabel = (c: City) => `${c.name}, MI`;

/** service id: towns that get their own page. */
export const MATRIX: Partial<Record<ServiceId, string[]>> = {
  'sprinkler-repair': CITIES.map((c) => c.id),
  winterization: CITIES.map((c) => c.id),
  startup: CITIES.map((c) => c.id),
  installation: CITIES.map((c) => c.id),
  'lake-pump': CITIES.filter((c) => c.lakes).map((c) => c.id),
};

const slugFor = (s: Service, c: City) => `${s.townSlug}-${c.id}-mi`;

/** Every service and town pair that gets its own page. */
export const TOWN_PAGES = Object.entries(MATRIX).flatMap(([sid, ids]) =>
  (ids ?? []).map((id) => {
    const s = service(sid), c = city(id);
    return { service: s, city: c, slug: slugFor(s, c), key: `${s.id}--${c.id}` };
  }),
);

/** The page for one service in one town, or the main service page when it has none. */
export function townPath(s: Service, c: City): string {
  return TOWN_PAGES.some((p) => p.service.id === s.id && p.city.id === c.id) ? `/${slugFor(s, c)}/` : s.path;
}
export const hasTownPage = (s: Service, c: City) => TOWN_PAGES.some((p) => p.service.id === s.id && p.city.id === c.id);
export const townsFor = (s: Service) => TOWN_PAGES.filter((p) => p.service.id === s.id).map((p) => p.city);
export const pagesIn = (c: City) => TOWN_PAGES.filter((p) => p.city.id === c.id);
export { SERVICES };
