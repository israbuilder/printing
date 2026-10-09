// @ts-check
import { defineConfig } from 'astro/config';

// Disable Netlify Vite plugin's background Deno Edge Functions emulator in local dev
if (!process.env.NETLIFY) {
  process.env.NETLIFY_DEV = 'true';
}

import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://houstonitsecurity.net',

  redirects: {
    '/charities': '/community-mission',
    '/about': '/meet-hugo',
  },

  trailingSlash: 'ignore',
  build: { format: 'directory' },

  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()],

  adapter: node({
    mode: 'standalone'
  })
});
