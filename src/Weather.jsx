// import { useState } from "react";
// import { useEffect } from "react";
// import sunny from "./assets/sunny.mp4";
// import rainy from "./assets/rainynight.mp4";
// import snowy from "./assets/snow.mp4";
// import sunnyClear from "./assets/sunnyclear.mp4";
// import cloud from "./assets/cloud.mp4";
// import rain  from './assets/rainynight.mp4'
// import fog from "./assets/fog.mp4";
// import night2 from "./assets/night2.mp4";
// import haze from "./assets/haze.mp4";

// import "./App.css";
// export default function Weather() {
//   const [latitude, setLatitude] = useState(null);
//   const [longitude, setLongitude] = useState(null);
//   const [error, setError] = useState(null);
//   const [weatherInfo, setWeatherInfo] = useState(null);
//   const [videoSource, setVideoSource] = useState("");
//   const [city, setCity] = useState("");

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLatitude(position.coords.latitude),
//             setLongitude(position.coords.longitude);
//         },
//         (error) => {
//           setError("Location access denied. Please enable location.");
//           console.log(error);
//         }
//       );
//     } else {
//       setError("Geolocation is not supported in this browser");
//     }
//   }, []);

//   useEffect(() => {
//     if ("Notification" in window) {
//       Notification.requestPermission().then((permission) => {
//         if (permission === "granted") {
//           console.log("Notifications enabled.");
//         }
//       });
//     }
//   }, []);

//   const fetchWeatherData = async (latitude, longitude, city) => {
//     let APIURL;
//     const APIKEY = "9c147fb22fee856e10e3555376b62810";

//     if (longitude && latitude) {
//       APIURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKEY}&units=metric`;
//     } else if (city) {
//       APIURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=metric`;
//     } else {
//       alert("Please provide either a geolocation or a city name");
//       return;
//     }
//     try {
//       const response = await fetch(APIURL);
//       if (!response.ok) throw new Error("Failed to fetch");

//       const data = await response.json();

//       const currentTime = data.dt;
//       const sunriseTime = data.sys.sunrise;
//       const sunsetTime = data.sys.sunset;

//       const timeOfDay =
//         currentTime >= sunriseTime && currentTime <= sunsetTime
//           ? "day"
//           : "night";
//       const weatherInfo = {
//         temperature: data.main.temp,
//         pressure: data.main.pressure,
//         description: data.weather[0].description,
//         humidity: data.main.humidity,
//         wind: data.wind.speed,
//         cityName: data.name,
//         icon: data.weather[0].icon,
//         clouds: data.clouds.all,
//         timeOfDay: timeOfDay,
//       };

//       setWeatherInfo(weatherInfo);

//       if (weatherInfo.temperature <= 0) {
//         setVideoSource(snowy);
//       } else if (weatherInfo.temperature > 0 && weatherInfo.temperature <= 10) {
//         setVideoSource(coldDay);
//       } else if (data.weather[0].description.includes("rain")) {
//         setVideoSource(rainy);
//       } else if (data.weather[0].description.includes("drizzle")) {
//         setVideoSource(rain);
//       } else if (weatherInfo.description.includes("thunderstorm")) {
//         setVideoSource(thunderstorm);
//       } else if (weatherInfo.description === "clear sky") {
//         setVideoSource(sunnyClear);
//       } else if (weatherInfo.description.includes("cloud")) {
//         if (weatherInfo.description === "few clouds") {
//           setVideoSource(cloud);
//         } else if (
//           weatherInfo.description === "scattered clouds" ||
//           weatherInfo.description === "broken clouds"
//         ) {
//           setVideoSource(sunny);
//         } else {
//           setVideoSource(cloud);
//         }
//       } else if (
//         data.weather[0].description.includes("fog") ||
//         data.weather[0].description.includes("mist")
//       ) {
//         setVideoSource(fog);
//       } else if (data.weather[0].description.includes("haze")) {
//         setVideoSource(haze);
//       } else if (data.weather[0].description.includes("snow")) {
//         setVideoSource(snowy);
//         setVideoSource(sunny);
//       } else {
//         setVideoSource(sunny);
//       }

//       if (
//         (weatherInfo.description === "clear sky" && timeOfDay === "night") ||
//         (weatherInfo.description === "scattered clouds" &&
//           timeOfDay === "night") ||
//         (weatherInfo.description === "broken clouds" &&
//           timeOfDay === "night") ||
//         (weatherInfo.description === "few clouds" && timeOfDay === "night") ||
//         (weatherInfo.description === "overcast clouds" && timeOfDay === "night")
//       ) {
//         setVideoSource(night2);
//       }
//     } catch (error) {
//       console.log(error);
//     }

