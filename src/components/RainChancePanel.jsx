import PropTypes from "prop-types";

const FALLBACK_RAIN = [
  { time: "—", chance: 0 },
  { time: "—", chance: 0 },
  { time: "—", chance: 0 },
  { time: "—", chance: 0 },
  { time: "—", chance: 0 },
  { time: "—", chance: 0 },
];

export default function RainChancePanel({ hourlyRain }) {
  const rainData = hourlyRain?.length ? hourlyRain : FALLBACK_RAIN;

  return (
    <>
    <div className="rain-chance-panel-header">
      <h3 className="panel-title">Chance of rain</h3>
    </div>
    <div className="rain-chance-panel animate-in">
      <div className="rain-chart-wrap">
        <div className="rain-y-labels">
          <span>Rainy</span>
          <span>Sunny</span>
          <span>Heavy</span>
        </div>
        <div className="rain-graph">
          {rainData.map((data, index) => (
            <div key={`${data.time}-${index}`} className="bar-wrapper animate-bar" style={{ animationDelay: `${index * 0.06}s` }}>
              <div className="bar-container">
                <div
                  className={`bar-fill ${data.chance > 50 ? "high" : ""}`}
                  style={{ height: `${Math.min(100, data.chance)}%` }}
                />
              </div>
              <span className="bar-label">{data.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}

RainChancePanel.propTypes = {
  hourlyRain: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string,
      chance: PropTypes.number,
    })
  ),
};
