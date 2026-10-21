import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  const envUrl =
    import.meta.env.PUBLIC_API_URL ||
    (typeof process !== 'undefined' ? process.env.PUBLIC_API_URL : undefined) ||
    'https://houstonitsecurity.net/api/v1/sites/albranprinting';

  const siteApiBase = envUrl
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/posts\/?$/, '');

  try {
    const res = await fetch(`${siteApiBase}/llms-full.txt`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });

    if (!res.ok) {
      throw new Error(`CRM returned HTTP ${res.status}`);
    }

    const markdown = await res.text();

    return new Response(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('[llms-full.txt] Error fetching from CRM:', error);
    return new Response('# Service temporarily unavailable.\n\nPlease check back soon.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
};
