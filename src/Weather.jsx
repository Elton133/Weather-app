import { useState } from "react"
import { useEffect } from "react";
import sunny from './assets/sunny.mp4';
import rainy from './assets/rainynight.mp4';
import snowy from './assets/snow.mp4';
import sunnyClear from './assets/sunnyclear.mp4';
import cloud from './assets/cloud.mp4';
import rain from './assets/rain.mp4';
import fog from './assets/fog.mp4';

import './App.css';
export default function Weather(){
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [error, setError] = useState(null);
    const [weatherInfo, setWeatherInfo] = useState(null);
    const [videoSource, setVideoSource] = useState("");
    const [city, setCity] = useState("");

    useEffect(() => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude),
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    setError("Location access denied. Please enable location.");
                    console.log(error);
                }
            );
        }else{
            setError("Geolocation is not supported in this browser");
        }
    }, [])

    const fetchWeatherData = async(latitude, longitude, city) => {
        let APIURL;
        const APIKEY = "9c147fb22fee856e10e3555376b62810";

    if(longitude && latitude){
        APIURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKEY}&units=metric`;
    }
    else if(city){
        APIURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=metric`;
    }
    else{
        alert("Please provide either a geolocation or a city name");
        return;
    }
    try{
        const response = await fetch(APIURL);
        if(!response.ok) throw new Error("Failed to fetch");

        const data =  await response.json();

        const weatherInfo = {
            temperature: data.main.temp,
            description : data.weather[0].description,
            humidity: data.main.humidity,
            cityName: data.name,
            icon: data.weather[0].icon,
        };

        setWeatherInfo(weatherInfo);

    
        if (weatherInfo.temperature <= 0) {
            setVideoSource(snowy); 
        } else if (weatherInfo.temperature > 0 && weatherInfo.temperature <= 10) {
            setVideoSource(coldDay); 
        } else if (data.weather[0].description.includes("rain")) {
            setVideoSource(rainy); 
        } else if (data.weather[0].description.includes("drizzle")) {
            setVideoSource(rain); 
        } else if (weatherInfo.description.includes("thunderstorm")) {
            setVideoSource(thunderstorm); 
        } else if (weatherInfo.description === "clear sky") {
            setVideoSource(sunnyClear);
        } else if (weatherInfo.description.includes("cloud")) {
            if (weatherInfo.description === "few clouds") {
                setVideoSource(cloud); 
            } else if (weatherInfo.description === "scattered clouds" || weatherInfo.description === "broken clouds") {
                setVideoSource(sunny); 
            } else {
                setVideoSource(cloud); 
        } 
    }else if (data.weather[0].description.includes("fog") || data.weather[0].description.includes("mist")) {
            setVideoSource(fog); 
        } else if (data.weather[0].description.includes("haze")) {
            setVideoSource(hazy); 
        } else if (data.weather[0].description.includes("snow")) {
            setVideoSource(snowy);
            setVideoSource(sunny); 
        } else {
            setVideoSource(sunny); 
        }
    }
        
    catch(error){
        console.log(error);
    }
    };

    useEffect(()=>{
        if(latitude && longitude){
            fetchWeatherData(latitude, longitude);
        }
    }, [latitude, longitude])

    const handleSearch = () => {
fetchWeatherData(null, null, city);
    }
    return(
                <div className="weather-app">
                    <input type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)} 
                    placeholder="Enter city name"/>
                    <button onClick={handleSearch}>Search</button>
                    {videoSource && (<video src={videoSource} autoPlay loop muted playsInline>
                        <source src={videoSource} type="video/mp4" />
                        </video>)}
            {error ? (
                <p>{error}</p>
            ) : weatherInfo ? (
                <div className="weather-info">
                    <h2>Weather in {weatherInfo.cityName}</h2>
                    <p>Temperature: {weatherInfo.temperature}°C</p>
                    <p>Condition: {weatherInfo.description}</p>
                    <p>Humidity: {weatherInfo.humidity}%</p>
                    <img
                        src={`http://openweathermap.org/img/wn/${weatherInfo.icon}.png`}
                        alt="Weather icon"
                    />
                </div>
            ) : (
               <div className="loader"></div>
            )}
        </div>

    )
}