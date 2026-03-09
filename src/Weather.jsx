"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { useWeather } from "./hooks/useWeather";
import { determineVideoSourceByData } from "./utils/videoForWeather";
import RegionCards from "./components/RegionCards";
import Header from "./components/Header";
import ForecastPanel from "./components/ForecastPanel";
import RainChancePanel from "./components/RainChancePanel";
import GlobalMapPanel from "./components/GlobalMapPanel";
import { getCurrentByCity } from "./services/weatherApi";

export default function Weather() {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const bgVideoRef = useRef(null);

  const {
    setCoords,
    error,
    weatherInfo,
    forecastByDay,
    hourlyRain,
    videoSource,
    cityQuery,
    setCityQuery,
    suggestions,
    fetchByCoords,
    fetchByCity,
  } = useWeather();

  const regions = useMemo(() => [
    { name: "California", continent: "US" },
    { name: "Beijing", continent: "China" },
    { name: "Jerusalem", continent: "Israel" },
    { name: "London", continent: "UK" },
  ], []);

  const [regionCards, setRegionCards] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCoords({ lat, lon });
          fetchByCoords(lat, lon);
        },
        () => {
          // Default fetch if location denied
          fetchByCity("Seattle");
        }
      );
    }
  }, [fetchByCoords, setCoords, fetchByCity]);



  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchRegionalWeather = async () => {
      try {
        const weatherPromises = regions.map((region) =>
          getCurrentByCity(region.name).then((data) => ({
            ...data,
            continent: region.continent,
            videoSource: determineVideoSourceByData(data),
          }))
        );
        const results = await Promise.all(weatherPromises);
        setRegionCards(results);
      } catch (e) {
        console.error("Error fetching regional weather:", e);
      }
    };
    fetchRegionalWeather();
    const intervalId = setInterval(fetchRegionalWeather, 300000); // Reduce frequency
    return () => clearInterval(intervalId);
  }, [regions]);

  // Try to autoplay background video whenever the source changes
  useEffect(() => {
    if (!bgVideoRef.current) return;
    const video = bgVideoRef.current;
    const tryPlay = () => {
      const maybePromise = video.play();
      if (maybePromise && typeof maybePromise.catch === "function") {
        maybePromise.catch(() => {
          // Autoplay can be blocked on some devices; ignore error.
        });
      }
    };
    tryPlay();
  }, [videoSource]);

  // On first user interaction (click / touch), ensure video starts on mobile
  useEffect(() => {
    const handler = () => {
      if (bgVideoRef.current && bgVideoRef.current.paused) {
        const maybePromise = bgVideoRef.current.play();
        if (maybePromise && typeof maybePromise.catch === "function") {
          maybePromise.catch(() => {});
        }
      }
    };
    window.addEventListener("touchstart", handler, { once: true });
    window.addEventListener("click", handler, { once: true });
    return () => {
      window.removeEventListener("touchstart", handler);
      window.removeEventListener("click", handler);
    };
  }, []);

  const handleCitySelect = (cityName) => {
    setCityQuery(cityName);
    setShowSuggestions(false);
    fetchByCity(cityName);
  };

  const handleSearch = () => {
    if (!cityQuery.trim()) return;
    setShowSuggestions(false);
    fetchByCity(cityQuery);
  };

  if (!weatherInfo && !error) {
    return (
      <div className="loader-container">
        <span className="app-loader" aria-hidden="true"></span>
        <span className="loader-label">Loading weather…</span>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {videoSource && (
        <div className="video-container">
          <video
            ref={bgVideoRef}
            src={videoSource}
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={videoSource} type="video/mp4" />
          </video>
        </div>
      )}
      <div className="dashboard-content">
      <Header
        suggestionsRef={suggestionsRef}
        cityName={weatherInfo?.cityName}
        countryName={weatherInfo?.countryName}
        searchProps={{
          value: cityQuery,
          onChange: (v) => {
            setCityQuery(v);
            setShowSuggestions(v.length >= 3);
          },
          onSubmit: handleSearch,
          onSelectSuggestion: handleCitySelect,
          suggestions: suggestions,
          showSuggestions: showSuggestions,
        }}
      />

      <main className="main-content">
        {error && <div className="error-message" role="alert">{error}</div>}
        {weatherInfo && (
          <div className="dashboard-grid">
            <div className="grid-left">
              <ForecastPanel weatherInfo={weatherInfo} forecastByDay={forecastByDay} />
              <GlobalMapPanel regionCards={regionCards} activeCityName={weatherInfo.cityName} />
            </div>

            <div className="grid-right">
              <RainChancePanel hourlyRain={hourlyRain} />
              <div className="region-cards-container">
                <div className="section-title">
                  <span>Other large cities</span>
                </div>
                <RegionCards cards={regionCards} />
              </div>
            </div>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
