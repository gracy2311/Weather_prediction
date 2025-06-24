let cityInput = document.getElementById('city_input'),
    searchBtn = document.getElementById('searchBtn'),
    currentLocationBtn = document.getElementById('locationBtn'),
    api_key = '85f4522d78288a94f3cba7b4a1f1eff7',
    currentWeatherCard = document.querySelector('.weather-left .card'),
    fiveDaysForecastCard = document.querySelector('.day-forecast'),
    aqiCard = document.querySelectorAll('.highlight .card')[0],
    sunriseCard = document.querySelectorAll('.highlight .card')[1],
    humidityCard = document.querySelectorAll('.highlight .card')[2],
    pressureCard = document.querySelectorAll('.highlight .card')[3],
    visibilityCard = document.querySelectorAll('.highlight .card')[4],
    windspeedCard = document.querySelectorAll('.highlight .card')[5],
    feelslikeCard = document.querySelectorAll('.highlight .card')[6],
    hourlyForecastCard = document.querySelector('.hourly-forecast'),
    aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'],
    timezone; // 👺👺 Add timezone variable declaration

function getWeatherDetails(name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
        WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
        AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`,

        days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ],
        months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];

    // ❗❗Important to clear previous html element.
    aqiCard.innerHTML = '';
    sunriseCard.innerHTML = '';
    humidityCard.innerHTML = '';
    pressureCard.innerHTML = '';
    visibilityCard.innerHTML = '';
    windspeedCard.innerHTML = '';
    feelslikeCard.innerHTML = '';
    currentWeatherCard.innerHTML = '';
    fiveDaysForecastCard.innerHTML = '';
    hourlyForecastCard.innerHTML = '';

    fetch(AIR_POLLUTION_API_URL).then(res => res.json()).then(data => {
        let { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
        aqiCard.innerHTML = `
            <div class="card-head">
                <p> Air Quality Index</p>
                <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
            </div>
            <div class="air-indices">
                <i class='bx bx-wind'></i>
                <div class="item">
                    <p>PM2.5</p>
                    <h2>${pm2_5}</h2>
                </div>
                <div class="item">
                    <p>PM10</p>
                    <h2>${pm10}</h2>
                </div>
                <div class="item">
                    <p>SO2</p>
                    <h2>${so2}</h2>
                </div>
                <div class="item">
                    <p>CO</p>
                    <h2>${co}</h2>
                </div>
                <div class="item">
                    <p>NO</p>
                    <h2>${no}</h2>
                </div>
                <div class="item">
                    <p>NO2</h2>
                    <h2>${no2}</h2>
                </div>
                <div class="item">
                    <p>NH3</p>
                    <h2>${nh3}</h2>
                </div>
                <div class="item">
                    <p>O3</p>
                    <h2>${o3}</h2>
                </div>
            </div>
        `;
    }).catch((e) => {
        console.error(e);
        alert('Failed to fetch Air Quality Index');
    });

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        let date = new Date();
        let weatherDescription = data.weather && data.weather[0] ? data.weather[0].description : 'No description available';
        let weatherIcon = data.weather && data.weather[0] ? data.weather[0].icon : '01d';
        timezone = data.timezone; // Set the timezone
        currentWeatherCard.innerHTML = `
            <div class="current-weather">
                <div class="details">
                    <p>Now</p>
                    <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                    <p>${weatherDescription}</p>
                </div>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="">
                </div>
            </div>
            <hr>
            <div class="card-footer">
                <p><i class='bx bx-calendar'></i> ${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</p>
                <p><i class='bx bxs-location-plus'></i> ${name}, ${country}</p>
            </div>
        `;
        let {sunrise, sunset} = data.sys,
            sRiseTime = moment.utc(sunrise,'X').add(timezone , 'seconds').format('hh:mm A'),
            sSetTime = moment.utc(sunset,'X').add(timezone , 'seconds').format('hh:mm A');
        sunriseCard.innerHTML = `
            <div class="card-head">
                <p>Sunrise & Sunset</p>
            </div>
            <div class="Sunrise-Sunset">
                <div class="item">
                    <div class="icon">
                        <i class='bx bx-sun'></i>
                    </div>
                    <div>
                        <p>Sunrise</p>
                        <h2>${sRiseTime}</h2>
                    </div>
                </div>
                <div class="item">
                    <div class="icon">
                        <i class='bx bxs-sun'></i>
                    </div>
                    <div>
                        <p>Sunset</p>
                        <h2>${sSetTime}</h2>
                    </div>
                </div>
            </div>
        `;

        humidityCard.innerHTML = `
            <div class="card-head">
                <p>Humidity</p>
            </div>
            <div class="card-item">
                <i class="bx bxs-droplet-half"></i>
                <h2 id="humidityVal">${data.main.humidity}%</h2>
            </div>
        `;
        pressureCard.innerHTML = `
            <div class="card-head">
                <p>Pressure</p>
            </div>
            <div class="card-item">
                <i class="fa-regular fa-compass"></i>
                <h2 id="pressureVal">${data.main.pressure} hPa</h2>
            </div>
        `;
        visibilityCard.innerHTML = `
            <div class="card-head">
                <p>Visibility</p>
            </div>
            <div class="card-item">
                <i class="fa-regular fa-eye"></i>
                <h2 id="visibilityVal">${(data.visibility / 1000).toFixed(1)} km</h2>
            </div>
        `;
        windspeedCard.innerHTML = `
            <div class="card-head">
                <p>Wind Speed</p>
            </div>
            <div class="card-item">
                <i class="bx bxl-tailwind-css"></i>
                <h2 id="windspeedVal">${data.wind.speed} m/s</h2>
            </div>
        `;
        feelslikeCard.innerHTML = `
            <div class="card-head">
                <p>Feels like</p>
            </div>
            <div class="card-item">
                <i class="fa-solid fa-temperature-low"></i>
                <h2 id="feelslikeVal">${(data.main.feels_like - 273.15).toFixed(2)}&deg;C</h2>
            </div>
        `;
    }).catch(() => {
        alert('Failed to fetch current weather');
    });

    fetch(FORECAST_API_URL).then(res => res.json()).then(data => {
        let uniqueForecastDays = [];
        let fiveDaysForecast = data.list.filter(forecast => {
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                uniqueForecastDays.push(forecastDate);
                return true;
            }
            return false;
        });

        // Displaying 5-day forecast
        fiveDaysForecastCard.innerHTML = ''; // Clear the existing forecast elements
        for (let i = 1; i < fiveDaysForecast.length; i++) {
            let date = new Date(fiveDaysForecast[i].dt_txt);
            fiveDaysForecastCard.innerHTML += `
                <div class="forecast-item">
                    <div class="icon-wrapper">
                        <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}@2x.png">
                        <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                    </div>
                    <p>${date.getDate()} ${months[date.getMonth()]}</p>
                    <p>${days[date.getDay()]}</p>
                </div>
            `;
        }

        // Displaying hourly forecast
        let hourlyForecast = data.list.slice(0, 24); // Next 24 hours
        hourlyForecastCard.innerHTML = '';
        hourlyForecast.forEach(forecast => {
            let date = new Date(forecast.dt_txt);
            hourlyForecastCard.innerHTML += `
                <div class="hourly-forecast-item">
                    <p>${date.getHours()}:00</p>
                    <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="">
                    <p>${(forecast.main.temp - 273.15).toFixed(2)}&deg;C</p>
                </div>
            `;
        });
    }).catch(() => {
        alert('Failed to fetch weather forecast');
    });
}

function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if (!cityName) return;

    let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if (data.length === 0) {
            alert(`No coordinates found for ${cityName}`);
            return;
        }
        let { name, lat, lon, country, state } = data[0];
        getWeatherDetails(name, lat, lon, country, state);
    }).catch(() => {
        alert(`Failed to fetch coordinates of ${cityName}`);
    });
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let { latitude, longitude } = position.coords;
            // Fetch city name using reverse geocoding
            let REVERSE_GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;
            fetch(REVERSE_GEOCODING_API_URL).then(res => res.json()).then(data => {
                if (data.length === 0) {
                    alert('No location information available for current coordinates.');
                    return;
                }
                let { name, country, state } = data[0];
                getWeatherDetails(name, latitude, longitude, country, state);
            }).catch(() => {
                alert('Failed to fetch location information.');
            });
        }, error => {
            alert(`Geolocation error: ${error.message}`);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Add event listener for the Enter key
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getCityCoordinates();
    }
});

searchBtn.addEventListener('click', getCityCoordinates);
currentLocationBtn.addEventListener('click', getCurrentLocation); // Add event listener for current location button
