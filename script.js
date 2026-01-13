// ====== CONFIG ======
const API_KEY = "437f7b79ca4134405042829192ec92ca"; // <- put your OpenWeatherMap API key here

// ====== DOM ELEMENTS ======
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");

const weatherCard = document.getElementById("weatherCard");
const cityName = document.getElementById("cityName");
const dateTime = document.getElementById("dateTime");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");

// ====== EVENT LISTENERS ======
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city === "") {
        showMessage("Please enter a city name.");
        return;
    }
    getWeather(city);
});

// Allow pressing Enter key to search
cityInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

// ====== FUNCTIONS ======

// Show error or info messages
function showMessage(msg, isError = true) {
    message.textContent = msg;
    message.style.color = isError ? "#b91c1c" : "#15803d"; // red or green
}

// Fetch weather data from API
async function getWeather(city) {
    // Clear previous message
    showMessage("");

    // API URL
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
    )}&appid=${API_KEY}&units=metric`;

    try {
        // Fetch data
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Please check the spelling.");
            } else {
                throw new Error("Failed to fetch weather. Try again later.");
            }
        }

        const data = await response.json();
        updateUI(data);
    } catch (error) {
        weatherCard.classList.add("hidden");
        showMessage(error.message, true);
        console.error(error);
    }
}

// Update UI with fetched data
function updateUI(data) {
    // Show card
    weatherCard.classList.remove("hidden");

    // City name and country
    cityName.textContent = `${data.name}, ${data.sys.country}`;

    // Date & Time (local browser time)
    const now = new Date();
    dateTime.textContent = now.toLocaleString();

    // Temperature, description
    const temp = Math.round(data.main.temp);
    const feels = Math.round(data.main.feels_like);
    const desc = data.weather[0].description;
    const iconCode = data.weather[0].icon; // e.g. "10d"

    temperature.textContent = `${temp}°C`;
    description.textContent = desc;
    feelsLike.textContent = feels;

    // Icon URL from OpenWeather
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = desc;

    // Other details
    humidity.textContent = data.main.humidity;
    wind.textContent = data.wind.speed;

    // Clear message
    showMessage("Weather loaded successfully!", false);
}