//     const triggerNotification = (message) => {
//       if ("Notification" in window && Notification.permission === "granted") {
//         new Notification("Weather", {
//           body: message,
//           icons: `http://openweathermap.org/img/wn/${weatherInfo.icon}.png`,
//         });
//       }
//     };

//     if (
//       data.weather[0].description.includes("storm") ||
//       data.weather[0].description.includes("thunderstorm")
//     ) {
//       triggerNotification("BStorms are expected!");
//     } else if (
//       data.weather[0].description.includes("rain") ||
//       data.weather[0].description.includes("drizzle")
//     ) {
//       triggerNotification("It's going to rain, don't forget your umbrella!");
//     } else if (data.weather[0].description.includes("snow")) {
//       triggerNotification("Be careful! It's snowing outside!");
//     } else if (weatherInfo.temperature <= 0) {
//       triggerNotification("Freezing temperatures expected. Dress warmly!");
//     } else if (weatherInfo.temperature >= 35) {
//       triggerNotification("It's really hot outside. Stay hydrated!");
//     }
//   };

//   useEffect(() => {
//     if (latitude && longitude) {
//       fetchWeatherData(latitude, longitude);
//     }
//   }, [latitude, longitude]);

//   const handleSearch = () => {
//     fetchWeatherData(null, null, city).then(() => {
//       triggerNotification(
//         `Weather in ${city}: ${weatherInfo.description}, ${weatherInfo.temperature}°C`
//       );
//     });
//   };
//   return (
//     <div className="weather-app">
//       <input
//         type="text"
//         value={city}
//         onChange={(e) => setCity(e.target.value)}
//         placeholder="Enter city name"
//       />
//       <button onClick={handleSearch}>Search</button>
//       {videoSource && (
//         <video src={videoSource} autoPlay loop muted playsInline>
//           <source src={videoSource} type="video/mp4" />
//         </video>
//       )}
//       {error ? (
//         <p>{error}</p>
//       ) : weatherInfo ? (
//         <div className="weather-info">
//           <h2>Weather in {weatherInfo.cityName}</h2>
//           <p>Temperature: {weatherInfo.temperature}°C</p>
//           <p>Pressure: {weatherInfo.pressure}hPa</p>
//           <p>Wind: {weatherInfo.wind}m/s</p>
//           <p>Condition: {weatherInfo.description}</p>
//           <p>Clouds : {weatherInfo.clouds}%</p>
//           <p>Humidity: {weatherInfo.humidity}%</p>
//           <img
//             src={`http://openweathermap.org/img/wn/${weatherInfo.icon}.png`}
//             alt="Weather icon"
//           />
//         </div>
//       ) : (
//         <div className="loader"></div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useRef } from "react";
// import sunny from "./assets/sunny.mp4";
// import rainy from "./assets/rainynight.mp4";
// import snowy from "./assets/snow.mp4";
// import sunnyClear from "./assets/sunnyclear.mp4";
// import cloud from "./assets/cloud.mp4";
// import rain from "./assets/rainynight.mp4";
// import fog from "./assets/fog.mp4";
// import night2 from "./assets/night2.mp4";
// import haze from "./assets/haze.mp4";
// // Add these imports if they're missing
// // import coldDay from "./assets/coldDay.mp4";
// // import thunderstorm from "./assets/thunderstorm.mp4";

// import "./App.css";

// export default function Weather() {
//   const [latitude, setLatitude] = useState(null);
//   const [longitude, setLongitude] = useState(null);
//   const [error, setError] = useState(null);
//   const [weatherInfo, setWeatherInfo] = useState(null);
//   const [videoSource, setVideoSource] = useState("");
//   const [city, setCity] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [regionCards, setRegionCards] = useState([]);
//   const [currentRegionIndex, setCurrentRegionIndex] = useState(0);
//   const suggestionsRef = useRef(null);

//   const APIKEY = "9c147fb22fee856e10e3555376b62810";

//   // Regions for rotating cards
//   const regions = [
//     { name: "London", continent: "Europe" },
//     { name: "Tokyo", continent: "Asia" },
//     { name: "New York", continent: "America" },
//   ];

//   // Get user's location
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLatitude(position.coords.latitude);
//           setLongitude(position.coords.longitude);
//         },
//         (error) => {
//           setError("Location access denied. Please enable location.");
//           console.log(error);
//         }
//       );
//     } else {
//       setError("Geolocation is not supported in this browser");
//     }
//   }, []);

//   // Request notification permissions
//   useEffect(() => {
//     if ("Notification" in window) {
//       Notification.requestPermission().then((permission) => {
//         if (permission === "granted") {
//           console.log("Notifications enabled.");
//         }
//       });
//     }
//   }, []);

