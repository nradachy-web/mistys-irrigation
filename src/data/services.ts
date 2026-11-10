/* The service registry: names, URLs and the one-line facts that the menu, cards
   and town pages share. Page copy lives in src/content. The list is the old
   site's own service list (January 2025), plus repair, which most reviews are
   about. See docs/FACTS.md. */

import type { PhotoId } from './photos';

export type ServiceId =
  | 'sprinkler-repair' | 'head-replacement' | 'valve-repair'
  | 'startup' | 'winterization'
  | 'installation' | 'lake-pump' | 'drip' | 'controllers' | 'backflow' | 'rust';

export type GroupId = 'season' | 'repair' | 'systems';

export interface Service {
  id: ServiceId;
  name: string;
  /** Short name for menus and chips. */
  short: string;
  /** Lower case, for use mid sentence. */
  noun: string;
  path: string;
  /** Slug used for the service-in-a-town pages: /{townSlug}-{city}-mi/. */
  townSlug: string;
  group: GroupId;
  photo: PhotoId;
  teaser: string;
  /** The form's checkbox label. */
  ask: string;
}

export const GROUPS: { id: GroupId; name: string; blurb: string }[] = [
  { id: 'season', name: 'Seasonal', blurb: 'Turned on right in spring. Blown out before the ground freezes.' },
  { id: 'repair', name: 'Repairs', blurb: 'Heads, leaks, valves and wiring, found and fixed in one visit when we can.' },
  { id: 'systems', name: 'Systems and upgrades', blurb: 'New systems, lake pumps, drip, controllers, backflow and rust treatment.' },
];

const ALL: Service[] = [
  { id: 'startup', name: 'Spring sprinkler startup', short: 'Spring startup', noun: 'spring startup', path: '/sprinkler-startup/', townSlug: 'sprinkler-startup', group: 'season', photo: 'ai-startup',
    teaser: 'Water on slowly, every zone run and checked, heads adjusted and the controller set for the season.', ask: 'Spring startup' },
  { id: 'winterization', name: 'Sprinkler winterization', short: 'Winterization', noun: 'winterization', path: '/sprinkler-winterization/', townSlug: 'sprinkler-winterization', group: 'season', photo: 'ai-blowout',
    teaser: 'A compressed air blowout, zone by zone, so no water is left in the lines when Michigan freezes.', ask: 'Fall blowout' },
  { id: 'sprinkler-repair', name: 'Sprinkler repair', short: 'Sprinkler repair', noun: 'sprinkler repair', path: '/sprinkler-repair/', townSlug: 'sprinkler-repair', group: 'repair', photo: 'street-sprinklers',
    teaser: 'Broken heads, leaks, dry spots, zones that will not start or will not stop. Found, explained and fixed.', ask: 'Repair' },
  { id: 'head-replacement', name: 'Sprinkler head replacement', short: 'Heads and nozzles', noun: 'head replacement', path: '/sprinkler-head-replacement/', townSlug: 'sprinkler-head-replacement', group: 'repair', photo: 'ai-spray-macro',
    teaser: 'Cracked, sunk, stuck and mower-hit heads replaced, raised and aimed so the coverage meets again.', ask: 'Heads and nozzles' },
  { id: 'valve-repair', name: 'Valve locating and replacement', short: 'Valves', noun: 'valve work', path: '/sprinkler-valve-repair/', townSlug: 'sprinkler-valve-repair', group: 'repair', photo: 'ai-valve-box',
    teaser: 'Buried valve boxes found, stuck and leaking valves rebuilt or replaced, and the wiring traced.', ask: 'Valve locating or repair' },
  { id: 'installation', name: 'Sprinkler system installation', short: 'New systems', noun: 'a new system', path: '/sprinkler-installation/', townSlug: 'sprinkler-installation', group: 'systems', photo: 'trencher-dog',
    teaser: 'New systems and added zones, laid out head to head for the yard you actually have.', ask: 'New system or added zones' },
  { id: 'lake-pump', name: 'Lake pump irrigation', short: 'Lake pumps', noun: 'lake pump work', path: '/lake-pump-irrigation/', townSlug: 'lake-pump-irrigation', group: 'systems', photo: 'ai-lake-pump',
    teaser: 'Sprinklers that drink from the lake: pumps primed, intakes checked, startups and blowouts done right.', ask: 'Lake pump system' },
  { id: 'drip', name: 'Drip irrigation for pots and beds', short: 'Drip for pots and beds', noun: 'drip irrigation', path: '/drip-irrigation/', townSlug: 'drip-irrigation', group: 'systems', photo: 'garden-misters',
    teaser: 'Flowerpots, planters and beds watered at the roots on the same timer as the lawn.', ask: 'Flowerpot or bed drip' },
  { id: 'controllers', name: 'Controller installation and setup', short: 'Controllers', noun: 'controller setup', path: '/sprinkler-controllers/', townSlug: 'sprinkler-controllers', group: 'systems', photo: 'ai-controller',
    teaser: 'New and smart controllers wired, zoned and programmed for your yard, not left on the factory default.', ask: 'Controller or timer' },
  { id: 'backflow', name: 'Pressure vacuum breakers', short: 'Backflow and PVBs', noun: 'backflow work', path: '/backflow-preventers/', townSlug: 'backflow-preventers', group: 'systems', photo: 'ai-pvb',
    teaser: 'The device that keeps lawn water out of your drinking water, installed, repaired and protected for winter.', ask: 'Pressure vacuum breaker' },
  { id: 'rust', name: 'Rust stain prevention', short: 'Rust stain treatment', noun: 'rust prevention', path: '/rust-stain-prevention/', townSlug: 'rust-stain-prevention', group: 'systems', photo: 'ai-rust-stained',
    teaser: 'Rid-O-Rust treatment systems that stop well water from painting your house and walks orange.', ask: 'Rust stain treatment' },
];

/** Every service the content may name. Content validates against this list. */
export const ALL_SERVICES = ALL;
export const SERVICES = ALL;
export const service = (id: string) => SERVICES.find((s) => s.id === id)!;
export const inGroup = (g: GroupId) => SERVICES.filter((s) => s.group === g);
