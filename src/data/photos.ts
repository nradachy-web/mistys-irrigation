/* The photo library. Three kinds, and the page always tells the truth about which:
     real    Misty's own photos, from their Google listing, color corrected only.
     relit   a real job relit with an image model. The caption says so.
     ai      made from a prompt for a service with no job photo yet. The caption
             says "Illustration". Never used as proof of a job.
   `alt` says what is in the frame; `caption` is what may be printed under it.
   Never caption a photo with a town: the jobs are not labeled by location.

   Add a photo: put the original in _source, add it to scripts/photos.py, run
   `npm run photos`, then describe it here. */

import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.jpg', { eager: true });
const byId: Record<string, ImageMetadata> = {};
for (const [path, mod] of Object.entries(files)) byId[path.split('/').pop()!.replace(/\.jpg$/, '')] = mod.default;

type Kind = 'real' | 'relit' | 'ai';
interface Entry { alt: string; caption: string; kind?: Kind; focus?: 'top' | 'bottom' | 'left' | 'right' }

export const PHOTOS = {
  'lake-sunrise': { kind: 'relit', alt: 'Sprinklers arcing over a lakefront lawn at sunrise, with clipped yews, a stone wall and mist on the lake', caption: 'A lakefront lawn we look after, relit for sunrise' },
  'lake-lawn': { alt: 'Three sprinklers running across a lakefront lawn beside clipped yew hedges and a low stone wall', caption: 'A lakefront system running on a spring morning' },
  'estate-clouds': { alt: 'Three sprinklers spraying across a wide country lawn in front of a farmhouse under big clouds', caption: 'A big country lawn, three zones running' },
  'garden-misters': { alt: 'A flower garden with low misting heads running beside a patio, a rocking chair and a shed', caption: 'Low mist heads keeping a flower garden watered' },
  'pine-lawn': { alt: 'A thick green lawn sweeping past tall pines and ornamental grass on a gray morning', caption: 'Even coverage under the pines' },
  'flagstone-pond': { alt: 'A flagstone path beside a mulched bed leading down to a green lawn and a pond with fall color behind', caption: 'A pond lawn in October' },
  'colonial-mist': { alt: 'Fine sprinkler mist drifting across a striped lawn beside a large gray home', caption: 'Mist over a striped lawn' },
  'trencher-dog': { alt: 'An orange Kubota stand on trencher in a driveway with the shop dog lying in front of it', caption: 'The trencher, and the shop dog' },
  'wrap-car-dog': { alt: "The Misty's Irrigation car, wrapped in flowers and pink, with the shop dog lying in front of it", caption: 'The service car and the shop dog' },
  'street-sprinklers': { alt: 'Sprinklers spraying across a front lawn under big shade trees on a quiet street', caption: 'A front yard system running after a repair' },
  'ai-spray-macro': { kind: 'ai', alt: 'A pop-up spray head throwing a fan of water across a dewy lawn at sunrise', caption: 'Illustration' },
  'ai-valve-box': { kind: 'ai', alt: 'An open valve box in a lawn with three sprinkler valves, wire connectors and a gloved hand', caption: 'Illustration' },
  'ai-controller': { kind: 'ai', alt: 'A smart sprinkler controller mounted on a garage wall beside the door', caption: 'Illustration' },
  'ai-blowout': { kind: 'ai', alt: 'A compressor hose connected to a sprinkler blowout port on a frosty October morning, a head puffing air in the yard', caption: 'Illustration' },
  'ai-pvb': { kind: 'ai', alt: 'A brass pressure vacuum breaker with green valve handles on a copper riser beside a house', caption: 'Illustration' },
  'ai-lake-pump': { kind: 'ai', alt: 'A dock on a misty lake at dawn with a suction line running to a small pump house on shore and sprinklers on the lawn', caption: 'Illustration' },
  'ai-drip': { kind: 'ai', alt: 'Drip tubing running into flowerpots of petunias and herbs on a sunny patio', caption: 'Illustration' },
  'ai-startup': { kind: 'ai', alt: 'A rotor sprinkler rising from a dewy spring lawn with daffodils behind it', caption: 'Illustration' },
  'ai-rust-clean': { kind: 'ai', alt: 'Clean white vinyl siding, a gray walk and a lawn with a sprinkler head', caption: 'Illustration' },
  'ai-rust-stained': { kind: 'ai', alt: 'White vinyl siding and a walk stained orange by well water from a sprinkler', caption: 'Illustration' },
} satisfies Record<string, Entry>;

export type PhotoId = keyof typeof PHOTOS;
export const PHOTO_IDS = Object.keys(PHOTOS).filter((id) => byId[id]) as PhotoId[];

export function photo(id: PhotoId) {
  const e = PHOTOS[id] as Entry;
  const src = byId[id];
  if (!src) throw new Error(`photo ${id} has no file in src/assets/photos (run npm run photos)`);
  return { id, src, alt: e.alt, caption: e.caption, kind: (e.kind ?? 'real') as Kind, focus: e.focus };
}
