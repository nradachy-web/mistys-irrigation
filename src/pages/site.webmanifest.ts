import type { APIRoute } from 'astro';
import { BRAND } from '../data/site';
import { href } from '../lib/paths';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: BRAND.name,
      short_name: "Misty's",
      start_url: href('/'),
      display: 'browser',
      background_color: '#0b1220',
      theme_color: '#0b1220',
      icons: [
        { src: href('/icon-192.png'), sizes: '192x192', type: 'image/png' },
        { src: href('/icon-512.png'), sizes: '512x512', type: 'image/png' },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
