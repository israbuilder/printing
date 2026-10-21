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
  site: 'https://albranprinting.com',

  redirects: {
    '/charities': '/community-mission',
  },

  trailingSlash: 'ignore',
  build: { format: 'directory' },

  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/apply-received') &&
        !page.includes('/api/'),
      serialize: async (item) => {
        if (item.url.includes('/services/')) {
          item.changefreq = 'weekly';
          item.priority = 0.9;
        } else if (item.url === 'https://albranprinting.com/' || item.url === 'https://albranprinting.com') {
          item.changefreq = 'daily';
          item.priority = 1.0;
        } else if (item.url.includes('/areas/')) {
          item.changefreq = 'monthly';
          item.priority = 0.8;
        } else if (item.url.includes('/blog')) {
          item.changefreq = 'weekly';
          item.priority = 0.8;
        } else {
          item.changefreq = 'monthly';
          item.priority = 0.7;
        }
        return item;
      },
    }),
  ],

  adapter: node({
    mode: 'standalone'
  })
});
