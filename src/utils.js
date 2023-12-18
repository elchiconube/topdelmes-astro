import { remark } from "remark";
import html from "remark-html";

export const axiosConfig = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.STRAPI_API_TOKEN}`,
  },
};

const MONTH_NAMES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export const getFullYear = () => new Date().getFullYear();

export const getCurrentMonthName = () => {
    return MONTH_NAMES[new Date().getMonth()];
}

export const getCurrentYear = () => {
  const date = new Date();
  const year = date.getFullYear();
  return year;
};

export const getCurrentMonth = () => {
  const date = new Date();
  const month = date.getMonth();
  return month + 1;
};

export const markdownToHtml = (markdownString) => {
  const result = remark().use(html).processSync(markdownString);
  return result.toString();
};

export const getMonthName = (month) => {
  const year = new Date().getFullYear();
  const date = new Date(year, month);
  const monthName = new Intl.DateTimeFormat("es-ES", { month: "long" }).format(
    date
  );
  return monthName;
};

export const updatePosterUrl = (url) => {
  const pattern = /_V1_.*\.jpg/;
  const newSuffix = "_V1_SY1000_CR0,0,674,1000_AL_.jpg";
  const newUrl = url.replace(pattern, newSuffix);
  return newUrl;
};

export const getToday = (date) => {
  const opts = { day: "numeric", month: "long", year: "numeric" };
  const today = date ? new Date(date) : new Date();
  const format = new Intl.DateTimeFormat("es-ES", opts);

  return format.format(today);
};

export const getPrevNextYearMonth = (yearStr, monthStr, type) => {
  const year = parseInt(yearStr, 10);
  const month = getMonthNumber(monthStr);
  const isMovies = type === "movies";
  const isSeries = type === "series";
  const prevYear = month === 1 && isMovies ? year - 1 : year;
  const nextYear = month === 12 && isSeries ? year + 1 : year;
  const prevMonth = month === 1 ? 12 : month - 1;
  const nextMonth = month === 12 ? 1 : month + 1;
  const prevMonthDate = new Date(prevYear, prevMonth - 1, 1);
  const nextMonthDate = new Date(nextYear, nextMonth - 1, 1);
  const now = new Date();

  const prev =
    prevMonthDate.getFullYear() >= (isMovies ? 1920 : 1990)
      ? {
          year: prevMonthDate.getFullYear(),
          month: MONTH_NAMES[prevMonthDate.getMonth()],
        }
      : null;

  const next =
    nextMonthDate <= now
      ? {
          year: nextMonthDate.getFullYear(),
          month: MONTH_NAMES[nextMonthDate.getMonth()],
        }
      : null;

  return { prev, next };
};

export const limitDescription = (str) => {
  if (!str) return "";
  if (str.length > 150) {
    return str.slice(0, 150) + "...";
  } else {
    return str;
  }
};

export const limitBreadcrumb = (str) => {
  if (!str) return "";
  if (str.length > 23) {
    return str.slice(0, 23) + "...";
  } else {
    return str;
  }
};

export const getAdjacentYears = (yearStr, type) => {
  const year = parseInt(yearStr, 10);
  if (isNaN(year)) {
    throw new Error("El año proporcionado no es válido.");
  }

  const minYear = type === "series" ? 1990 : 1920;

  const prevYear = year - 1 >= minYear ? year - 1 : null;
  const nextYear = year + 1;

  return {
    prev: prevYear,
    next: nextYear,
  };
};

export const formatVotes = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num;
  }
};

export const isValidYear = (year, type) => {
  const firstYear = type === "movies" ? 1920 : 1990;
  const currentYear = new Date().getFullYear();
  const parsedYear = parseInt(year);
  return parsedYear >= firstYear && parsedYear <= currentYear;
};

export const validateYearAndMonth = (year, month, type) =>
  isValidYear(year, type) && getMonthNumber(month) !== undefined;

export const getMonthNumber = (month) => {
  const months = {
    enero: 1,
    febrero: 2,
    marzo: 3,
    abril: 4,
    mayo: 5,
    junio: 6,
    julio: 7,
    agosto: 8,
    septiembre: 9,
    octubre: 10,
    noviembre: 11,
    diciembre: 12,
  };

  const lowercaseMonth = month.toLowerCase();
  const monthNumber = months[lowercaseMonth];

  return monthNumber;
};

const generateUrls = (prefix, actualMonth, actualYear, months) => {
  return Array.from({ length: 6 }, (_, i) => {
    const index = (actualMonth - i + 12) % 12;
    const year = actualMonth - i < 0 ? actualYear - 1 : actualYear;
    return {
      url: `/mejores/${prefix}/${year}/${months[index]}`,
      month: months[index],
      year: year,
    };
  });
};

export const getPreviousMonths = () => {
  const actualDate = new Date();
  const actualMonth = actualDate.getMonth();
  const actualYear = actualDate.getFullYear();
  const previousMonth = actualMonth === 0 ? 11 : actualMonth - 1;
  const previousYear = actualMonth === 0 ? actualYear - 1 : actualYear;

  const movies = generateUrls(
    "peliculas",
    previousMonth,
    previousYear,
    MONTH_NAMES
  );
  const series = generateUrls(
    "series",
    previousMonth,
    previousYear,
    MONTH_NAMES
  );

  return { movies, series };
};

export const getPreviousYears = () => {
  const currentYear = new Date().getFullYear();
  const types = ["series", "peliculas"];

  const previousYears = types.reduce((result, type) => {
    result[type] = Array.from({ length: 10 }, (_, i) => {
      const year = currentYear - i - 1;
      return {
        url: `/mejores/${type}/${year}`,
        year: year,
      };
    });
    return result;
  }, {});


  return previousYears;
};

export const isCurrentMonthAndYear = (year, month) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = currentDate
    .toLocaleString("es-ES", { month: "long" })
    .toLowerCase();

  return year === currentYear && month.toLowerCase() === currentMonth;
};

export const postFormatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: "long", day: "numeric", year: "numeric" };
  const formattedDate = date.toLocaleDateString("es-ES", options);
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

export const isCurrentYear = (yearStr) => {
  const year = parseInt(yearStr, 10);
  if (isNaN(year)) {
    throw new Error("El año proporcionado no es válido.");
  }

  const currentYear = new Date().getFullYear();
  return year === currentYear;
};

export const sortByField = (field, array, ascending = true) => {
  return array.sort((a, b) => {
    const valueA = a.attributes[field];
    const valueB = b.attributes[field];

    if (field === "updatedAt" || field === "publishedAt") {
      const dateA = new Date(valueA);
      const dateB = new Date(valueB);

      return ascending ? dateA - dateB : dateB - dateA;
    } else {
      return ascending
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
  });
};


export const getRandomYearMonth = () => {

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const startYear = 1990;

  const year =
    Math.floor(Math.random() * (currentYear - startYear + 1)) + startYear;
  let month = MONTH_NAMES[Math.floor(Math.random() * MONTH_NAMES.length)];
  if (year === currentYear) {
    month = months.slice(0, currentMonth)[
      Math.floor(Math.random() * (currentMonth + 1))
    ];
  }

  return { year, month };
}