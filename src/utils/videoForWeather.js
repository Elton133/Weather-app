import sunny from "../assets/sunny.mp4";
import rainy from "../assets/rainynight.mp4";
import snowy from "../assets/snow.mp4";
import sunnyClear from "../assets/sunnyclear.mp4";
import cloud from "../assets/cloud.mp4";
import rain from "../assets/rainynight.mp4";
import fog from "../assets/fog.mp4";
import night2 from "../assets/night2.mp4";
import haze from "../assets/haze.mp4";

export function determineVideoSourceByData(data) {
  if (!data) return sunny;
  const description = data.weather?.[0]?.description || "";
  const temp = data.main?.temp ?? 20;
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

  let videoSrc;
  if (temp <= 0) {
    videoSrc = snowy;
  } else if (temp > 0 && temp <= 10) {
    videoSrc = cloud;
  } else if (description.includes("rain")) {
    videoSrc = rainy;
  } else if (description.includes("drizzle")) {
    videoSrc = rain;
  } else if (description.includes("thunderstorm")) {
    videoSrc = rainy;
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
}
