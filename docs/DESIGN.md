# Design: First light

## The idea
Sprinklers run at dawn, so the site lives there. It opens on one of their real jobs, a
lakefront lawn, relit for sunrise: mist on the water, the spray glowing. The photo warms from
pre-dawn as the page loads, and a fine mist drifts across it and parts around the pointer.
The headline is the promise: "Sprinklers, handled. Every season."

## Two planes
| Plane | Token | Use |
|---|---|---|
| Ink | `--ink` #0b1220, a blue black from the logo's arcs | Heroes, panels, proof, the booking band, footer |
| Mist | `--mist` #edf2f5 | Reading bands |
| White | `--white` #fbfcfd | A second light plane |

Bands alternate and meet clean. An ink band with a panel gets `dawn`: a faint warm corner and a
faint water blue corner, nothing more.

## One accent
Misty's pink from the logo, `--pink` #e83090. `--pink-btn` #ff5aa9 with ink text on ink, `--rose`
#c21c74 with white text on light, `--rose-ink` for pink text on light. Water blue (`--water`) is
for water in the illustrations only. Daisy yellow is for stars only.

## Type
Inter Tight (one variable subset, 22 KB, plus an italic used only for the accent phrase). Display
set tight at 730 to 760. One phrase per heading in pink italic: `**like this**`. Sentence case.

## The ornament
The logo's double arc (the spray over "MISTY'S") is the only ornament: it leads every eyebrow, the
hero kicker and sits large and faint behind page headers.

## Motion
The hero: the sunrise (a cool overlay fades, opacity only), the words rise, then `Mist.astro`
starts after load and idle. Below the hero, motion answers the visitor: hovers, the menu, the
accordions, the panels. Nothing slides in on scroll. Reduced motion gets a still page.

## Signature panels
- **Head to head** (`Coverage.astro`): a front yard from above with six rotors. Before a tune-up:
  a head knocked toward the driveway, a clogged nozzle, a sunk head, a broken one. The lawn color
  and the three readouts are computed from where the water lands, each state against its own
  average. On repair, heads, installation pages and their town pages.
- **Winterize it** (`Blowout.astro`): an SVG cut-away. Blow it out zone by zone, then drag winter
  in; water left in a pipe freezes and cracks it. Frames the first zones on a phone.
- **Watering calculator** (`ZoneCalc.astro`): minutes per zone, days a week, cycle and soak.
- **The season** (`Season.astro`): the irrigation year with today marked and what to book now.
- **Wipe the rust** (`RustReveal.astro`): drag across a stained wall to treat it.
- **The map** (`AreaMap.astro`): the six towns placed from real coordinates, roads and lakes.

## Photos: tell the truth about which is which
`src/data/photos.ts`: `real` (their Google listing photos), `relit` (a real job relit, captioned
so), `ai` (illustrations, always labeled "Illustration"). Never caption a photo with a town.

## Performance rules
Same as the HD Landscape and Refresh My Ride builds: no client framework, CSS inlined, one
preloaded font, preloaded hero, every image sized, lazy below the fold, Google tag on first
interaction, panels start only near the screen and sleep off it.
