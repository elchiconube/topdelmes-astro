import { writeFile } from 'fs';
import axios from 'axios';
import 'dotenv/config';

const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
  },
};

function getDateTime48HoursAgo() {
  const now = new Date();
  const hours48Ago = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  return hours48Ago.toISOString();
}  

async function fetchAllReviews() {

  const hours48Ago = getDateTime48HoursAgo();
  
  try {
    const { data: { data: reviews } } = await axios.get(`${process.env.STRAPI_URL}/reviews?sort=createdAt:desc&filters[publishedAt][$gte]=${hours48Ago}`, axiosConfig);
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

function escapeXML(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
}

function generateSitemapXML(reviews) {
  let xmlSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;

  reviews.forEach(review => {
    const { attributes } = review;
    const loc = `https://topdelmes.com/analisis/${attributes.slug}`;
    const publicationDate = new Date(attributes.publishedAt).toISOString().split('T')[0];
    xmlSitemap += `
  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>TopDelMes</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${publicationDate}</news:publication_date>
      <news:title>${escapeXML(attributes.title)}</news:title>
    </news:news>
  </url>`;
  });

  xmlSitemap += `
</urlset>`;

  return xmlSitemap;
}

async function generateAndSaveSitemap() {
  const reviews = await fetchAllReviews();
  const sitemapXML = generateSitemapXML(reviews);
  writeFile('./dist/client/sitemap-news.xml', sitemapXML, (err) => {
    if (err) {
      console.error('Error writing sitemap file:', err);
    } else {
      console.log('Sitemap News generated successfully.');
    }
  });
}

generateAndSaveSitemap();
