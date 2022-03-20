// ---------------------------------------------------------------------------------------- //
// TABLE OF CONTENTS: --------------------------------------------------------------------- //
// ----------------------------------------------------------------------------1. VARIABLES //
// --------------------------------------------------------------------------2. SUBMIT FORM //
// ---------------------------------------------------------------------------3. FETCH DATA //
// ---------------------------------------------------?. FUNCTION CALLS AND EVENT LISTENERS //
// ---------------------------------------------------------------------------------------- //



// 1. VARIABLES---------------------------------------------------------------------------- //
// variables 
var cityFormEl = document.getElementById("city-form");
var cityInputEl = document.getElementById("city-input");
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
        });
    });
};


// fetch weather data
var fetchWeatherData = function(latitude, longitude) {
    var weatherApiUrl = 
        "https://api.openweathermap.org/data/2.5/weather?" 
        + latitude + "&lon=" + longitude + 
        "&appid=758dc488dbd90e57e26ad181eba5db49";
   
    fetch(weatherApiUrl).then(function(response2) {
        response2.json().then(function(data) {
            console.log(data);
        });
    });
};
// --------------------------------------------------------------------------END FETCH DATA //



// ?. FUNCTION CALLS AND EVENT LISTENERS--------------------------------------------------- //
cityFormEl.addEventListener("submit", formSubmitHandler);

fetchCityCoordinates();
fetchWeatherData();
// --------------------------------------------------END FUNCTION CALLS AND EVENT LISTENERS //