import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCurrentByCoords,
  getCurrentByCity,
  getCitySuggestions,
  getForecastByCoords,
  getForecastByCity,
} from "../services/weatherApi";
import { determineVideoSourceByData } from "../utils/videoForWeather";
import { triggerWeatherNotification } from "../utils/notifications";
import { getCountryName, windDegToDirection } from "../utils/countryNames";

export function useWeather() {
  const [coords, setCoords] = useState({ lat: null, lon: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [videoSource, setVideoSource] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const [result] = await Promise.all([
        getCurrentByCoords(lat, lon),
        getForecastByCoords(lat, lon).then((d) => (setForecastData(d), d)).catch(() => null),
      ]);
      setData(result);
      setVideoSource(determineVideoSourceByData(result));
      triggerWeatherNotification(result, result?.weather?.[0]?.icon);
    } catch (e) {
      setError("Failed to fetch weather by coordinates");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByCity = useCallback(async (city) => {
    if (!city) return;
    setLoading(true);
    setError(null);
    try {
      const [result] = await Promise.all([
        getCurrentByCity(city),
        getForecastByCity(city).then((d) => (setForecastData(d), d)).catch(() => null),
      ]);
      setData(result);
      setVideoSource(determineVideoSourceByData(result));
      triggerWeatherNotification(result, result?.weather?.[0]?.icon);
    } catch (e) {
      setError("Failed to fetch weather by city");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (cityQuery.length < 3) {
      setSuggestions([]);
      return () => {};
    }
    const timeout = setTimeout(async () => {
      try {
        const results = await getCitySuggestions(cityQuery, 5);
        setSuggestions(results || []);
      } catch (e) {
        console.error("suggestions error", e);
      }
    }, 300);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [cityQuery]);

  const weatherInfo = useMemo(() => {
    if (!data) return null;
    const currentTime = data.dt;
    const sunriseTime = data.sys?.sunrise;
    const sunsetTime = data.sys?.sunset;
    const timeOfDay =
      currentTime &&
      sunriseTime &&
      sunsetTime &&
      currentTime >= sunriseTime &&
      currentTime <= sunsetTime
        ? "day"
        : "night";
    const windKmh = data.wind?.speed != null ? Math.round(data.wind.speed * 3.6) : null;
    const windDir = windDegToDirection(data.wind?.deg);
    const countryCode = data.sys?.country;
    return {
      temperature: data.main?.temp,
      feelsLike: data.main?.feels_like,
      pressure: data.main?.pressure,
      description: data.weather?.[0]?.description,
      humidity: data.main?.humidity,
      wind: windKmh,
      windDirection: windDir,
      cityName: data.name,
      countryCode,
      countryName: getCountryName(countryCode) || countryCode,
      icon: data.weather?.[0]?.icon,
      clouds: data.clouds?.all,
      timeOfDay,
      sunrise: sunriseTime,
      sunset: sunsetTime,
    };
  }, [data]);

  const forecastByDay = useMemo(() => {
    if (!forecastData?.list?.length) return [];
    const dayMap = new Map();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    forecastData.list.forEach((item) => {
      const d = new Date(item.dt * 1000);
      const key = d.toDateString();
      if (!dayMap.has(key)) {
        dayMap.set(key, {
          dayName: dayNames[d.getDay()],
          date: key,
          temps: [],
          icons: [],
          pop: [],
        });
      }
      const entry = dayMap.get(key);
      entry.temps.push(item.main?.temp);
      if (item.weather?.[0]) entry.icons.push(item.weather[0].icon);
      if (item.pop != null) entry.pop.push(item.pop);
    });
    return Array.from(dayMap.values()).map((entry) => ({
      dayName: entry.dayName,
      tempMax: Math.max(...entry.temps),
      tempMin: Math.min(...entry.temps),
      temp: Math.round(entry.temps.reduce((a, b) => a + b, 0) / entry.temps.length),
      icon: entry.icons[Math.floor(entry.icons.length / 2)] || entry.icons[0],
      popMax: Math.max(...(entry.pop || [0])),
    }));
  }, [forecastData]);

  const hourlyRain = useMemo(() => {
    if (!forecastData?.list?.length) return [];
    return forecastData.list.slice(0, 8).map((item) => {
      const d = new Date(item.dt * 1000);
      const hours = d.getHours();
      const ampm = hours === 0 ? "12AM" : hours < 12 ? `${hours}AM` : hours === 12 ? "12PM" : `${hours - 12}PM`;
      return {
        time: ampm,
        chance: Math.round((item.pop ?? 0) * 100),
      };
    });
  }, [forecastData]);

  return {
    coords,
    setCoords,
    error,
    loading,
    data,
    weatherInfo,
    forecastByDay,
    hourlyRain,
    videoSource,
    cityQuery,
    setCityQuery,
    suggestions,
    fetchByCoords,
    fetchByCity,
  };
}
