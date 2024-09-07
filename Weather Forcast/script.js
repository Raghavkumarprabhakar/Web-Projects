const apiKey = "98c0f0d20a0c430ca9d3ae66c71cd5cc";
const apiUrl = "https://api.openweathermap.org/data/2.5/";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function fetchWeatherData(city) {
  const currentWeatherResponse = await fetch(`${apiUrl}weather?units=metric&q=${city}&appid=${apiKey}`);
  const forecastResponse = await fetch(`${apiUrl}forecast?units=metric&q=${city}&appid=${apiKey}`);
  return {
    current: await currentWeatherResponse.json(),
    forecast: await forecastResponse.json()
  };
}

function displayCurrentWeather(data) {
  document.querySelector(".temp").innerHTML = `${Math.round(data.main.temp)}°C`;
  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".humidity").innerHTML = `${data.main.humidity}%`;
  document.querySelector(".wind").innerHTML = `${Math.round(data.wind.speed)} km/h`;

  switch (data.weather[0].main) {
    case "Clouds":
      weatherIcon.src = "images/clouds.png";
      break;
    case "Clear":
      weatherIcon.src = "images/clear.png";
      break;
    case "Rain":
      weatherIcon.src = "images/rain.png";
      break;
    case "Drizzle":
      weatherIcon.src = "images/drizzle.png";
      break;
    case "Mist":
      weatherIcon.src = "images/mist.png";
      break;
    default:
      weatherIcon.src = "images/clear.png";
  }
}

function displayForecast(data) {
  const hourlyContainer = document.querySelector(".hourly-forecast");
  const weeklyContainer = document.querySelector(".weekly-forecast");
  
  hourlyContainer.innerHTML = "";
  weeklyContainer.innerHTML = "";

  const hourlyData = data.list.slice(0, 8); // Next 8 hours (3-hour intervals)
  const dailyData = data.list.filter((item, index) => index % 8 === 0).slice(0, 7); // Next 7 days (24-hour intervals)

  hourlyData.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${new Date(item.dt * 1000).getHours()}:00</p>
      <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}" />
      <p>${Math.round(item.main.temp)}°C</p>
    `;
    hourlyContainer.appendChild(div);
  });

  dailyData.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${new Date(item.dt * 1000).toLocaleDateString()}</p>
      <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}" />
      <p>${Math.round(item.main.temp)}°C</p>
    `;
    weeklyContainer.appendChild(div);
  });
}

async function checkWeather(city) {
  try {
    const data = await fetchWeatherData(city);
    if (data.current.cod === "404" || data.forecast.cod === "404") {
      alert("Wrong city name!!!");
      searchBox.value = "";
    } else {
      displayCurrentWeather(data.current);
      displayForecast(data.forecast);
      searchBox.value = "";
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

searchBox.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    checkWeather(searchBox.value);
  }
});