//   // Close suggestions when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (
//         suggestionsRef.current &&
//         !suggestionsRef.current.contains(event.target)
//       ) {
//         setShowSuggestions(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Fetch city suggestions when typing
//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       if (city.length < 3) {
//         setSuggestions([]);
//         setShowSuggestions(false);
//         return;
//       }

//       try {
//         const response = await fetch(
//           `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIKEY}`
//         );

//         if (!response.ok) throw new Error("Failed to fetch suggestions");

//         const data = await response.json();
//         setSuggestions(data);
//         setShowSuggestions(data.length > 0);
//       } catch (error) {
//         console.error("Error fetching suggestions:", error);
//       }
//     };

//     const timer = setTimeout(() => {
//       fetchSuggestions();
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [city]);

//   // Fetch weather data for user location
//   useEffect(() => {
//     if (latitude && longitude) {
//       fetchWeatherData(latitude, longitude);
//     }
//   }, [latitude, longitude]);

//   // Fetch regional weather data
//   useEffect(() => {
//     const fetchRegionalWeather = async () => {
//       try {
//         const weatherPromises = regions.map((region) =>
//           fetch(
//             `https://api.openweathermap.org/data/2.5/weather?q=${region.name}&appid=${APIKEY}&units=metric`
//           )
//             .then((res) => res.json())
//             .then((data) => {
//               // Determine video source for each region
//               const videoSrc = determineVideoSource(data);
//               return {
//                 ...data,
//                 continent: region.continent,
//                 videoSource: videoSrc,
//               };
//             })
//         );

//         const results = await Promise.all(weatherPromises);
//         setRegionCards(results);
//       } catch (error) {
//         console.error("Error fetching regional weather:", error);
//       }
//     };

//     fetchRegionalWeather();

//     // Refresh regional data every 30 seconds
//     const intervalId = setInterval(fetchRegionalWeather, 30000);

//     return () => clearInterval(intervalId);
//   }, []);

//   // Determine video source based on weather data
//   const determineVideoSource = (data) => {
//     if (!data) return sunny; // Default

//     const currentTime = data.dt;
//     const sunriseTime = data.sys.sunrise;
//     const sunsetTime = data.sys.sunset;
//     const timeOfDay =
//       currentTime >= sunriseTime && currentTime <= sunsetTime ? "day" : "night";
//     const description = data.weather[0].description;
//     const temp = data.main.temp;

//     let videoSrc;

//     if (temp <= 0) {
//       videoSrc = snowy;
//     } else if (temp > 0 && temp <= 10) {
//       // videoSrc = coldDay; // Uncomment if you have this
//       videoSrc = cloud; // Fallback
//     } else if (description.includes("rain")) {
//       videoSrc = rainy;
//     } else if (description.includes("drizzle")) {
//       videoSrc = rain;
//     } else if (description.includes("thunderstorm")) {
//       // videoSrc = thunderstorm; // Uncomment if you have this
//       videoSrc = rainy; // Fallback
//     } else if (description === "clear sky") {
//       videoSrc = sunnyClear;
//     } else if (description.includes("cloud")) {
//       if (description === "few clouds") {
//         videoSrc = cloud;
//       } else if (
//         description === "scattered clouds" ||
//         description === "broken clouds"
//       ) {
//         videoSrc = sunny;
//       } else {
//         videoSrc = cloud;
//       }
//     } else if (description.includes("fog") || description.includes("mist")) {
//       videoSrc = fog;
//     } else if (description.includes("haze")) {
//       videoSrc = haze;
//     } else if (description.includes("snow")) {
//       videoSrc = snowy;
//     } else {
//       videoSrc = sunny;
//     }

//     // Override for night conditions
//     if (
//       (description === "clear sky" && timeOfDay === "night") ||
//       (description === "scattered clouds" && timeOfDay === "night") ||
//       (description === "broken clouds" && timeOfDay === "night") ||
//       (description === "few clouds" && timeOfDay === "night") ||
//       (description === "overcast clouds" && timeOfDay === "night")
//     ) {
//       videoSrc = night2;
//     }

//     return videoSrc;
//   };

//   const fetchWeatherData = async (latitude, longitude, city) => {
//     let APIURL;

//     if (longitude && latitude) {
//       APIURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKEY}&units=metric`;
//     } else if (city) {
//       APIURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=metric`;
//     } else {
//       alert("Please provide either a geolocation or a city name");
//       return;
//     }

//     try {
//       const response = await fetch(APIURL);
//       if (!response.ok) throw new Error("Failed to fetch");

//       const data = await response.json();

//       const currentTime = data.dt;
//       const sunriseTime = data.sys.sunrise;
//       const sunsetTime = data.sys.sunset;

