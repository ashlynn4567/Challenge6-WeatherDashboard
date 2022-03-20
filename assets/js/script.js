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
    currentForecastParent = document.getElementById("current-forecast");
    
    //date
        // collect date data from api
        var unixDate = data.current.dt;
        // converting unix to millisecs and formatting date
        var formattedDate = (new Date(unixDate * 1000)).toDateString();
        //create new element
        var currentDateEl = document.createElement("p");
        currentDateEl.setAttribute("class", "current-date");
        currentDateEl.innerHTML = "Date: " + formattedDate;
        currentForecastParent.appendChild(currentDateEl);

    // icon
            // create new element
            var currentIconEl = document.createElement("div");
            var currentIconImg = document.createElement("img");
            currentIconEl.setAttribute("class", "current-icon");
            currentIconImg.setAttribute("src", `http://openweathermap.org/img/w/${data.current.weather[0].icon}.png`);
            currentIconEl.appendChild(currentIconImg);
            currentForecastParent.appendChild(currentIconEl);

        // description
            // create a new element
            var currentDescription = document.createElement("p");
            currentDescription.setAttribute("class", "current-description");
            currentDescription.innerHTML = "Description: " + data.current.weather[0].description;
            // append description to page
            currentForecastParent.appendChild(currentDescription);

    // temp
        // create new element
        var currentTempEl = document.createElement("p");
        currentTempEl.setAttribute("class", "current-temp");
        currentTempEl.innerHTML = "Temperature: " + data.current.temp + " °F";
        //append temp to page
        currentForecastParent.appendChild(currentTempEl);

    // relative temp
        // create new element
        var currentFeelsLikeEl = document.createElement("p");
        currentFeelsLikeEl.setAttribute("class", "current-rel-temp");
        currentFeelsLikeEl.innerHTML = "Temperature: " + data.current.feels_like + " °F";
        //append temp to page
        currentForecastParent.appendChild(currentFeelsLikeEl);
    
    // humidity
        var currentHumidityEl = document.createElement("p");
        currentHumidityEl.setAttribute("class", "current-humidity");
        currentHumidityEl.innerHTML = "Humidity: " + data.current.humidity + " %";
        // append humidity to page
        currentForecastParent.appendChild(currentHumidityEl);

    // wind direction and speed
        var currentWindEl = document.createElement("p");
        currentWindEl.setAttribute("class", "current-wind");
        // collect wind direction from api
        var windDegrees = data.current.wind_deg;
        // convert wind direction degrees to cardinal directions
        var val = Math.floor((windDegrees / 22.5) + 0.5);
        var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        var currentWindDegrees = arr[(val % 16)];
        currentWindEl.innerText = "Wind: " + data.current.wind_speed + " mph " + currentWindDegrees;
        currentForecastParent.appendChild(currentWindEl);

    // uv index
        var currentUVEl = document.createElement("p");
        currentUVEl.setAttribute("class", "current-uv");
        currentUVEl.innerHTML = "UV Index: " + data.current.uvi;
        currentForecastParent.appendChild(currentUVEl);
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
            fiveDayHumidityEl.innerHTML = "Humidity: " + data.daily[i].humidity + " %";
            // append humidity to page
            dayParentEl.appendChild(fiveDayHumidityEl);

        // wind speed and direction
            var fiveDayWindEl = document.createElement("p");
            fiveDayWindEl.setAttribute("class", "five-day-wind");
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