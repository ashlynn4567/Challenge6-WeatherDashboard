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
// LOCAL STORAGE
// CATCH AND ERROR HANDLING
// UV INDEX COLOR CHANGE


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
    capitolizedCityName = cityName.toLowerCase()
        .split(" ")
        .map((s) => 
        s.charAt(0).toUpperCase() 
        + s.substring(1)).join(" ");
    citySearchTerm[0].innerText = capitolizedCityName;
    citySearchTerm[1].innerText = capitolizedCityName;
    citySearchTerm[0].className = "city-name city-name-style";
    citySearchTerm[1].className = "city-name city-name-style";
};


var displayCurrentWeather = function(data) {
    currentForecastParent = document.getElementById("current-forecast");
    // remove old content (if any)
    currentForecastParent.innerHTML = "";
    currentForecastParent.setAttribute("class", "card");
    
    //date
        // collect date data from api
        var unixDate = data.current.dt;
        // converting unix to millisecs and formatting date
        var formattedDate = (new Date(unixDate * 1000)).toDateString();
        //create new element
        var currentDateEl = document.createElement("p");
        currentDateEl.setAttribute("class", "current-date card-header");
        currentDateEl.innerHTML = formattedDate;
        currentForecastParent.appendChild(currentDateEl);

    currentSubParentEl = document.createElement("div");
    currentSubParentEl.setAttribute("class", "current-subheader card-body forecast-card-body");

    // icon
            // create new element
            var currentIconEl = document.createElement("div");
            var currentIconImg = document.createElement("img");
            currentIconEl.setAttribute("class", "current-icon");
            currentIconImg.setAttribute("src", `http://openweathermap.org/img/w/${data.current.weather[0].icon}.png`);
            currentIconImg.setAttribute("class", "icon");
            currentIconEl.appendChild(currentIconImg);
            currentSubParentEl.appendChild(currentIconEl);

    // description
        // create a new element
        var currentDescription = document.createElement("p");
        currentDescription.setAttribute("class", "current-description");
        // capitalize first letter of every word in description
        var description = data.current.weather[0].description;
        description = description.toLowerCase()
            .split(" ")
            .map((s) => 
            s.charAt(0).toUpperCase() 
            + s.substring(1)).join(" ");
        currentDescription.innerHTML = description;
        // append description to page
        currentSubParentEl.appendChild(currentDescription);

    // temp
        // create new element
        var currentTempEl = document.createElement("p");
        currentTempEl.setAttribute("class", "current-temp");
        currentTempEl.innerHTML = "Temperature: " + data.current.temp + " °F";
        //append temp to page
        currentSubParentEl.appendChild(currentTempEl);

    // relative temp
        // create new element
        var currentFeelsLikeEl = document.createElement("p");
        currentFeelsLikeEl.setAttribute("class", "current-rel-temp");
        currentFeelsLikeEl.innerHTML = "Feels Like: " + data.current.feels_like + " °F";
        //append temp to page
        currentSubParentEl.appendChild(currentFeelsLikeEl);
    
    // humidity
        var currentHumidityEl = document.createElement("p");
        currentHumidityEl.setAttribute("class", "current-humidity");
        currentHumidityEl.innerHTML = "Humidity: " + data.current.humidity + " %";
        // append humidity to page
        currentSubParentEl.appendChild(currentHumidityEl);

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
        currentSubParentEl.appendChild(currentWindEl);

    // uv index
        var currentUVEl = document.createElement("p");
        // set colors for uv index
        if (data.current.uvi < 2.99) {
            // color green
            currentUVEl.setAttribute("class", "current-uv uv-low");
        } else if (data.current.uvi > 3 && data.current.uvi < 5.99) {
            // color yellow
            currentUVEl.setAttribute("class", "current-uv uv-moderate");
        } else if (data.current.uvi > 6 && data.current.uvi < 7.99) {
            // color orange
            currentUVEl.setAttribute("class", "current-uv uv-high");
        } else if (data.current.uvi > 8) {
            // color red
            currentUVEl.setAttribute("class", "current-uv uv-very-high");
        };
        currentUVEl.innerHTML = "UV Index: " + data.current.uvi;
        currentSubParentEl.appendChild(currentUVEl);

    currentForecastParent.appendChild(currentSubParentEl);
};