//       const timeOfDay =
//         currentTime >= sunriseTime && currentTime <= sunsetTime
//           ? "day"
//           : "night";

//       const weatherInfo = {
//         temperature: data.main.temp,
//         pressure: data.main.pressure,
//         description: data.weather[0].description,
//         humidity: data.main.humidity,
//         wind: data.wind.speed,
//         cityName: data.name,
//         icon: data.weather[0].icon,
//         clouds: data.clouds.all,
//         timeOfDay: timeOfDay,
//       };

//       setWeatherInfo(weatherInfo);

//       if (weatherInfo.temperature <= 0) {
//         setVideoSource(snowy);
//       } else if (weatherInfo.temperature > 0 && weatherInfo.temperature <= 10) {
//         // setVideoSource(coldDay); // Uncomment if you have this
//         setVideoSource(cloud); // Fallback
//       } else if (data.weather[0].description.includes("rain")) {
//         setVideoSource(rainy);
//       } else if (data.weather[0].description.includes("drizzle")) {
//         setVideoSource(rain);
//       } else if (weatherInfo.description.includes("thunderstorm")) {
//         // setVideoSource(thunderstorm); // Uncomment if you have this
//         setVideoSource(rainy); // Fallback
//       } else if (weatherInfo.description === "clear sky") {
//         setVideoSource(sunnyClear);
//       } else if (weatherInfo.description.includes("cloud")) {
//         if (weatherInfo.description === "few clouds") {
//           setVideoSource(cloud);
//         } else if (
//           weatherInfo.description === "scattered clouds" ||
//           weatherInfo.description === "broken clouds"
//         ) {
//           setVideoSource(sunny);
//         } else {
//           setVideoSource(cloud);
//         }
//       } else if (
//         data.weather[0].description.includes("fog") ||
//         data.weather[0].description.includes("mist")
//       ) {
//         setVideoSource(fog);
//       } else if (data.weather[0].description.includes("haze")) {
//         setVideoSource(haze);
//       } else if (data.weather[0].description.includes("snow")) {
//         setVideoSource(snowy);
//       } else {
//         setVideoSource(sunny);
//       }

//       if (
//         (weatherInfo.description === "clear sky" && timeOfDay === "night") ||
//         (weatherInfo.description === "scattered clouds" &&
//           timeOfDay === "night") ||
//         (weatherInfo.description === "broken clouds" &&
//           timeOfDay === "night") ||
//         (weatherInfo.description === "few clouds" && timeOfDay === "night") ||
//         (weatherInfo.description === "overcast clouds" && timeOfDay === "night")
//       ) {
//         setVideoSource(night2);
//       }

//       triggerNotification(data, weatherInfo);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const triggerNotification = (data, weatherInfo) => {
//     if (
//       !data ||
//       !("Notification" in window) ||
//       Notification.permission !== "granted"
//     )
//       return;

//     let message = "";

//     if (
//       data.weather[0].description.includes("storm") ||
//       data.weather[0].description.includes("thunderstorm")
//     ) {
//       message = "Storms are expected!";
//     } else if (
//       data.weather[0].description.includes("rain") ||
//       data.weather[0].description.includes("drizzle")
//     ) {
//       message = "It's going to rain, don't forget your umbrella!";
//     } else if (data.weather[0].description.includes("snow")) {
//       message = "Be careful! It's snowing outside!";
//     } else if (data.main.temp <= 0) {
//       message = "Freezing temperatures expected. Dress warmly!";
//     } else if (data.main.temp >= 35) {
//       message = "It's really hot outside. Stay hydrated!";
//     }

//     if (message) {
//       new Notification("Weather", {
//         body: message,
//         icon: `http://openweathermap.org/img/wn/${weatherInfo.icon}.png`,
//       });
//     }
//   };

//   // Handle city selection from suggestions
//   const handleCitySelect = (cityName) => {
//     setCity(cityName);
//     setShowSuggestions(false);
//     fetchWeatherData(null, null, cityName);
//   };

//   // Handle search button click
//   const handleSearch = () => {
//     if (city.trim() === "") return;
//     setShowSuggestions(false);
//     fetchWeatherData(null, null, city);
//   };

//   // Handle Enter key press
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       if (city.trim() === "") return;
//       setShowSuggestions(false);
//       fetchWeatherData(null, null, city);
//     }
//   };

