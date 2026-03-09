import { useState } from "react";
import PropTypes from "prop-types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FastWindIcon,
  DropletIcon,
  WindPower01Icon,
  Sun01Icon,
  SunCloud01Icon,
} from "@hugeicons/core-free-icons";

function formatTime(unix) {
  if (unix == null) return "—";
  const d = new Date(unix * 1000);
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${ampm}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function formatCurrentTime() {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${ampm}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export default function ForecastPanel({ weatherInfo, forecastByDay }) {
  if (!weatherInfo) return null;

  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const sunriseStr = formatTime(weatherInfo.sunrise);
  const sunsetStr = formatTime(weatherInfo.sunset);
  const allDays = (forecastByDay || []);
  const nextDays = allDays.slice(1, 7);
  const windStr = weatherInfo.windDirection
    ? `${weatherInfo.windDirection}, ${weatherInfo.wind ?? "—"} km/h`
    : `${weatherInfo.wind ?? "—"} km/h`;

  return (
    <div className="forecast-panel animate-in">
      <div className="forecast-panel-header">
        <div className="forecast-tabs">
          <button type="button" className="tab-btn active">Today</button>
          <button type="button" className="tab-btn">Tomorrow</button>
          <button type="button" className="tab-btn">Next 7 days</button>
        </div>
        <div className="forecast-pills">
          <button type="button" className="pill-btn active">Forecast</button>
          <button type="button" className="pill-btn">Air quality</button>
        </div>
      </div>

      <div className="forecast-timeline-h">
        <div className="day-card highlighted animate-card">
          <div className="card-top">
            <div>
              <span className="day-label">{todayName}</span>
              <span className="day-time">{formatCurrentTime()}</span>
            </div>
            <div className="weather-icon-large">
              <img
                src={`https://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`}
                alt=""
                width={64}
                height={64}
              />
            </div>
            <div className="temp-large">{Math.round(weatherInfo.temperature)}°</div>
          </div>

          <div className="card-metrics card-metrics-today">
            <div className="metric">
              <span>Real Feel {Math.round(weatherInfo.feelsLike ?? weatherInfo.temperature)}°</span>
            </div>
            <div className="metric">
              <HugeiconsIcon icon={FastWindIcon} size={16} />
              <span>Wind: {windStr}</span>
            </div>
            <div className="metric">
              <HugeiconsIcon icon={WindPower01Icon} size={16} />
              <span>Pressure: {weatherInfo.pressure} MB</span>
            </div>
            <div className="metric">
              <HugeiconsIcon icon={DropletIcon} size={16} />
              <span>Humidity: {weatherInfo.humidity}%</span>
            </div>
            <div className="metric">
              <HugeiconsIcon icon={Sun01Icon} size={16} />
              <span>Sunrise: {sunriseStr}</span>
            </div>
            <div className="metric">
              <HugeiconsIcon icon={SunCloud01Icon} size={16} />
              <span>Sunset: {sunsetStr}</span>
            </div>
          </div>
        </div>

        <div className="remaining-days-h">
          {nextDays.map((day, i) => (
            <div key={day.dayName + i} className="day-card narrow animate-card" style={{ animationDelay: `${i * 0.05}s` }}>
              <span className="day-label">{day.dayName}</span>
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt=""
                className="weather-icon-small-img"
                width={40}
                height={40}
              />
              <span className="temp-small">{Math.round(day.temp)}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

ForecastPanel.propTypes = {
  weatherInfo: PropTypes.shape({
    temperature: PropTypes.number,
    feelsLike: PropTypes.number,
    wind: PropTypes.number,
    windDirection: PropTypes.string,
    pressure: PropTypes.number,
    humidity: PropTypes.number,
    icon: PropTypes.string,
    sunrise: PropTypes.number,
    sunset: PropTypes.number,
  }),
  forecastByDay: PropTypes.arrayOf(
    PropTypes.shape({
      dayName: PropTypes.string,
      temp: PropTypes.number,
      icon: PropTypes.string,
    })
  ),
};
