import { SitemapStream } from 'sitemap';
import { createWriteStream } from 'fs';
import axios from 'axios';
import 'dotenv/config';

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
  },
};

const months = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const pages = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/analisis', priority: 1.0, changefreq: 'daily' },
  { url: '/series', priority: 0.5, changefreq: 'daily' },
  { url: '/peliculas', priority: 0.5, changefreq: 'daily' },
  { url: '/autores', priority: 0.8, changefreq: 'monthly' },
];

for (let year = 1990; year <= currentYear; year++) {
  for (let monthIndex = 0; monthIndex < months.length; monthIndex++) {
    if (year === currentYear && monthIndex > currentMonth) break;
    pages.push({
      url: `/mejores/series/${year}/${months[monthIndex]}`,
      priority: 0.8,
      changefreq: 'monthly',
    });
    pages.push({
      url: `/mejores/series/${year}`,
      priority: 0.8,
      changefreq: 'monthly',
    });
  }
}

for (let year = 1920; year <= currentYear; year++) {
  for (let monthIndex = 0; monthIndex < months.length; monthIndex++) {
    if (year === currentYear && monthIndex > currentMonth) break;
    pages.push({
      url: `/mejores/peliculas/${year}/${months[monthIndex]}`,
      priority: 0.8,
      changefreq: 'monthly',
    });
    pages.push({
      url: `/mejores/peliculas/${year}`,
      priority: 0.8,
      changefreq: 'monthly',
    });
  }
}  

async function fetchPostsAndGenerateSitemap() {
  try {
    const { data } = await axios.get(`${process.env.STRAPI_URL}/reviews`, axiosConfig);


    const allPages = data.meta.pagination.pageCount

    let posts = []

    for (let i = 2; i <= allPages; i++) {
      const { data: { data: pagePosts } } = await axios.get(`${process.env.STRAPI_URL}/reviews?pagination[page]=${i}`, axiosConfig);
      posts = posts.concat(pagePosts)
    }

    for (const post of posts) {
      const slug = post.attributes.slug;
      pages.push({
        url: `/analisis/${slug}`,
        priority: 0.8,
        changefreq: 'daily',
      });
    }

    const sitemap = new SitemapStream({ hostname: 'https://topdelmes.com' });

    sitemap.pipe(createWriteStream('./dist/client/sitemap.xml'));

    for (const page of pages) {
      sitemap.write(page);
    }

    sitemap.end();
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

fetchPostsAndGenerateSitemap();
