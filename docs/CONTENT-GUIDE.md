# Writing for mistysirr.com

Read `docs/FACTS.md` first. The gold standard for a service page is
`src/content/services/sprinkler-repair.json`. Shapes are in `src/content.schema.mjs`.
Check a file with `node scripts/check-content.mjs <file>` (it must print `ok`).
Do not run `npm run build` or `astro build`: other writers are working at the same time.

## Who is reading
A homeowner around Fenton with a sprinkler system: a zone that will not shut off, brown
patches, a startup to book in April, a blowout to book in October, a lake lot whose
sprinklers pull from the lake, a well that stains the house orange. Busy, practical,
not an irrigation expert. Answer the question first, then explain.

## Voice
- Plain, confident, specific. Short sentences. "We" is Misty's Irrigation.
- Sentence case everywhere. In a heading, wrap ONE short phrase in `**` for the pink italic
  accent: `"Fix the head, **not the timer.**"`.
- No em dashes or en dashes, ever (the checker fails the file). Use a period or a comma.
- No filler or ad-speak: never "nestled", "boasts", "look no further", "whether you're",
  "in today's", "peace of mind", "top-notch", "seamless", "elevate", "unlock", "we pride ourselves".
- No superlatives or rankings. No promises the facts do not support (see FACTS.md).
- Explain irrigation in homeowner words: "the short pipe under the head" before "riser".
- Each page should teach something true and useful that a homeowner would not know.

## Town pages: the local part must be real
Every town page and hub carries local points that are TRUE and SPECIFIC to that town, and
every one traces to `docs/research/<town>.md`, where each fact has its source URL. Good local
material for irrigation:
- Lakes in or next to the town (lake lots, lake pump systems, lake associations).
- Where the water comes from: city or village water in town, private wells outside it,
  and who supplies the city water (cite the city or utility page).
- Iron in well water in the area, if a public source (EGLE, MSU Extension, county health) says so.
- Soil: sandy, loam or clay, from the USDA Web Soil Survey or MSU Extension.
- Watering rules: an odd and even schedule or ban, ONLY if the town's own page says so. Cite it.
- Neighborhood character: older in-town lots vs newer subdivisions vs acreage (cite if specific).
- Weather: average first and last frost from a public climate source, if cited.
Never invent a subdivision name, a street, a statistic or an ordinance. If you cannot verify
a fact, leave it out. A shorter true page beats a longer invented one.

## Town page fields (towns/<service>--<city>.json)
- `meta.title` 30 to 62 characters, names the town. `meta.description` 110 to 160.
- `hero.kicker`: "<Service> in <Town>, MI". `hero.title`: short display line with one `**` accent.
  `hero.lede` names "Misty's". `hero.chips`: 2 or 3 short true facts.
- `local`: why this service matters in this town, 3 or 4 points with local facts.
- `logistics`: how a visit runs here, plus 2 to 4 facts (label and value). Never "County".
- `faq`: 3 to 6. The first question names the town; its answer names "Misty's".
- `reviews`: two or three of `zachary-b`, `susan-r`, `joe-s`.
- At least 420 words in the file. No sentence of 70+ characters may be identical to another
  file in the same folder: write each page fresh.

## Photo ids you may use
Real: `lake-lawn`, `estate-clouds`, `garden-misters`, `pine-lawn`, `flagstone-pond`,
`colonial-mist`, `trencher-dog`, `wrap-car-dog`, `street-sprinklers`.
Relit (real job): `lake-sunrise`.
Illustrations: `ai-spray-macro`, `ai-valve-box`, `ai-controller`, `ai-blowout`, `ai-pvb`,
`ai-lake-pump`, `ai-drip`, `ai-startup`, `ai-rust-clean`, `ai-rust-stained`.
Pick the photo that matches the service. Vary hero photos between towns where it still fits.

## Links
Only to pages on this site, written as site paths: `[spring startup](/sprinkler-startup/)`.
Service paths: /sprinkler-startup/ /sprinkler-winterization/ /sprinkler-repair/
/sprinkler-head-replacement/ /sprinkler-valve-repair/ /sprinkler-installation/
/lake-pump-irrigation/ /drip-irrigation/ /sprinkler-controllers/ /backflow-preventers/
/rust-stain-prevention/. Town pages: /<townSlug>-<town>-mi/ (for example
/sprinkler-repair-linden-mi/). Hubs: /service-areas/<town>-mi/. Also /book-service/,
/watering-guide/, /contact-us/. Phone link: `[(810) 423-9513](tel:+18104239513)`.