//   return (
//     <div className="weather-app">
//       {/* Search bar with suggestions */}
//       <div
//         className="search-container"
//         style={{ position: "relative", marginBottom: "15px" }}
//       >
//         <div style={{ display: "flex", gap: "10px" }}>
//           <input
//             type="text"
//             value={city}
//             onChange={(e) => setCity(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Enter city name"
//             style={{
//               flex: 1,
//               padding: "12px",
//               borderRadius: "8px",
//               border: "1px solid rgba(255, 255, 255, 0.2)",
//               backgroundColor: "rgba(255, 255, 255, 0.1)",
//               backdropFilter: "blur(10px)",
//               color: "white",
//             }}
//           />
//           <button
//             onClick={handleSearch}
//             style={{
//               padding: "12px 24px",
//               borderRadius: "8px",
//               border: "none",
//               backgroundColor: "rgba(255, 255, 255, 0.2)",
//               backdropFilter: "blur(10px)",
//               color: "white",
//               cursor: "pointer",
//             }}
//           >
//             Search
//           </button>
//         </div>

//         {/* City suggestions dropdown */}
//         {showSuggestions && (
//           <div
//             ref={suggestionsRef}
//             style={{
//               position: "absolute",
//               width: "100%",
//               backgroundColor: "rgba(255, 255, 255, 0.15)",
//               backdropFilter: "blur(10px)",
//               border: "1px solid rgba(255, 255, 255, 0.2)",
//               borderRadius: "8px",
//               marginTop: "5px",
//               zIndex: 10,
//               maxHeight: "200px",
//               overflowY: "auto",
//               boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
//             }}
//           >
//             {suggestions.map((suggestion, index) => (
//               <div
//                 key={index}
//                 style={{
//                   padding: "10px 15px",
//                   cursor: "pointer",
//                   borderBottom:
//                     index < suggestions.length - 1
//                       ? "1px solid rgba(255, 255, 255, 0.1)"
//                       : "none",
//                   color: "white",
//                 }}
//                 onClick={() => handleCitySelect(suggestion.name)}
//                 onMouseOver={(e) =>
//                   (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
//                 }
//                 onMouseOut={(e) =>
//                   (e.target.style.backgroundColor = "transparent")
//                 }
//               >
//                 {suggestion.name},{" "}
//                 {suggestion.state ? `${suggestion.state}, ` : ""}
//                 {suggestion.country}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Video background */}
//       {videoSource && (
//         <video
//           src={videoSource}
//           autoPlay
//           loop
//           muted
//           playsInline
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             zIndex: -1,
//           }}
//         >
//           <source src={videoSource} type="video/mp4" />
//         </video>
//       )}

//       {/* Main content */}
//       {error ? (
//         <p>{error}</p>
//       ) : weatherInfo ? (
//         <div className="weather-info">
//           <h2>Weather in {weatherInfo.cityName}</h2>
//           <p>Temperature: {weatherInfo.temperature}°C</p>
//           <p>Pressure: {weatherInfo.pressure}hPa</p>
//           <p>Wind: {weatherInfo.wind}m/s</p>
//           <p>Condition: {weatherInfo.description}</p>
//           <p>Clouds: {weatherInfo.clouds}%</p>
//           <p>Humidity: {weatherInfo.humidity}%</p>
//           <img
//             src={`http://openweathermap.org/img/wn/${weatherInfo.icon}.png`}
//             alt="Weather icon"
//           />
//         </div>
//       ) : (
//         <div className="loader"></div>
//       )}

//       {/* Regional weather cards */}
//       <div style={{ marginTop: "30px" }}>
//         <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
//           Weather Around the World
//         </h3>

//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: "20px",
//             justifyContent: "center",
//           }}
//         >
//           {regionCards.map((card, index) => (
//             <div
//               key={index}
//               className="region-card"
//               style={{
//                 width: "300px",
//                 height: "200px",
//                 position: "relative",
//                 overflow: "hidden",
//                 borderRadius: "10px",
//                 boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
//                 border: "1px solid rgba(255, 255, 255, 0.18)",
//               }}
//             >
//               {/* Card video background */}
//               <video
//                 src={card.videoSource}
//                 autoPlay
//                 loop
//                 muted
//                 playsInline
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                   zIndex: 0,
//                 }}
//               >
//                 <source src={card.videoSource} type="video/mp4" />
//               </video>

//               {/* Card content with glassmorphism */}
//               <div
//                 style={{
//                   position: "relative",
//                   zIndex: 1,
//                   height: "100%",
//                   padding: "15px",
//                   backgroundColor: "rgba(0, 0, 0, 0.3)",
//                   backdropFilter: "blur(5px)",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "flex-start",
//                   }}
//                 >
//                   <div>
//                     <h4
//                       style={{
//                         margin: "0 0 5px 0",
//                         fontSize: "18px",
//                         color: "white",
//                       }}
//                     >
//                       {card.name}
//                     </h4>
//                     <p
//                       style={{
//                         margin: "0",
//                         fontSize: "14px",
//                         color: "rgba(255, 255, 255, 0.7)",
//                       }}
//                     >
//                       {card.continent}
//                     </p>
//                   </div>
//                   <img
//                     src={`http://openweathermap.org/img/wn/${card.weather[0].icon}.png`}
//                     alt="Weather icon"
//                     style={{
//                       backgroundColor: "rgba(255, 255, 255, 0.2)",
//                       borderRadius: "50%",
//                     }}
//                   />
//                 </div>

