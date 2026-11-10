import type { APIRoute } from 'astro';
import { BRAND, RATING } from '../data/site';
import { GROUPS, inGroup } from '../data/services';
import { CITIES, hubPath, TOWN_PAGES, townsFor } from '../data/cities';

/* A plain summary for AI assistants, in the llms.txt format. Built from the same
   data as the pages, so it cannot drift. */
export const GET: APIRoute = () => {
  const u = (p: string) => `${BRAND.origin}${p}`;
  const lines = [
    `# ${BRAND.name}`,
    '',
    `> ${BRAND.name} is a family run lawn sprinkler company based in ${BRAND.city}, Michigan, owned by ${BRAND.owners}. It starts up, winterizes (blows out), repairs and installs residential irrigation systems in Fenton, Linden, Grand Blanc, Holly, Hartland and Howell, including lake pump systems. Licensed and insured. ${RATING.value} stars on Google from ${RATING.countLabel} reviews as of ${RATING.asOf}. Phone and text ${BRAND.phone}.`,
    '',
    'Spring startups run from about mid April through May. Fall blowouts run from late September into November, before the ground freezes.',
    '',
    '## Services',
    ...GROUPS.flatMap((g) => inGroup(g.id).map((s) => `- [${s.name}](${u(s.path)}): ${s.teaser}`)),
    '',
    '## Service areas',
    ...CITIES.map((c) => `- [${c.name}, MI](${u(hubPath(c))}) (${c.county} County)`),
    '',
    '## Each service, by town',
    ...GROUPS.flatMap((g) => inGroup(g.id).filter((s) => townsFor(s).length).map((s) => `- ${s.name}: ${TOWN_PAGES.filter((p) => p.service.id === s.id).map((p) => `[${p.city.name}](${u(`/${p.slug}/`)})`).join(', ')}`)),
    '',
    '## More',
    `- [All services](${u('/services/')})`,
    `- [All service areas](${u('/service-areas/')})`,
    `- [Watering guide and calculator](${u('/watering-guide/')}): minutes per zone by head type, sun, month and soil`,
    `- [Book service](${u('/book-service/')})`,
    `- [Reviews](${u('/reviews/')})`,
    `- [About](${u('/about-us/')})`,
    `- [Careers](${u('/careers/')})`,
    `- [Contact](${u('/contact-us/')})`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
