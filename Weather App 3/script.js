const API_KEY = 'e6bcedd056af480a97655519252105';
const searchBtn = document.getElementById('search-btn');
const locationInput = document.getElementById('location-input');
const tempElement = document.getElementById('temp');
const locationElement = document.getElementById('location-name');
const weatherIcon = document.getElementById('weather-icon');
const weatherCondition = document.getElementById('weather-condition');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const uvIndex = document.getElementById('uv-index');

searchBtn.addEventListener('click', getWeather);
locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

async function getWeather() {
    const location = locationInput.value.trim();
    if (!location) {
        alert('Please enter a location');
        return;
    }

    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}&aqi=no`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update UI with weather data
        tempElement.textContent = `${Math.round(data.current.temp_c)}°C`;
        locationElement.textContent = `${data.location.name}, ${data.location.country}`;
        weatherCondition.textContent = data.current.condition.text;
        
        // Update additional weather details
        feelsLike.textContent = `${Math.round(data.current.feelslike_c)}°C`;
        humidity.textContent = `${data.current.humidity}%`;
        windSpeed.textContent = `${data.current.wind_kph} km/h`;
        uvIndex.textContent = data.current.uv;
        
        // Update weather icon based on weather condition
        const condition = data.current.condition.text.toLowerCase();
        // Map WeatherAPI conditions to our SVG icons
        const conditionMap = {
            // Clear/Sunny conditions
            'sunny': 'sunny',
            'clear': 'sunny',
            'partly cloudy': 'partly-cloudy',
            'cloudy': 'cloudy',
            'overcast': 'cloudy',
            
            // Rain conditions
            'patchy rain possible': 'rain',
            'light rain': 'rain',
            'moderate rain': 'rain',
            'heavy rain': 'heavy-rain',
            'light rain shower': 'rain',
            'moderate or heavy rain shower': 'heavy-rain',
            'patchy light rain': 'rain',
            'patchy moderate rain': 'rain',
            'patchy heavy rain': 'heavy-rain',
            
            // Thunder conditions
            'thunder': 'thunder',
            'thundery outbreaks possible': 'thunder',
            'patchy light rain with thunder': 'thunder-rain',
            'moderate or heavy rain with thunder': 'thunder-rain',
            
            // Snow conditions
            'snow': 'snow',
            'light snow': 'snow',
            'moderate snow': 'snow',
            'heavy snow': 'heavy-snow',
            'patchy snow': 'snow',
            'blizzard': 'blizzard',
            
            // Fog/Mist conditions
            'mist': 'fog',
            'fog': 'fog',
            'freezing fog': 'fog',
            
            // Other conditions
            'hail': 'hail',
            'sleet': 'sleet',
            'drizzle': 'drizzle',
            'freezing drizzle': 'drizzle',
            'blowing snow': 'blowing-snow',
            'dust': 'dust',
            'sand': 'dust',
            'smoke': 'smoke',
            'haze': 'haze'
        };
        
        const iconName = conditionMap[condition] || 'cloudy';
        weatherIcon.querySelector('use').setAttribute('href', `./images/weather-icons.svg#${iconName}`);

        // Add animation classes
        document.querySelector('.weather-info').classList.add('animate');
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        if (error.message.includes('401')) {
            alert('Invalid API key. Please check your WeatherAPI key.');
        } else {
            alert('Error fetching weather data. Please try again later.');
        }
    }
}
