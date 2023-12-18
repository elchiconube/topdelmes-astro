import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import { getCurrentMonthName } from './src/utils';


const month = getCurrentMonthName();
const year = new Date().getFullYear();

export default defineConfig({
  redirects: {
    '/mejores/peliculas': `/mejores/peliculas/${year}/${month}`,
  },
  output: "server",
  adapter: node({
    mode: "standalone"
  }),
  server: {
    host: '0.0.0.0'
  }
});