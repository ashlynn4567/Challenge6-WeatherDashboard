// ---------------------------------------------------------------------------------------- //
// TABLE OF CONTENTS: --------------------------------------------------------------------- //
// ----------------------------------------------------------------------------1. VARIABLES //
// --------------------------------------------------------------------------2. SUBMIT FORM //
// ---------------------------------------------------------------------------3. FETCH DATA //
// -------------------------------------------------------------------------4. DISPLAY DATA //
// ---------------------------------------------------?. FUNCTION CALLS AND EVENT LISTENERS //
// ---------------------------------------------------------------------------------------- //



// 1. VARIABLES---------------------------------------------------------------------------- //
// variables 
var cityFormEl = document.getElementById("city-form");
var cityInputEl = document.getElementById("city-input");
var citySearchTerm = document.querySelectorAll(".city-name");
var currentDateEl = document.querySelector(".current-date");
var currentTempEl = document.querySelector(".current-temperature");
var currentHumidityEl = document.querySelector(".current-humidity");
var currentWindEl = document.querySelector(".current-wind-speed");
var currentUVEl = document.querySelector(".current-uv-index");

// ---------------------------------------------------------------------------END VARIABLES //




// 2. SUBMIT FORM-------------------------------------------------------------------------- //
var formSubmitHandler = function(event) {
    // prevent automatic refresh
    event.preventDefault();
    
    // get value from form input
    var cityName = cityInputEl.value.trim();

    // if user entered a city name
    if (cityName) {
        fetchCityCoordinates(cityName);
        // show city the user searched for in headers
        displayCityName(cityName);

        // reset form to blank input box
        cityInputEl.value = ""
    
    // if an empty value is submitted
    } else {
        alert("Please enter a City Name!");
    };
};
// -------------------------------------------------------------------------END SUBMIT FORM //




// 3. FETCH DATA--------------------------------------------------------------------------- //
// fetch city name
var fetchCityCoordinates = function(city) {
    var geoApiUrl = 
        "http://api.openweathermap.org/geo/1.0/direct?q=" 
        + city + 
        "&appid=758dc488dbd90e57e26ad181eba5db49";
    
    fetch(geoApiUrl).then(function(response) {
        response.json().then(function(data) {
            console.log(data);

            var lat = data[0].lat
            var lon = data[0].lon

            fetchWeatherData(lat, lon);
        }).catch(function(err) {
            console.log(err);
        });
    });
};


// fetch weather data
var fetchWeatherData = function(latitude, longitude) {
    var weatherApiUrl = 
        "https://api.openweathermap.org/data/2.5/onecall?lat=" 
        + latitude + "&lon=" + longitude +
        "&units=imperial&appid=758dc488dbd90e57e26ad181eba5db49";
   
    fetch(weatherApiUrl).then(function(response2) {
        response2.json().then(function(data) {
            console.log(data);

            displayCurrentWeather(data);
        });
    });
};
// --------------------------------------------------------------------------END FETCH DATA //




// 4. DISPLAY DATA------------------------------------------------------------------------- //
var displayCityName = function(cityName) {
    // append city name to headers on page
    citySearchTerm[0].innerText = cityName;
    citySearchTerm[1].innerText = cityName;
};


var displayCurrentWeather = function(data) {
    // collect date data from api
    var unixDate = data.current.dt;
    // converting unix to millisecs and formatting date
    var currentDate = (new Date(unixDate * 1000)).toDateString();
    // append date to page
    currentDateEl.innerText = currentDate;

    // append temperature to page
    currentTempEl.innerText = data.current.temp + " °F";
    
    // append humidity to page
    currentHumidityEl.innerText = data.current.humidity + " %";

    // collect wind direction from api
    var windDegrees = data.current.wind_deg;
    // convert wind direction degrees to cardinal directions
    var val = Math.floor((windDegrees / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    var currentWindDegrees = arr[(val % 16)];
    // append wind speed and wind direction to page
    currentWindEl.innerText = data.current.wind_speed + " mph " + currentWindDegrees;

    // append uv-index to page
    currentUVEl.innerText = data.current.uvi;
};


var displayFiveDayWeather = function() {
    
};
// ------------------------------------------------------------------------END DISPLAY DATA //




// ?. FUNCTION CALLS AND EVENT LISTENERS--------------------------------------------------- //
cityFormEl.addEventListener("submit", formSubmitHandler);
// --------------------------------------------------END FUNCTION CALLS AND EVENT LISTENERS //