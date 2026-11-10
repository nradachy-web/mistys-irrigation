/* JSON-LD builders. This is how a search or answer engine reads the business, so
   it is thorough: who, where, what, and how each page relates to the others.
   Facts come from data/site.ts. There is deliberately no aggregateRating: Google
   does not accept a business marking up its own reviews on its own site.

   schema.org has no irrigation contractor type. HomeAndConstructionBusiness is the
   nearest real one, and the product ontology link says the rest. */

import { BRAND, LINKS } from '../data/site';
import { CITIES, cityLabel } from '../data/cities';
import { SERVICES } from '../data/services';
import { plain } from './rich';

const ORIGIN = BRAND.origin;
export const BUSINESS_ID = `${ORIGIN}/#business`;
const WEBSITE_ID = `${ORIGIN}/#website`;

const area = () => CITIES.map((c) => ({ '@type': 'City', name: cityLabel(c), containedInPlace: { '@type': 'AdministrativeArea', name: `${c.county} County, Michigan` } }));

export function business() {
  return {
    '@type': ['HomeAndConstructionBusiness', 'LocalBusiness'],
    '@id': BUSINESS_ID,
    name: BRAND.name,
    alternateName: ["Misty's Irrigation Services", "Misty's Irrigation Service & Repair"],
    additionalType: 'https://www.productontology.org/id/Irrigation_sprinkler',
    description: `${BRAND.name} is a family run lawn sprinkler company based in ${BRAND.city}, Michigan, owned by ${BRAND.owners}. It starts up, winterizes, repairs and installs residential irrigation systems in Fenton, Linden, Grand Blanc, Holly, Hartland and Howell, including lake pump systems, drip for flowerpots, controllers, pressure vacuum breakers and Rid-O-Rust treatment for well water.`,
    url: `${ORIGIN}/`,
    telephone: BRAND.phoneE164,
    email: BRAND.email,
    image: `${ORIGIN}/og-image.jpg`,
    logo: `${ORIGIN}/brand/logo.png`,
    address: { '@type': 'PostalAddress', addressLocality: BRAND.city, addressRegion: BRAND.state, addressCountry: 'US' },
    areaServed: area(),
    knowsAbout: [...SERVICES.map((s) => s.name), 'Lawn sprinkler winterization', 'Sprinkler blowout', 'Lake pump irrigation', 'Well water rust stains'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Irrigation services',
      itemListElement: SERVICES.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, url: `${ORIGIN}${s.path}` } })),
    },
    sameAs: [LINKS.google, LINKS.facebook],
    founder: BRAND.owners.split(' and ').map((n) => ({ '@type': 'Person', name: n.includes('Lutz') ? n : `${n} Lutz` })),
  };
}

export function businessRef() {
  return {
    '@type': ['HomeAndConstructionBusiness', 'LocalBusiness'],
    '@id': BUSINESS_ID,
    name: BRAND.name,
    url: `${ORIGIN}/`,
    telephone: BRAND.phoneE164,
    image: `${ORIGIN}/og-image.jpg`,
    address: { '@type': 'PostalAddress', addressLocality: BRAND.city, addressRegion: BRAND.state, addressCountry: 'US' },
  };
}

export function website() {
  return { '@type': 'WebSite', '@id': WEBSITE_ID, url: `${ORIGIN}/`, name: BRAND.name, publisher: { '@id': BUSINESS_ID } };
}

export function serviceSchema(opts: { name: string; type: string; description: string; url: string; area?: string }) {
  return {
    '@type': 'Service',
    name: opts.name,
    serviceType: opts.type,
    description: plain(opts.description),
    url: opts.url,
    provider: { '@id': BUSINESS_ID },
    areaServed: opts.area ? { '@type': 'City', name: opts.area } : area(),
  };
}

export function serviceListSchema() {
  return {
    '@type': 'ItemList',
    itemListElement: SERVICES.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.name, url: `${ORIGIN}${s.path}` })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: plain(i.a) } })),
  };
}

export function breadcrumbs(trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: `${ORIGIN}${t.path}` })),
  };
}

export function howTo(opts: { name: string; description: string; steps: { title: string; body: string }[] }) {
  return {
    '@type': 'HowTo',
    name: opts.name,
    description: plain(opts.description),
    step: opts.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: plain(s.body) })),
  };
}

export function graph(nodes: object[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes });
}
