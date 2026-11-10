/* Check content files against the rules, without building the site.

     node scripts/check-content.mjs src/content/towns/sprinkler-repair--linden.json
     node scripts/check-content.mjs            (every content file)

   It reads only the files you name (plus the others in the same folder, to
   catch copy pasted between town pages), writes nothing, and exits 1 on any
   problem. Safe to run while other people are editing other files. */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'astro/zod';
import { makeSchemas } from '../src/content.schema.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

const photosTs = read('src/data/photos.ts');
const servicesTs = read('src/data/services.ts');
const citiesTs = read('src/data/cities.ts');
const ids = {
  photos: [...photosTs.matchAll(/^\s*'([a-z0-9-]+)': \{ (?:kind: '[a-z]+', )?alt:/gm)].map((m) => m[1]),
  reviews: [...read('src/data/reviews.ts').matchAll(/id: '([a-z0-9-]+)', name:/g)].map((m) => m[1]),
  services: [...servicesTs.matchAll(/\{ id: '([a-z-]+)', name:/g)].map((m) => m[1]),
  cities: [...citiesTs.matchAll(/\{ id: '([a-z-]+)', name: '([^']+)'/g)].map((m) => m[1]),
};
const cityNames = Object.fromEntries([...citiesTs.matchAll(/\{ id: '([a-z-]+)', name: '([^']+)'/g)].map((m) => [m[1], m[2]]));
const lakeTowns = [...citiesTs.matchAll(/\{ id: '([a-z-]+)'[^}]*lakes: true/g)].map((m) => m[1]);
const servicePaths = [...servicesTs.matchAll(/path: '([^']+)'/g)].map((m) => m[1]);
const slugOf = Object.fromEntries([...servicesTs.matchAll(/\{ id: '([a-z-]+)', name: '[^']+', short: '[^']+', noun: '[^']+', path: '[^']+', townSlug: '([^']+)'/g)].map((m) => [m[1], m[2]]));
const matrix = [
  ...['sprinkler-repair', 'winterization', 'startup', 'installation'].flatMap((s) => ids.cities.map((c) => [s, c])),
  ...lakeTowns.map((c) => ['lake-pump', c]),
];

const schemas = makeSchemas(z, ids);

const validPaths = new Set([
  '/', '/services/', '/service-areas/', '/about-us/', '/contact-us/', '/book-service/', '/privacy-policy/', '/reviews/', '/watering-guide/', '/careers/',
  ...servicePaths,
  ...ids.cities.map((c) => `/service-areas/${c}-mi/`),
  ...matrix.map(([s, c]) => `/${slugOf[s]}-${c}-mi/`),
]);

const FORBIDDEN = [
  [/[–—]/, 'an en or em dash'],
  [/\b(100%|every single|all) (five|5)[- ]star/i, 'a claim that every review is five stars'],
  [/#1\b|number one\b|\bthe best\b|\bbest (irrigation|sprinkler|in (michigan|fenton|genesee|town|the))|top[- ]rated|award[- ]winning|premier\b|leading\b/i, 'a ranking or superlative claim'],
  [/guarantee(d|s)?\b|warrant(y|ies|ied)\b/i, 'a guarantee or warranty (not confirmed by Misty and Mike)'],
  [/\b(bonded|certified|accredited)\b/i, 'a bond or certification claim (only "licensed and insured" is sourced)'],
  [/\bBBB\b|better business bureau/i, 'a BBB mention'],
  [/\b(since (19|20)\d\d|\d+\+? years? (of|in) (experience|business)|decades)\b/i, 'years in business (not sourced)'],
  [/\$\s?\d/, 'a price (they do not publish prices)'],
  [/\b(cheap|cheapest|lowest price|unbeatable|best price)\b/i, 'a price boast'],
  [/backflow test|annual test|test(ing)? (the |your )?backflow|certified tester/i, 'backflow testing (not confirmed: they install and repair PVBs)'],
  [/\bwe (mow|fertili[sz]e|aerate|plow)\b|lawn (mowing|care service)|fertili[sz]ation service/i, 'lawn care they do not sell'],
  [/\bFlint\b/, 'Flint (Misty asked to leave it out)'],
  [/24\/7|24 hours a day|around the clock|emergency (service|repair|call)/i, 'an emergency or around the clock promise (not confirmed)'],
  [/same[- ]day|within (an|one|1|two|2) hours?/i, 'a response time promise (not confirmed)'],
  [/\b(Hunter|Rain ?Bird|Toro|Rachio|Orbit|Irritrol|K-?Rain|Weathermatic|Netafim|Febco|Wilkins|Zurn|Watts)\b/, 'a product brand (not confirmed which brands they install)'],
  [/\b(our|we have|with) (a )?\d+[- ](person|man|member)\b|\b\d+ (crews|trucks|employees|technicians)\b/i, 'a crew size (not sourced)'],
  [/lorem ipsum|TODO|TBD\b|XXX/i, 'placeholder text'],
  [/our (local|town) pages|we also have (local )?pages|this (web)?page|this website/i, 'talk about the website itself: write for the homeowner'],
];

const strings = (node, out = []) => {
  if (typeof node === 'string') out.push(node);
  else if (Array.isArray(node)) node.forEach((n) => strings(n, out));
  else if (node && typeof node === 'object') Object.values(node).forEach((n) => strings(n, out));
  return out;
};
const sentences = (s) =>
  s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*/g, '')
    .split(/(?<=[.!?])\s+/)
    .map((x) => x.trim())
    .filter((x) => x.length >= 70);

const args = process.argv.slice(2);
const kinds = ['services', 'towns', 'cities'];
const all = kinds.flatMap((k) => {
  const dir = join(ROOT, 'src/content', k);
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => join(dir, f)) : [];
});
const targets = args.length ? args.map((a) => resolve(a)) : all;

let failed = 0;
for (const file of targets) {
  const problems = [];
  const warn = [];
  const kind = basename(dirname(file));
  const name = basename(file, '.json');
  let data;
  try {
    data = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    console.log(`FAIL ${file}\n  not valid JSON: ${e.message}`);
    failed++;
    continue;
  }
  if (!schemas[kind]) {
    console.log(`FAIL ${file}\n  not inside src/content/{services,towns,cities}`);
    failed++;
    continue;
  }
  const parsed = schemas[kind].safeParse(data);
  if (!parsed.success) for (const issue of parsed.error.issues) problems.push(`${issue.path.join('.')}: ${issue.message}`);

  if (kind === 'services' && data.service !== name) problems.push(`file is ${name}.json but service is "${data.service}"`);
  if (kind === 'cities' && data.city !== name) problems.push(`file is ${name}.json but city is "${data.city}"`);
  if (kind === 'towns' && `${data.service}--${data.city}` !== name) problems.push(`file is ${name}.json but inside it says ${data.service}--${data.city}`);
  if (kind === 'towns' && !matrix.some(([s, c]) => s === data.service && c === data.city)) problems.push(`${data.service} in ${data.city} is not in the matrix in src/data/cities.ts`);

  const texts = strings(data);
  const joined = texts.join('\n');

  for (const [re, what] of FORBIDDEN) {
    const m = joined.match(re);
    if (m) problems.push(`contains ${what}: "…${joined.slice(Math.max(0, m.index - 30), m.index + 40).replace(/\s+/g, ' ')}…"`);
  }

  for (const m of joined.matchAll(/\]\(([^)\s]+)\)/g)) {
    const url = m[1];
    if (/^(tel:\+18104239513|sms:\+18104239513|#quote)$/.test(url)) continue;
    if (/^https?:/.test(url)) {
      problems.push(`outside link ${url}: link only to pages on this site`);
      continue;
    }
    if (!validPaths.has(url)) problems.push(`link to ${url}, which is not a page on this site`);
  }

  const town = cityNames[data.city];
  if ((kind === 'towns' || kind === 'cities') && town) {
    if (!data.meta?.title?.includes(town)) problems.push(`meta.title does not name ${town}`);
    if (!data.hero?.kicker?.includes(town)) problems.push(`hero.kicker does not name ${town}`);
    const words = joined.split(/\s+/).length;
    if (words < 420) problems.push(`only ${words} words: too thin to be worth a page`);
    if (!/Misty's/.test(data.hero?.lede ?? '')) problems.push("hero.lede does not name Misty's");
    const first = data.faq?.[0];
    if (first && (!first.q.includes(town) || !/Misty's/.test(first.a))) problems.push(`the first FAQ must ask about ${town} by name and its answer must name Misty's`);
    for (const f of data.faq ?? []) {
      if (new RegExp(`\\b(my|our) ${town}\\b`).test(f.q)) problems.push(`FAQ uses the town as an adjective: "${f.q}"`);
    }
    if ((data.logistics?.facts ?? []).some((f) => /^county$/i.test(f.label))) problems.push('the County fact tells a homeowner nothing: replace it');
    const mentions = (joined.match(new RegExp(town, 'g')) || []).length;
    if (mentions > 20) warn.push(`${town} is named ${mentions} times: reads stuffed, cut some`);
  }

  if (kind !== 'services') {
    const mine = new Set(texts.flatMap(sentences));
    const dir = dirname(file);
    for (const other of readdirSync(dir).filter((f) => f.endsWith('.json') && join(dir, f) !== file)) {
      let theirs;
      try {
        theirs = strings(JSON.parse(readFileSync(join(dir, other), 'utf8'))).flatMap(sentences);
      } catch {
        continue;
      }
      const shared = theirs.filter((s) => mine.has(s));
      if (shared.length) problems.push(`${shared.length} sentence(s) identical to ${other}, e.g. "${shared[0].slice(0, 90)}…"`);
    }
  }

  if (problems.length) {
    failed++;
    console.log(`FAIL ${file}\n` + problems.map((p) => '  ' + p).join('\n'));
  } else {
    console.log(`ok   ${file}`);
  }
  if (warn.length) console.log(warn.map((w) => '  note: ' + w).join('\n'));
}
process.exit(failed ? 1 : 0);
