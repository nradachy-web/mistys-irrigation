/* ============================================================================
   CONTENT SHAPES

   Page copy lives in JSON under src/content. Every file is checked against the
   shapes below, at build time (src/content.config.ts) and on demand
   (`node scripts/check-content.mjs <file>`), so a page cannot ship with a field
   missing, a photo that does not exist or a review nobody wrote.

   Inline markup allowed inside any text field: **bold** and [label](/path/).
   In a heading, **a phrase** is the pink italic accent instead. No em or en
   dashes anywhere.

   services/<service-id>.json                 the service pages
   towns/<service-id>--<city-id>.json         one service in one town
   cities/<city-id>.json                      the town hubs
   ========================================================================== */

/**
 * @param {typeof import('astro/zod').z} z
 * @param {{ photos: string[], reviews: string[], services: string[], cities: string[] }} ids
 */
export function makeSchemas(z, ids) {
  const noDash = (s) => !/[–—]/.test(s);
  const text = (min = 1, max = 2000) => z.string().min(min).max(max).refine(noDash, 'no em or en dashes');

  const photoId = z.enum(ids.photos);
  const reviewId = z.enum(ids.reviews);
  const serviceId = z.enum(ids.services);
  const cityId = z.enum(ids.cities);
  const plane = z.enum(['mist', 'white', 'ink']).default('mist');

  const meta = z.object({
    /** Browser title. 30 to 62 characters, keyword first, brand last. */
    title: text(30, 62),
    /** Search snippet. 110 to 160 characters. */
    description: text(110, 160),
  });

  const hero = z.object({
    /** The keyword line inside the h1: "Sprinkler repair in Fenton, MI". */
    kicker: text(10, 90),
    /** The display line. Short. Wrap one phrase in ** for the pink italic accent. */
    title: text(8, 70),
    lede: text(80, 330),
    chips: z.array(text(3, 40)).min(2).max(3),
    photo: photoId,
  });

  const cta = z.object({ label: text(3, 40), href: z.string().min(1) });
  const faq = z.array(z.object({ q: text(8, 140), a: text(40, 1100) }));

  const headFields = {
    plane,
    eyebrow: text(2, 40).optional(),
    title: text(6, 110),
    intro: text(20, 520).optional(),
  };

  const block = z.discriminatedUnion('type', [
    /** Words beside a photo, with optional ticks. */
    z.object({
      type: z.literal('intro'),
      ...headFields,
      body: z.array(text(20, 900)).max(4).default([]),
      checks: z.array(text(8, 240)).max(7).default([]),
      photo: photoId.optional(),
      flip: z.boolean().default(false),
      cta: cta.optional(),
    }),
    /** A grid of short cards. */
    z.object({
      type: z.literal('cards'),
      ...headFields,
      columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
      items: z.array(z.object({ tag: text(2, 40).optional(), title: text(3, 70), body: text(20, 420) })).min(2).max(8),
    }),
    /** A small comparison: options across, qualities down. */
    z.object({
      type: z.literal('compare'),
      ...headFields,
      columns: z.array(text(2, 40)).min(2).max(4),
      highlight: z.number().int().min(0).max(3).optional(),
      rows: z.array(z.object({ label: text(2, 40), values: z.array(text(1, 90)).min(2).max(4) })).min(2).max(7),
    }),
    /** A numbered process. */
    z.object({
      type: z.literal('steps'),
      ...headFields,
      steps: z.array(z.object({ title: text(3, 60), body: text(20, 360), note: text(2, 40).optional() })).min(3).max(6),
      footnote: text(10, 400).optional(),
    }),
    /** Photos with captions. */
    z.object({
      type: z.literal('gallery'),
      ...headFields,
      photos: z.array(photoId).min(2).max(6),
    }),
    /** Google reviews by id (see src/data/reviews.ts). */
    z.object({
      type: z.literal('reviews'),
      ...headFields,
      ids: z.array(reviewId).min(2).max(3),
    }),
    /** One of the interactive panels, with words beside or above it. */
    z.object({
      type: z.literal('panel'),
      kind: z.enum(['coverage', 'blowout', 'calc', 'season', 'rust', 'diagnose']),
      ...headFields,
      points: z.array(text(8, 240)).max(4).default([]),
    }),
    /** One statement worth stopping on, large. */
    z.object({
      type: z.literal('note'),
      ...headFields,
      body: text(20, 520),
      figure: text(1, 12).optional(),
      figureLabel: text(3, 60).optional(),
    }),
    /** The towns, as links. */
    z.object({ type: z.literal('areas'), ...headFields }),
    /** Questions (the page's main FAQ uses the top-level `faq` field instead). */
    z.object({ type: z.literal('faq'), ...headFields, items: faq.min(2).max(12) }),
  ]);

  const services = z.object({
    service: serviceId,
    meta,
    hero,
    blocks: z.array(block).min(3).max(12),
    faq: faq.min(4).max(12),
    faqIntro: text(10, 240).optional(),
    quote: z.object({ title: text(10, 90), lede: text(40, 320) }).optional(),
    /** The short version of what this service is, reused on every town page. */
    summary: z.object({
      title: text(10, 90),
      intro: text(40, 420),
      items: z.array(z.object({ name: text(2, 60), detail: text(8, 200) })).min(2).max(6),
      footnote: text(10, 420).optional(),
    }),
  });

  const towns = z.object({
    service: serviceId,
    city: cityId,
    meta,
    hero,
    /** Why this service matters in this town. Grounded in docs/research/<city>.md. */
    local: z.object({
      eyebrow: text(2, 40).optional(),
      title: text(10, 110),
      intro: text(60, 520),
      points: z.array(z.object({ title: text(4, 70), body: text(40, 380) })).min(3).max(4),
    }),
    /** How a visit actually runs in this town: scheduling, access, what to expect. */
    logistics: z.object({
      title: text(10, 110),
      body: z.array(text(40, 600)).min(1).max(3),
      facts: z.array(z.object({ label: text(2, 40), value: text(2, 90) })).min(2).max(4),
    }),
    photo: photoId,
    faq: faq.min(3).max(6),
    reviews: z.array(reviewId).min(2).max(3),
  });

  const cities = z.object({
    city: cityId,
    meta,
    hero,
    about: z.object({
      eyebrow: text(2, 40).optional(),
      title: text(10, 110),
      body: z.array(text(40, 700)).min(1).max(3),
      points: z.array(z.object({ title: text(4, 70), body: text(40, 380) })).min(3).max(4),
      photo: photoId,
    }),
    logistics: z.object({
      title: text(10, 110),
      body: z.array(text(40, 600)).min(1).max(3),
      facts: z.array(z.object({ label: text(2, 40), value: text(2, 90) })).min(2).max(4),
    }),
    faq: faq.min(3).max(6),
    reviews: z.array(reviewId).min(2).max(3),
    /** Nearby towns to link to, by id. */
    neighbors: z.array(cityId).min(2).max(4),
  });

  return { block, services, towns, cities };
}
