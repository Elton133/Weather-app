import PropTypes from "prop-types";

export default function RegionCards({ cards }) {
  if (!cards?.length) return null;
  return (
    <div className="other-cities-grid">
      {cards.map((card, index) => (
        <div key={index} className="city-card">
          <div className="city-info">
            <span className="city-country">{card.continent}</span>
            <span className="city-name">{card.name}</span>
            <span className="city-desc">{card.weather[0].description}</span>
          </div>

          <div className="city-weather">
            <img
              src={`http://openweathermap.org/img/wn/${card.weather[0].icon}@2x.png`}
              alt="Weather icon"
              className="city-icon"
            />
            <span className="city-temp">{Math.round(card.main.temp)}°</span>
          </div>
        </div>
      ))}
    </div>
  );
}

RegionCards.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      continent: PropTypes.string.isRequired,
      videoSource: PropTypes.string,
      weather: PropTypes.arrayOf(
        PropTypes.shape({ icon: PropTypes.string, description: PropTypes.string })
      ),
      main: PropTypes.shape({ temp: PropTypes.number, humidity: PropTypes.number }),
      wind: PropTypes.shape({ speed: PropTypes.number }),
    })
  ),
};
