import { getCurrentMonth, getCurrentYear, axiosConfig, getMonthNumber } from '../utils'
import axios from 'axios';

export async function getTopByMonth(type = "tv_series", year, month) {
  try {

    const monthNumber = getMonthNumber(month);

    const response = await axios.get(
      `${import.meta.env.STRAPI_URL}/tops?filters[year][$eq][0]=${year}&filters[month][$eq][1]=${monthNumber}&populate=*`,
      axiosConfig
    );

    const contents = response.data.data[0].attributes.contents.data;

    const data = contents.filter((i) => i.attributes.type === type);

    return { data, year, month };
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return { data: [], year, month };
  }
}

export async function getTopByYear(type = "tv_series", year) {

  try {

    const response = await axios.get(
      `${import.meta.env.STRAPI_URL}/tops?filters[$and][0][year][$eq]=${year}&filters[$and][1][month][$null]=null&populate=*`,
      axiosConfig
    );

    const contents = response.data.data[0]?.attributes?.contents?.data;

    const data = contents.filter((i) => i.attributes.type === type);

    return { data, year };
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return { data: [], year };
  }
}

export async function getAuthor(slug) {
  try {
    const response = await axios.get(
      `${import.meta.env.STRAPI_URL}/authors?filters[slug][$eq]=${slug}&populate=*`,
      axiosConfig
    );

    const author = response.data.data[0];

    return { author };
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return { author: null };
  }
}

export async function getAuthors() {
  try {
    const response = await axios.get(
      `${import.meta.env.STRAPI_URL}/authors?sort=createdAt:desc`,
      axiosConfig
    );

    const authors = response.data.data;

    return { authors };
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return { authors: [] };
  }
}

export async function getHomeData() {
  const month = getCurrentMonth();
  const year = getCurrentYear();

  const getTopByMonth = async (type, year, month) => {
    try {
      const monthNumber = getMonthNumber(month);
      const response = await axios.get(
        `${import.meta.env.STRAPI_URL}/tops?filters[$and][0][year][$eq]=${year}&filters[$and][1][month][$eq]=${monthNumber}&populate=*`,
        axiosConfig
      );

      const contents = response.data.data[0]?.attributes.contents.data || [];
      return contents.filter((i) => i.attributes.type === type);
    } catch (error) {
      console.error("Error al obtener los datos por mes:", error);
      return [];
    }
  };

  const getTopByYear = async (type, year) => {
    try {
      const response = await axios.get(
        `${import.meta.env.STRAPI_URL}/tops?filters[$and][0][year][$eq]=${year}&filters[$and][1][month][$null]=null&populate=*`,
        axiosConfig
      );

      const contents = response.data.data[0]?.attributes.contents.data || [];
      return contents.filter((i) => i.attributes.type === type);
    } catch (error) {
      console.error("Error al obtener los datos por año:", error);
      return [];
    }
  };

  const reviewsUrl = `${import.meta.env.STRAPI_URL}/reviews?sort=createdAt:desc&populate=*`;

  try {
    const [seriesYear, moviesYear, seriesMonth, moviesMonth, reviewsResponse] = await Promise.all([
      getTopByYear('tv_series', year),
      getTopByYear('movie', year),
      getTopByMonth('tv_series', year, month),
      getTopByMonth('movie', year, month),
      axios.get(reviewsUrl, axiosConfig)
    ]);

    const reviews = reviewsResponse.data.data.slice(0, 25);

    return {
      seriesYear, moviesYear, seriesMonth, moviesMonth, reviews,
    };
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return { seriesYear: [], moviesYear: [], seriesMonth: [], moviesMonth: [], reviews: [] };
  }
}

export async function getSeries() {
  const year = getCurrentYear();
  try {
    const response = await axios.get(
      `${import.meta.env.STRAPI_URL}/tops?filters[$and][0][year][$eq]=${year}&filters[$and][1][month][$null]=null&populate=*`,
      axiosConfig
    );

    const contents = response.data.data[0].attributes.contents.data;

    const series = contents.filter((i) => i.attributes.type === "tv_series");

    return { series };
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return { series: [] };
  }
}

export async function getMovies() {
  const year = getCurrentYear();

  try {
    const response = await axios.get(
      `${import.meta.env.STRAPI_URL}/tops?filters[$and][0][year][$eq]=${year}&filters[$and][1][month][$null]=null&populate=*`,
      axiosConfig
    );

    const contents = response.data.data[0].attributes.contents.data;

    const movies = contents.filter((i) => i.attributes.type === "movie");

    return { movies };
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return { movies: [] };
  }
}

export async function getReviews(page) {

  try {
    let url = `${import.meta.env.STRAPI_URL}/reviews?sort=createdAt:desc&populate[0]=author`;

    if (page) url += `&pagination[page]=${page}`;

    const response = await axios.get(url, axiosConfig);

    const reviews = response.data.data;
    const pagination = response.data.meta.pagination || null;

    return {
      reviews,
      pagination
    };
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return { reviews: [], pagination: null };
  }
}


export async function getReview(slug) {

  try {
    const response = await axios.get(
      `${import.meta.env.STRAPI_URL}/reviews?filters[slug][$eq]=${slug}&populate=*`,
      axiosConfig
    );

    const review = response.data.data[0];

    return { review };
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return { review: null };
  }
}