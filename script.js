document.addEventListener("DOMContentLoaded", function () {
    let latitude;
    let longitude;

    function getWeather() {
        let city = document.getElementById('searchBar').value;
        let geoApiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=fd1869469cc46ceadda145678340a55a';

        fetch(geoApiUrl)
            .then(response => response.json())
            .then(data => {
                latitude = data[0].lat;
                longitude = data[0].lon;
                showWeather();

                saveToLocalStorage(city);
            })
            .catch(error => console.log('Error fetching geo data:', error));
    };

    function showWeather() {
        let weatherApiUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=fd1869469cc46ceadda145678340a55a';

        fetch(weatherApiUrl)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data.list[0]);
                displayForecast(data.list.slice(1));
            })
            .catch(error => console.log('Error fetching weather data:', error));
    };

    function displayCurrentWeather(currentWeather) {
        let currentWeatherDiv = document.getElementById('currentWeather');
        currentWeatherDiv.innerHTML = `
            <h2>Current Weather</h2>
            <p>Temperature: ${currentWeather.main.temp}</p>
            <p>Humidity: ${currentWeather.main.humidity}</p>
            <p>Wind Speed: ${currentWeather.wind.speed}</p>
            <img src="http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png" alt="Weather Icon">
        `;
    }

    function displayForecast(forecast) {
        let forecastPerDay = {};

        forecast.forEach(function (forecastItem) {
            let date = new Date(forecastItem.dt * 1000).toLocaleDateString(); 

            if (!forecastPerDay[date]) {
                forecastPerDay[date] = forecastItem;
            }
        });

        let forecastWeatherDiv = document.getElementById('forecastWeather');
        forecastWeatherDiv.innerHTML = `
            <h2>5-Day Forecast</h2>
            <ul>
                ${Object.keys(forecastPerDay).map(date => {
                    let item = forecastPerDay[date];
                    return `
                        <li>
                            <p>Date: ${new Date(item.dt * 1000).toLocaleDateString()}</p>
                            <p>Temperature: ${item.main.temp}</p>
                            <p>Humidity: ${item.main.humidity}</p>
                            <p>Wind Speed: ${item.wind.speed}</p>
                            <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="Weather Icon">
                        </li>
                    `;
                }).join('')}
            </ul>
        `;
    }

    document.getElementById('searchButton').addEventListener('click', getWeather);

    loadRecentSearches();

    function saveToLocalStorage(city) {
        let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        recentSearches.push(city);
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
        loadRecentSearches();
    }

    function loadRecentSearches() {
        let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        let recentSearchesList = document.getElementById('recentSearches');
        recentSearchesList.innerHTML = '';
        recentSearches.forEach(city => {
            let listItem = document.createElement('li');
            listItem.textContent = city;
            listItem.addEventListener('click', function() {
                document.getElementById('searchBar').value = city;
                getWeather();
            });
            recentSearchesList.appendChild(listItem);
        });
    }
});