//                 <div>
//                   <p
//                     style={{
//                       fontSize: "28px",
//                       margin: "0 0 5px 0",
//                       color: "white",
//                     }}
//                   >
//                     {Math.round(card.main.temp)}°C
//                   </p>
//                   <p
//                     style={{
//                       margin: "0",
//                       fontSize: "16px",
//                       color: "white",
//                       textTransform: "capitalize",
//                     }}
//                   >
//                     {card.weather[0].description}
//                   </p>

//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       marginTop: "15px",
//                       fontSize: "14px",
//                       color: "rgba(255, 255, 255, 0.8)",
//                     }}
//                   >
//                     <p style={{ margin: "0" }}>
//                       Humidity: {card.main.humidity}%
//                     </p>
//                     <p style={{ margin: "0" }}>Wind: {card.wind.speed} m/s</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect, useRef } from "react";
import sunny from "./assets/sunny.mp4";
import rainy from "./assets/rainynight.mp4";
import snowy from "./assets/snow.mp4";
import sunnyClear from "./assets/sunnyclear.mp4";
import cloud from "./assets/cloud.mp4";
import rain from "./assets/rainynight.mp4";
import fog from "./assets/fog.mp4";
import night2 from "./assets/night2.mp4";
import haze from "./assets/haze.mp4";
// Add these if you have them
// import coldDay from "./assets/coldDay.mp4";
// import thunderstorm from "./assets/thunderstorm.mp4";

import "./App.css";

