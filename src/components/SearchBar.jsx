import { useRef } from "react";
import PropTypes from "prop-types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

export default function SearchBar({ value, onChange, onSubmit, onSelectSuggestion, suggestions, showSuggestions }) {
  const suggestionsRef = useRef(null);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") onSubmit();
  };

  return (
    <div className="search-bar-wrapper">
      <div className="search-input-container">
        <HugeiconsIcon icon={Search01Icon} size={20} className="search-icon" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Search city..."
        />
      </div>

      {showSuggestions && suggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} className="suggestions-dropdown">
          {suggestions.map((s, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => onSelectSuggestion(s.name)}
            >
              {s.name}{s.state ? `, ${s.state}` : ""}, {s.country}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onSelectSuggestion: PropTypes.func.isRequired,
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      state: PropTypes.string,
      country: PropTypes.string.isRequired,
    })
  ),
  showSuggestions: PropTypes.bool.isRequired,
};