var displayFiveDayWeather = function(data) {
    for (i = 0; i < (data.daily.length - 3); i++) {
        var dayParentEl = document.querySelector(".day-" + i);
        console.log(dayParentEl);
        // // remove old content (if any)
        // dayParentEl.innerHTML = "";
        dayParentEl.setAttribute("class", ".day-" + i + " col forecast-card card");

        //date
            // collect date data from api
            var unixDate = data.daily[i].dt;
            // converting unix to millisecs and formatting date
            var forecastDate = (new Date(unixDate * 1000)).toDateString();
            // create new element
            var fiveDayDateEl = document.createElement("p");
            fiveDayDateEl.setAttribute("class", "five-day-date card-header");
            fiveDayDateEl.innerHTML = forecastDate;
            // append date to page
            dayParentEl.appendChild(fiveDayDateEl);

        daySubParentEl = document.createElement("div");
        daySubParentEl.setAttribute("class", "day-" + i + "-subheader card-body forecast-card-body");

        // icon
            // create new element
            var fiveDayIconEl = document.createElement("div");
            var fiveDayIconImg = document.createElement("img");
            fiveDayIconEl.setAttribute("class", "five-day-icon");
            fiveDayIconImg.setAttribute("src", `http://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png`);
            fiveDayIconImg.setAttribute("class", "icon");
            fiveDayIconEl.appendChild(fiveDayIconImg);
            daySubParentEl.appendChild(fiveDayIconEl);

        // description
            // create a new element
            var fiveDayDescription = document.createElement("p");
            fiveDayDescription.setAttribute("class", "five-day-description");
            // capitalize first letter of every word in description
            var description = data.daily[i].weather[0].description;
            description = description.toLowerCase()
                .split(" ")
                .map((s) => 
                s.charAt(0).toUpperCase() 
                + s.substring(1)).join(" ");
            fiveDayDescription.innerHTML = description;
            // append description to page
            daySubParentEl.appendChild(fiveDayDescription);

        // high temp
            // create new element
            var fiveDayTempHigh = document.createElement("p");
            fiveDayTempHigh.setAttribute("class", "five-day-temp-high");
            fiveDayTempHigh.innerHTML = "High: " + data.daily[i].temp.max + " °F";
            //append temp to page
            daySubParentEl.appendChild(fiveDayTempHigh);

        // low temp
            // create new element
            var fiveDayTempLow = document.createElement("p");
            fiveDayTempLow.setAttribute("class", "five-day-temp-low");
            fiveDayTempLow.innerHTML = "Low: " + data.daily[i].temp.min + " °F";
            //append temp to page
            daySubParentEl.appendChild(fiveDayTempLow);

        // humidity
            var fiveDayHumidityEl = document.createElement("p");
            fiveDayHumidityEl.setAttribute("class", "five-day-humidity");
            fiveDayHumidityEl.innerHTML = "Humidity: " + data.daily[i].humidity + " %";
            // append humidity to page
            daySubParentEl.appendChild(fiveDayHumidityEl);

        // wind speed and direction
            var fiveDayWindEl = document.createElement("p");
            fiveDayWindEl.setAttribute("class", "five-day-wind");
            // collect wind direction from api
            var windDegrees = data.daily[i].wind_deg;
            // convert wind direction degrees to cardinal directions
            var val = Math.floor((windDegrees / 22.5) + 0.5);
            var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
            var fiveDayWindDegrees = arr[(val % 16)];
            fiveDayWindEl.innerHTML = "Wind: " + data.daily[i].wind_speed 
                + "<br> mph " + fiveDayWindDegrees;
            daySubParentEl.appendChild(fiveDayWindEl);

        // uv index
            var fiveDayUVEl = document.createElement("p");
            // set colors for uv index
            if (data.daily[i].uvi < 2.99) {
                // color green
                fiveDayUVEl.setAttribute("class", "five-day-uv uv-low");
            } else if (data.daily[i].uvi > 3 && data.daily[i].uvi < 5.99) {
                // color yellow
                fiveDayUVEl.setAttribute("class", "five-day-uv uv-moderate");
            } else if (data.daily[i].uvi > 6 && data.daily[i].uvi < 7.99) {
                // color orange
                fiveDayUVEl.setAttribute("class", "five-day-uv uv-high");
            } else if (data.daily[i].uvi > 8) {
                // color red
                fiveDayUVEl.setAttribute("class", "five-day-uv uv-very-high");
            };
            fiveDayUVEl.innerHTML = "UV Index: " + data.daily[i].uvi;
            daySubParentEl.appendChild(fiveDayUVEl);

        dayParentEl.appendChild(daySubParentEl);
    };
};
// ------------------------------------------------------------------------END DISPLAY DATA //




// 5. LOCAL STORAGE------------------------------------------------------------------------ //
// -----------------------------------------------------------------------END LOCAL STORAGE //




// ?. FUNCTION CALLS AND EVENT LISTENERS--------------------------------------------------- //
cityFormEl.addEventListener("submit", formSubmitHandler);
// --------------------------------------------------END FUNCTION CALLS AND EVENT LISTENERS //