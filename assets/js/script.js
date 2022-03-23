// ---------------------------------------------------------------------------------------- //
// TABLE OF CONTENTS: --------------------------------------------------------------------- //
// ----------------------------------------------------------------------------1. VARIABLES //
// --------------------------------------------------------------------------2. SUBMIT FORM //
// ---------------------------------------------------------------------------3. FETCH DATA //
// -------------------------------------------------------------------------4. DISPLAY DATA //
// ------------------------------------------------------------------------5. LOCAL STORAGE //
// ---------------------------------------------------?. FUNCTION CALLS AND EVENT LISTENERS //
// ---------------------------------------------------------------------------------------- //




// 1. VARIABLES---------------------------------------------------------------------------- //
// variables 
var cityFormEl = document.getElementById("city-form");
var cityInputEl = document.getElementById("city-input");
var citySearchTerm = document.querySelectorAll(".city-name");
var clearBtnEl = document.getElementById("clear-button");
var historyParentEl = document.getElementById("recent-searches");
var localStorageCityName = JSON.parse(localStorage.getItem("lastSearch")) || [];

// ---------------------------------------------------------------------------END VARIABLES //




// 2. SUBMIT FORM-------------------------------------------------------------------------- //
var formSubmitHandler = function(event) {
    // prevent automatic refresh
    event.preventDefault();
    // setting the last searched city
    setLocalStorage();
    
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
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);

                var lat = data[0].lat
                var lon = data[0].lon

                fetchWeatherData(lat, lon);
                displayCityName(city);
            });
        } else {
            alert("GeoCoding API Error: " + response.statusText);
        }
    })
    .catch(function(err) {
        console.log(err);
        alert("Unable to connect to GeoCoding API.");
    });
};


