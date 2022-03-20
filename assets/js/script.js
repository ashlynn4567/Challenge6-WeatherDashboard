// ---------------------------------------------------------------------------------------- //
// TABLE OF CONTENTS: --------------------------------------------------------------------- //
// ----------------------------------------------------------------------------1. VARIABLES //
// --------------------------------------------------------------------------2. SUBMIT FORM //
// ---------------------------------------------------------------------------3. FETCH DATA //
// -------------------------------------------------------------------------4. DISPLAY DATA //
// ------------------------------------------------------------------------5. LOCAL STORAGE //
// ---------------------------------------------------?. FUNCTION CALLS AND EVENT LISTENERS //
// ---------------------------------------------------------------------------------------- //


// STILL NEED:
// STYLING WITH BOOTSTRAP
// LOCAL STORAGE
// CATCH AND ERROR HANDLING


// 1. VARIABLES---------------------------------------------------------------------------- //
// variables 
var cityFormEl = document.getElementById("city-form");
var cityInputEl = document.getElementById("city-input");
var citySearchTerm = document.querySelectorAll(".city-name");
var currentDateEl = document.querySelector(".current-date");
var currentTempEl = document.querySelector(".current-temperature");
var currentFeelsLikeEl = document.querySelector(".current-rel-temp");
var currentHumidityEl = document.querySelector(".current-humidity");
var currentWindEl = document.querySelector(".current-wind");
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
            displayFiveDayWeather(data);
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

    // append relative temperature to page
    currentFeelsLikeEl.innerText = data.current.feels_like + " °F";
    
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


var displayFiveDayWeather = function(data) {
    for (i = 0; i < (data.daily.length - 3); i++) {
        console.log(data.daily[i]);
        var dayParentEl = document.querySelector(".day-" + i);

        //date
            // collect date data from api
            var unixDate = data.daily[i].dt;
            // converting unix to millisecs and formatting date
            var forecastDate = (new Date(unixDate * 1000)).toDateString();
            // create new element
            var fiveDayDateEl = document.createElement("p");
            fiveDayDateEl.setAttribute("class", "five-day-date");
            fiveDayDateEl.innerHTML = "Date: " + forecastDate;
            // append date to page
            dayParentEl.appendChild(fiveDayDateEl);

        // icon
            // create new element
            var fiveDayIconEl = document.createElement("div");
            var fiveDayIconImg = document.createElement("img");
            fiveDayIconEl.setAttribute("class", "five-day-icon");
            fiveDayIconImg.setAttribute("src", `http://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png`);
            fiveDayIconEl.appendChild(fiveDayIconImg);
            dayParentEl.appendChild(fiveDayIconEl);

        // description
            // create a new element
            var fiveDayDescription = document.createElement("p");
            fiveDayDescription.setAttribute("class", "five-day-description");
            fiveDayDescription.innerHTML = "Description: " + data.daily[i].weather[0].description;
            // append description to page
            dayParentEl.appendChild(fiveDayDescription);

        // high temp
            // create new element
            var fiveDayTempHigh = document.createElement("p");
            fiveDayTempHigh.setAttribute("class", "five-day-temp-high");
            fiveDayTempHigh.innerHTML = "High Temperature: " + data.daily[i].temp.max + " °F";
            //append temp to page
            dayParentEl.appendChild(fiveDayTempHigh);

        // low temp
            // create new element
            var fiveDayTempLow = document.createElement("p");
            fiveDayTempLow.setAttribute("class", "five-day-temp-low");
            fiveDayTempLow.innerHTML = "Low Temperature: " + data.daily[i].temp.min + " °F";
            //append temp to page
            dayParentEl.appendChild(fiveDayTempLow);

        // humidity
            var fiveDayHumidityEl = document.createElement("p");
            fiveDayHumidityEl.setAttribute("class", "five-day-humidity");
            fiveDayHumidityEl.innerHTML = "Humidity: " + data.daily[i].humidity;
            // append humidity to page
            dayParentEl.appendChild(fiveDayHumidityEl);

        // wind speed and direction
            var fiveDayWindEl = document.createElement("p");
            // collect wind direction from api
            var windDegrees = data.daily[i].wind_deg;
            // convert wind direction degrees to cardinal directions
            var val = Math.floor((windDegrees / 22.5) + 0.5);
            var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
            var fiveDayWindDegrees = arr[(val % 16)];
            fiveDayWindEl.innerText = "Wind: " + data.daily[i].wind_speed + " mph " + fiveDayWindDegrees;
            dayParentEl.appendChild(fiveDayWindEl);

        // uv index
            var fiveDayUVEl = document.createElement("p");
            fiveDayUVEl.setAttribute("class", "five-day-uv");
            fiveDayUVEl.innerHTML = "UV Index: " + data.daily[i].uvi;
            dayParentEl.appendChild(fiveDayUVEl);
    };
};
// ------------------------------------------------------------------------END DISPLAY DATA //




// 5. LOCAL STORAGE------------------------------------------------------------------------ //
// -----------------------------------------------------------------------END LOCAL STORAGE //




// ?. FUNCTION CALLS AND EVENT LISTENERS--------------------------------------------------- //
cityFormEl.addEventListener("submit", formSubmitHandler);
// --------------------------------------------------END FUNCTION CALLS AND EVENT LISTENERS //