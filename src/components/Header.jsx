import { useState } from "react";
import PropTypes from "prop-types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menu01Icon,
  Notification01Icon,
  Location01Icon,
  Sun01Icon,
  Moon01Icon,
  UserIcon,
  SettingsIcon,
} from "@hugeicons/core-free-icons";
import SearchBar from "./SearchBar";

export default function Header({ searchProps, suggestionsRef, cityName, countryName }) {
  const [theme, setTheme] = useState("dark"); // 'light' | 'dark'
  const locationLabel = cityName && countryName
    ? `${cityName}, ${countryName}`
    : cityName || "Search for a city";

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button type="button" className="icon-btn" aria-label="Menu">
          <HugeiconsIcon icon={Menu01Icon} size={22} />
        </button>
        <button type="button" className="icon-btn" aria-label="Notifications">
          <HugeiconsIcon icon={Notification01Icon} size={22} />
        </button>
        <div className="location-indicator" title={locationLabel}>
          <HugeiconsIcon icon={Location01Icon} size={18} />
          <span>{locationLabel}</span>
        </div>
      </div>

      <div className="header-center" ref={suggestionsRef}>
        <SearchBar {...searchProps} />
      </div>

      <div className="header-right">
        <button type="button" className="icon-btn" aria-label="Settings">
          <HugeiconsIcon icon={SettingsIcon} size={22} />
        </button>
        <div className="theme-pill" role="group" aria-label="Theme">
          <span
            className="theme-pill-slider"
            style={{ transform: theme === "dark" ? "translateX(100%)" : "translateX(0)" }}
          />
          <button
            type="button"
            className={`theme-pill-option ${theme === "light" ? "active" : ""}`}
            onClick={() => setTheme("light")}
            aria-pressed={theme === "light"}
            aria-label="Light mode"
          >
            <HugeiconsIcon icon={Sun01Icon} size={18} />
          </button>
          <button
            type="button"
            className={`theme-pill-option ${theme === "dark" ? "active" : ""}`}
            onClick={() => setTheme("dark")}
            aria-pressed={theme === "dark"}
            aria-label="Dark mode"
          >
            <HugeiconsIcon icon={Moon01Icon} size={18} />
          </button>
        </div>
        <button type="button" className="avatar-btn" aria-label="Profile">
          <HugeiconsIcon icon={UserIcon} size={22} />
        </button>
      </div>
    </header>
  );
}

Header.propTypes = {
  searchProps: PropTypes.object.isRequired,
  suggestionsRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  cityName: PropTypes.string,
  countryName: PropTypes.string,
};