// fetch weather data
var fetchWeatherData = function(latitude, longitude) {
    var weatherApiUrl = 
        "https://api.openweathermap.org/data/2.5/onecall?lat=" 
        + latitude + "&lon=" + longitude +
        "&units=imperial&appid=758dc488dbd90e57e26ad181eba5db49";
   
    fetch(weatherApiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
            console.log(data);

            displayCurrentWeather(data);
            displayFiveDayWeather(data);
            });
        
        } else {
            alert("OneCall Weather API Error: " + response.statusText);
        }
    })
    .catch(function(err) {
        console.log(err);
        alert("Unable to connect to OneCall Weather API.")
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


var displayLastSearched = function(cityName) {
    var recentSearchListParent = document.getElementById("recent-searches");
    var lastSearchButtonEl = document.createElement("button");
    lastSearchButtonEl.setAttribute("class", "btn last-searched-button");
    // capitalize first letter of every word in description
    capitolizedCityName = cityName.toLowerCase()
        .split(" ")
        .map((s) => 
        s.charAt(0).toUpperCase() 
        + s.substring(1)).join(" ");
    lastSearchButtonEl.innerText = capitolizedCityName;
    recentSearchListParent.appendChild(lastSearchButtonEl);
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
    currentSubParentEl.setAttribute("class", "current-subheader card-body");

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
        var currentDescription = document.createElement("h3");
        currentDescription.setAttribute("class", "current-description");
        // capitalize first letter of every word in description
        var description = data.current.weather[0].description;
        description = description.toLowerCase()
            .split(" ")
            .map((s) => 
            s.charAt(0).toUpperCase() 
            + s.substring(1)).join(" ");
        currentDescription.innerText = description;
        // append description to page
        currentSubParentEl.appendChild(currentDescription);

    // temp
        // create new element
        var currentTempEl = document.createElement("p");
        currentTempEl.setAttribute("class", "current-temp");
        currentTempEl.innerHTML = "<b>Temperature:</b> " + data.current.temp + " °F";
        //append temp to page
        currentSubParentEl.appendChild(currentTempEl);

    // relative temp
        // create new element
        var currentFeelsLikeEl = document.createElement("p");
        currentFeelsLikeEl.setAttribute("class", "current-rel-temp");
        currentFeelsLikeEl.innerHTML = "<b>Feels Like:</b> " + data.current.feels_like + " °F";
        //append temp to page
        currentSubParentEl.appendChild(currentFeelsLikeEl);
    
    // humidity
        var currentHumidityEl = document.createElement("p");
        currentHumidityEl.setAttribute("class", "current-humidity");
        currentHumidityEl.innerHTML = "<b>Humidity:</b> " + data.current.humidity + " %";
        // append humidity to page
        currentSubParentEl.appendChild(currentHumidityEl);

    // wind direction and speed
        var currentWindEl = document.createElement("p");
        currentWindEl.setAttribute("class", "current-wind");
        // collect wind direction from api
        var windDegrees = data.current.wind_deg;
        // convert wind direction degrees to cardinal directions
        var val = Math.floor((windDegrees / 22.5) + 0.5);
        var arr = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
        var currentWindDegrees = arr[(val % 8)];
        currentWindEl.innerHTML = "<b>Wind:</b> " + data.current.wind_speed + " mph " + currentWindDegrees;
        currentSubParentEl.appendChild(currentWindEl);

    // uv index
        var currentUVEl = document.createElement("p");
        // set colors for uv index
        if (data.current.uvi < 2.99) {
            // color green
            currentUVEl.innerHTML = "<b>UV Index:</b> <span class='current-uv uv-low'>" + data.current.uvi + "</span>";
        } else if (data.current.uvi > 3 && data.current.uvi < 5.99) {
            // color yellow
            currentUVEl.innerHTML = "<b>UV Index:</b> <span class='current-uv uv-moderate'>" + data.current.uvi + "</span>";
        } else if (data.current.uvi > 6 && data.current.uvi < 7.99) {
            // color orange
            currentUVEl.innerHTML = "<b>UV Index:</b> <span class='current-uv uv-high'>" + data.current.uvi + "</span>";
        } else if (data.current.uvi > 8) {
            // color red
            currentUVEl.innerHTML = "<b>UV Index:</b> <span class='current-uv uv-very-high'>" + data.current.uvi + "</span>";
        };
        currentSubParentEl.appendChild(currentUVEl);

    currentForecastParent.appendChild(currentSubParentEl);
};


var displayFiveDayWeather = function(data) {
    for (i = 0; i < (data.daily.length - 3); i++) {
        var dayParentEl = document.querySelector(".day-" + i);
        console.log(dayParentEl);
        // // remove old content (if any)
        dayParentEl.innerHTML = "";
        dayParentEl.setAttribute("class", "day-" + i + " col forecast-card card");

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
        daySubParentEl.setAttribute("class", "day-" + i + "-subheader card-body");

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
            var fiveDayDescription = document.createElement("h3");
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
            fiveDayTempHigh.innerHTML = "<b>High:</b> " + data.daily[i].temp.max + " °F";
            //append temp to page
            daySubParentEl.appendChild(fiveDayTempHigh);

        // low temp
            // create new element
            var fiveDayTempLow = document.createElement("p");
            fiveDayTempLow.setAttribute("class", "five-day-temp-low");
            fiveDayTempLow.innerHTML = "<b>Low:</b> " + data.daily[i].temp.min + " °F";
            //append temp to page
            daySubParentEl.appendChild(fiveDayTempLow);

        // humidity
            var fiveDayHumidityEl = document.createElement("p");
            fiveDayHumidityEl.setAttribute("class", "five-day-humidity");
            fiveDayHumidityEl.innerHTML = "<b>Humidity:</b> " + data.daily[i].humidity + " %";
            // append humidity to page
            daySubParentEl.appendChild(fiveDayHumidityEl);

        // wind speed and direction
            var fiveDayWindEl = document.createElement("p");
            fiveDayWindEl.setAttribute("class", "five-day-wind");
            // collect wind direction from api
            var windDegrees = data.daily[i].wind_deg;
            // convert wind direction degrees to cardinal directions
            var val = Math.floor((windDegrees / 22.5) + 0.5);
            var arr = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
            var fiveDayWindDegrees = arr[(val % 8)];
            fiveDayWindEl.innerHTML = "<b>Wind:</b> " + data.daily[i].wind_speed 
                + " mph " + fiveDayWindDegrees;
            daySubParentEl.appendChild(fiveDayWindEl);

        // uv index
            var fiveDayUVEl = document.createElement("p");
            // set colors for uv index
            if (data.daily[i].uvi < 2.99) {
                // color green
                fiveDayUVEl.innerHTML = "<b>UV Index:</b> <span class='five-day-uv uv-low'>" + data.daily[i].uvi + "</span>";
            } else if (data.daily[i].uvi > 3 && data.daily[i].uvi < 5.99) {
                // color yellow
                fiveDayUVEl.innerHTML = "<b>UV Index:</b> <span class='five-day-uv uv-moderate'>" + data.daily[i].uvi + "</span>";
            } else if (data.daily[i].uvi > 6 && data.daily[i].uvi < 7.99) {
                // color orange
                fiveDayUVEl.innerHTML = "<b>UV Index:</b> <span class='five-day-uv uv-high'>" + data.daily[i].uvi + "</span>";
            } else if (data.daily[i].uvi > 8) {
                // color red
                fiveDayUVEl.innerHTML = "<b>UV Index:</b> <span class='five-day-uv uv-very-high'>" + data.daily[i].uvi + "</span>";
            };
            daySubParentEl.appendChild(fiveDayUVEl);

        dayParentEl.appendChild(daySubParentEl);
    };
};
// ------------------------------------------------------------------------END DISPLAY DATA //




// 5. LOCAL STORAGE------------------------------------------------------------------------ //
// Save last searched zip code to local storage
function setLocalStorage() {
    // get the city name and save to localstorage
    const lastSearch = cityInputEl.value.trim();
    localStorageCityName.push(lastSearch);
    localStorage.setItem("lastSearch", JSON.stringify(localStorageCityName));

    // display button for last searched city name
    displayLastSearched(lastSearch);
};

// Load last searched zip code
var loadLastSearched = function () {
    lastSearch = JSON.parse(localStorage.getItem("lastSearch")) || [];

    // create empty string if there is nothing saved in localStorage
    if (lastSearch.length !== 0) {
        for (i = 0; i < lastSearch.length; i++) {
            displayLastSearched(lastSearch[i]);
        };
    };
};

// clear recent city search history
var clearHistory = function() {
    window.localStorage.removeItem("lastSearch");
    window.location.reload();
};

// reload recent search on button click
var reSearchRecent = function(event) {
    var recentSearch = event.target.textContent;
    fetchCityCoordinates(recentSearch);
};
// -----------------------------------------------------------------------END LOCAL STORAGE //




// ?. FUNCTION CALLS AND EVENT LISTENERS--------------------------------------------------- //
loadLastSearched();
cityFormEl.addEventListener("submit", formSubmitHandler);
historyParentEl.addEventListener("click", reSearchRecent);
clearBtnEl.addEventListener("click", clearHistory);
// --------------------------------------------------END FUNCTION CALLS AND EVENT LISTENERS //