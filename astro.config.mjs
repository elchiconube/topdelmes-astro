import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import { getCurrentMonthName } from './src/utils';

import robotsTxt from 'astro-robots-txt';

const month = getCurrentMonthName();
const year = new Date().getFullYear();

const robotTxtConfig = {
  sitemap: [
    'https://topdelmes.com/sitemap.xml',
    'https://topdelmes.com/sitemap-news.xml',
  ],
  policy: [
    {
      userAgent: '*',
      allow: '/',
    },
    {
      userAgent: 'Googlebot',
      allow: '/',
    },
    {
      userAgent: 'Googlebot-News',
      allow: '/',
    }
  ]
};

export default defineConfig({
  site: 'https://topdelmes.com',
  redirects: {
    '/mejores/series': `/mejores/series/${year}/${month}`,
    '/mejores/peliculas': `/mejores/peliculas/${year}/${month}`
  },
  output: "server",
  adapter: node({
    mode: "standalone"
  }),
  server: {
    host: '0.0.0.0'
  },
  integrations: [robotsTxt(robotTxtConfig)]
});