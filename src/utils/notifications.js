export function requestNotificationPermission() {
  if (!("Notification" in window)) return Promise.resolve("denied");
  return Notification.requestPermission();
}

export function triggerWeatherNotification(data, icon) {
  if (
    !data ||
    !("Notification" in window) ||
    Notification.permission !== "granted"
  )
    return;

  let message = "";
  const description = data.weather?.[0]?.description || "";
  const temp = data.main?.temp;

  if (description.includes("storm") || description.includes("thunderstorm")) {
    message = "Storms are expected!";
  } else if (description.includes("rain") || description.includes("drizzle")) {
    message = "It's going to rain, don't forget your umbrella!";
  } else if (description.includes("snow")) {
    message = "Be careful! It's snowing outside!";
  } else if (typeof temp === "number" && temp <= 0) {
    message = "Freezing temperatures expected. Dress warmly!";
  } else if (typeof temp === "number" && temp >= 35) {
    message = "It's really hot outside. Stay hydrated!";
  }

  if (!message) return;

  new Notification("Weather", {
    body: message,
    icon: icon ? `http://openweathermap.org/img/wn/${icon}.png` : undefined,
  });
}
