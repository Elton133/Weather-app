import PropTypes from "prop-types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Refresh01Icon,
  AddIcon,
  MinusSignIcon,
  Location01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";

const NODE_POSITIONS = [
  { id: "na", class: "node-na" },
  { id: "eu", class: "node-eu" },
  { id: "as", class: "node-as" },
  { id: "au", class: "node-au" },
];

export default function GlobalMapPanel({ regionCards = [], activeCityName }) {
  const nodes = regionCards.slice(0, 4).map((card, i) => ({
    ...NODE_POSITIONS[i],
    name: card.name,
    country: card.sys?.country || card.continent,
    icon: card.weather?.[0]?.icon,
    temp: card.main?.temp,
    isActive: activeCityName && card.name === activeCityName,
  }));

  return (
    <div className="global-map-section animate-in">
      <div className="global-map-header">
        <h3 className="panel-title">Global map</h3>
        <button type="button" className="view-wide-btn">
          <HugeiconsIcon icon={SparklesIcon} size={16} />
          <span>View wide</span>
          <HugeiconsIcon icon={SparklesIcon} size={16} />
        </button>
      </div>
      <div className="global-map-panel">
        <div className="map-controls map-controls-left">
          <button type="button" className="map-control-btn" aria-label="Revert">
            <HugeiconsIcon icon={Refresh01Icon} size={20} />
          </button>
        </div>
        <div className="map-controls map-controls-right">
          <button type="button" className="map-control-btn" aria-label="Zoom in">
            <HugeiconsIcon icon={AddIcon} size={18} />
          </button>
          <button type="button" className="map-control-btn" aria-label="Zoom out">
            <HugeiconsIcon icon={MinusSignIcon} size={18} />
          </button>
          <button type="button" className="map-control-btn" aria-label="My location">
            <HugeiconsIcon icon={Location01Icon} size={18} />
          </button>
        </div>
        <div className="map-background">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`map-node ${node.class} ${node.isActive ? "active" : ""}`}
            >
              {node.isActive && (
                <div className="node-label">
                  {node.name}, {node.country}
                </div>
              )}
              {node.icon ? (
                <img
                  src={`https://openweathermap.org/img/wn/${node.icon}@2x.png`}
                  alt=""
                  width={node.isActive ? 32 : 24}
                  height={node.isActive ? 32 : 24}
                />
              ) : (
                <span className="node-temp">{node.temp != null ? Math.round(node.temp) + "°" : ""}</span>
              )}
            </div>
          ))}

          <div className="map-info-card">
            <p>Explore global map of wind, weather and oceans condition.</p>
            <button type="button" className="get-started-btn get-started-purple">Get started</button>
          </div>
        </div>
      </div>
    </div>
  );
}

GlobalMapPanel.propTypes = {
  regionCards: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      sys: PropTypes.shape({ country: PropTypes.string }),
      continent: PropTypes.string,
      weather: PropTypes.array,
      main: PropTypes.shape({ temp: PropTypes.number }),
    })
  ),
  activeCityName: PropTypes.string,
};
