import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const openWeather = axios.create({
  baseURL: "https://api.openweathermap.org",
  timeout: 10000,
  params: {
    appid: API_KEY,
    units: "metric",
  },
});

// All OpenWeather requests use axios (no fetch). Optional: centralize API key.
openWeather.interceptors.request.use((config) => {
  if (!config.params) config.params = {};
  if (!config.params.appid) config.params.appid = API_KEY;
  return config;
});

openWeather.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);

export async function getCurrentByCoords(latitude, longitude) {
  const { data } = await openWeather.get("/data/2.5/weather", {
    params: { lat: latitude, lon: longitude },
  });
  return data;
}

export async function getCurrentByCity(city) {
  const { data } = await openWeather.get("/data/2.5/weather", {
    params: { q: city },
  });
  return data;
}

export async function getCitySuggestions(query, limit = 5) {
  const { data } = await openWeather.get("/geo/1.0/direct", {
    params: { q: query, limit },
  });
  return data;
}

/** 5-day forecast, 3-hour steps. Use lat/lon or city. */
export async function getForecastByCoords(latitude, longitude) {
  const { data } = await openWeather.get("/data/2.5/forecast", {
    params: { lat: latitude, lon: longitude },
  });
  return data;
}

export async function getForecastByCity(city) {
  const { data } = await openWeather.get("/data/2.5/forecast", {
    params: { q: city },
  });
  return data;
}