export default function Weather() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [videoSource, setVideoSource] = useState("");
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [regionCards, setRegionCards] = useState([]);
  const suggestionsRef = useRef(null);

  const APIKEY = "9c147fb22fee856e10e3555376b62810";

  // Regions for sub cards
  const regions = [
    { name: "London", continent: "Europe" },
    { name: "Tokyo", continent: "Asia" },
    { name: "New York", continent: "America" },
  ];

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          setError("Location access denied. Please enable location.");
          console.log(error);
        }
      );
    } else {
      setError("Geolocation is not supported in this browser");
    }
  }, []);

  // Request notification permissions
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notifications enabled.");
        }
      });
    }
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch city suggestions when typing
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIKEY}`
        );

        if (!response.ok) throw new Error("Failed to fetch suggestions");

        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [city]);

  // Fetch weather data for user location
  useEffect(() => {
    if (latitude && longitude) {
      fetchWeatherData(latitude, longitude);
    }
  }, [latitude, longitude]);

  // Fetch regional weather data
  useEffect(() => {
    const fetchRegionalWeather = async () => {
      try {
        const weatherPromises = regions.map((region) =>
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${region.name}&appid=${APIKEY}&units=metric`
          )
            .then((res) => res.json())
            .then((data) => {
              // Determine video source for each region
              const videoSrc = determineVideoSource(data);
              return {
                ...data,
                continent: region.continent,
                videoSource: videoSrc,
              };
            })
        );

        const results = await Promise.all(weatherPromises);
        setRegionCards(results);
      } catch (error) {
        console.error("Error fetching regional weather:", error);
      }
    };

    fetchRegionalWeather();

    // Refresh regional data every 30 seconds
    const intervalId = setInterval(fetchRegionalWeather, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // Determine video source based on weather data
  const determineVideoSource = (data) => {
    if (!data) return sunny; // Default

    const currentTime = data.dt;
    const sunriseTime = data.sys.sunrise;
    const sunsetTime = data.sys.sunset;
    const timeOfDay =
      currentTime >= sunriseTime && currentTime <= sunsetTime ? "day" : "night";
    const description = data.weather[0].description;
    const temp = data.main.temp;

    let videoSrc;

    if (temp <= 0) {
      videoSrc = snowy;
    } else if (temp > 0 && temp <= 10) {
      // videoSrc = coldDay; // Uncomment if you have this
      videoSrc = cloud; // Fallback
    } else if (description.includes("rain")) {
      videoSrc = rainy;
    } else if (description.includes("drizzle")) {
      videoSrc = rain;
    } else if (description.includes("thunderstorm")) {
      // videoSrc = thunderstorm; // Uncomment if you have this
      videoSrc = rainy; // Fallback
    } else if (description === "clear sky") {
      videoSrc = sunnyClear;
    } else if (description.includes("cloud")) {
      if (description === "few clouds") {
        videoSrc = cloud;
      } else if (
        description === "scattered clouds" ||
        description === "broken clouds"
      ) {
        videoSrc = sunny;
      } else {
        videoSrc = cloud;
      }
    } else if (description.includes("fog") || description.includes("mist")) {
      videoSrc = fog;
    } else if (description.includes("haze")) {
      videoSrc = haze;
    } else if (description.includes("snow")) {
      videoSrc = snowy;
    } else {
      videoSrc = sunny;
    }

    // Override for night conditions
    if (
      (description === "clear sky" && timeOfDay === "night") ||
      (description === "scattered clouds" && timeOfDay === "night") ||
      (description === "broken clouds" && timeOfDay === "night") ||
      (description === "few clouds" && timeOfDay === "night") ||
      (description === "overcast clouds" && timeOfDay === "night")
    ) {
      videoSrc = night2;
    }

    return videoSrc;
  };

  const fetchWeatherData = async (latitude, longitude, city) => {
    let APIURL;

    if (longitude && latitude) {
      APIURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKEY}&units=metric`;
    } else if (city) {
      APIURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=metric`;
    } else {
      alert("Please provide either a geolocation or a city name");
      return;
    }

    try {
      const response = await fetch(APIURL);
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      const currentTime = data.dt;
      const sunriseTime = data.sys.sunrise;
      const sunsetTime = data.sys.sunset;

      const timeOfDay =
        currentTime >= sunriseTime && currentTime <= sunsetTime
          ? "day"
          : "night";

      const weatherInfo = {
        temperature: data.main.temp,
        pressure: data.main.pressure,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        cityName: data.name,
        icon: data.weather[0].icon,
        clouds: data.clouds.all,
        timeOfDay: timeOfDay,
      };

      setWeatherInfo(weatherInfo);

      if (weatherInfo.temperature <= 0) {
        setVideoSource(snowy);
      } else if (weatherInfo.temperature > 0 && weatherInfo.temperature <= 10) {
        // setVideoSource(coldDay); // Uncomment if you have this
        setVideoSource(cloud); // Fallback
      } else if (data.weather[0].description.includes("rain")) {
        setVideoSource(rainy);
      } else if (data.weather[0].description.includes("drizzle")) {
        setVideoSource(rain);
      } else if (weatherInfo.description.includes("thunderstorm")) {
        // setVideoSource(thunderstorm); // Uncomment if you have this
        setVideoSource(rainy); // Fallback
      } else if (weatherInfo.description === "clear sky") {
        setVideoSource(sunnyClear);
      } else if (weatherInfo.description.includes("cloud")) {
        if (weatherInfo.description === "few clouds") {
          setVideoSource(cloud);
        } else if (
          weatherInfo.description === "scattered clouds" ||
          weatherInfo.description === "broken clouds"
        ) {
          setVideoSource(sunny);
        } else {
          setVideoSource(cloud);
        }
      } else if (
        data.weather[0].description.includes("fog") ||
        data.weather[0].description.includes("mist")
      ) {
        setVideoSource(fog);
      } else if (data.weather[0].description.includes("haze")) {
        setVideoSource(haze);
      } else if (data.weather[0].description.includes("snow")) {
        setVideoSource(snowy);
      } else {
        setVideoSource(sunny);
      }

      if (
        (weatherInfo.description === "clear sky" && timeOfDay === "night") ||
        (weatherInfo.description === "scattered clouds" &&
          timeOfDay === "night") ||
        (weatherInfo.description === "broken clouds" &&
          timeOfDay === "night") ||
        (weatherInfo.description === "few clouds" && timeOfDay === "night") ||
        (weatherInfo.description === "overcast clouds" && timeOfDay === "night")
      ) {
        setVideoSource(night2);
      }

      triggerNotification(data, weatherInfo);
    } catch (error) {
      console.log(error);
    }
  };

  const triggerNotification = (data, weatherInfo) => {
    if (
      !data ||
      !("Notification" in window) ||
      Notification.permission !== "granted"
    )
      return;

    let message = "";

    if (
      data.weather[0].description.includes("storm") ||
      data.weather[0].description.includes("thunderstorm")
    ) {
      message = "Storms are expected!";
    } else if (
      data.weather[0].description.includes("rain") ||
      data.weather[0].description.includes("drizzle")
    ) {
      message = "It's going to rain, don't forget your umbrella!";
    } else if (data.weather[0].description.includes("snow")) {
      message = "Be careful! It's snowing outside!";
    } else if (data.main.temp <= 0) {
      message = "Freezing temperatures expected. Dress warmly!";
    } else if (data.main.temp >= 35) {
      message = "It's really hot outside. Stay hydrated!";
    }

    if (message) {
      new Notification("Weather", {
        body: message,
        icon: `http://openweathermap.org/img/wn/${weatherInfo.icon}.png`,
      });
    }
  };

  // Handle city selection from suggestions
  const handleCitySelect = (cityName) => {
    setCity(cityName);
    setShowSuggestions(false);
    fetchWeatherData(null, null, cityName);
  };

  // Handle search button click
  const handleSearch = () => {
    if (city.trim() === "") return;
    setShowSuggestions(false);
    fetchWeatherData(null, null, city);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (city.trim() === "") return;
      setShowSuggestions(false);
      fetchWeatherData(null, null, city);
    }
  };

  return (
    <div className="app-container">
      {/* Video background */}
      <div className="video-container">
        {videoSource && (
          <video src={videoSource} autoPlay loop muted playsInline>
            <source src={videoSource} type="video/mp4" />
          </video>
        )}
      </div>

      <div className="content-container">
        {/* Fixed header with search */}
        <div className="search-header">
          <div className="search-container">
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter city name"
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                }}
              />
              <button
                onClick={handleSearch}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Search
              </button>
            </div>

            {/* City suggestions dropdown */}
            {showSuggestions && (
              <div
                ref={suggestionsRef}
                style={{
                  position: "absolute",
                  width: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  marginTop: "5px",
                  zIndex: 10,
                  maxHeight: "200px",
                  overflowY: "auto",
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                }}
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "10px 15px",
                      cursor: "pointer",
                      borderBottom:
                        index < suggestions.length - 1
                          ? "1px solid rgba(255, 255, 255, 0.1)"
                          : "none",
                      color: "white",
                    }}
                    onClick={() => handleCitySelect(suggestion.name)}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor =
                        "rgba(255, 255, 255, 0.1)")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    {suggestion.name},{" "}
                    {suggestion.state ? `${suggestion.state}, ` : ""}
                    {suggestion.country}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="scrollable-content">
          {/* Main content */}
          {error ? (
            <p>{error}</p>
          ) : weatherInfo ? (
            <div className="weather-info">
              <h2>Weather in {weatherInfo.cityName}</h2>
              <p>Temperature: {weatherInfo.temperature}°C</p>
              <p>Pressure: {weatherInfo.pressure}hPa</p>
              <p>Wind: {weatherInfo.wind}m/s</p>
              <p>Condition: {weatherInfo.description}</p>
              <p>Clouds: {weatherInfo.clouds}%</p>
              <p>Humidity: {weatherInfo.humidity}%</p>
              <img
                src={`http://openweathermap.org/img/wn/${weatherInfo.icon}.png`}
                alt="Weather icon"
              />
            </div>
          ) : (
            <div className="loader"></div>
          )}

          {/* Regional weather cards */}
          <div className="region-cards-container">

            <div style={{ marginTop: "30px" }}>
              {" "}
              <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
                Weather Around the World
              </h3>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  justifyContent: "center",
                }}
              >
                {regionCards.map((card, index) => (
                  <div
                    key={index}
                    className="region-card"
                    style={{
                      width: "300px",
                      height: "200px",
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "10px",
                      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                    }}
                  >
                    {/* Card video background */}
                    <video
                      src={card.videoSource}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        zIndex: 0,
                      }}
                    >
                      <source src={card.videoSource} type="video/mp4" />
                    </video>

                    {/* Card content with glassmorphism */}
                    <div
                      style={{
                        position: "relative",
                        zIndex: 1,
                        height: "100%",
                        padding: "15px",
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        backdropFilter: "blur(5px)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div>
                          <h4
                            style={{
                              margin: "0 0 5px 0",
                              fontSize: "18px",
                              color: "white",
                            }}
                          >
                            {card.name}
                          </h4>
                          <p
                            style={{
                              margin: "0",
                              fontSize: "14px",
                              color: "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            {card.continent}
                          </p>
                        </div>
                        <img
                          src={`http://openweathermap.org/img/wn/${card.weather[0].icon}.png`}
                          alt="Weather icon"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            borderRadius: "50%",
                          }}
                        />
                      </div>

                      <div>
                        <p
                          style={{
                            fontSize: "28px",
                            margin: "0 0 5px 0",
                            color: "white",
                          }}
                        >
                          {Math.round(card.main.temp)}°C
                        </p>
                        <p
                          style={{
                            margin: "0",
                            fontSize: "16px",
                            color: "white",
                            textTransform: "capitalize",
                          }}
                        >
                          {card.weather[0].description}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "15px",
                            fontSize: "14px",
                            color: "rgba(255, 255, 255, 0.8)",
                          }}
                        >
                          <p style={{ margin: "0" }}>
                            Humidity: {card.main.humidity}%
                          </p>
                          <p style={{ margin: "0" }}>
                            Wind: {card.wind.speed} m/s
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
