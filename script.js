
const searchButton = document.querySelector("#search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const daysForecastDiv = document.querySelector(".days-forecast");
const API_KEY = '1cb614ab5a621446ccb3dbe42275f36f';
let countriesData = [];
let cityData = [];
console.log('countries data:',countriesData);
let cityName=''
let latitude = ''
let longitude = ''
async function fetchCountries() {
    try {
      
      const response = await fetch('https://restcountries.com/v3.1/all');
      const countries = await response.json();
      countriesData = countries; 

      const countrySelect = document.getElementById('country-selection');
      countrySelect.innerHTML = '<option value="">Select a country</option>';

      countries.sort((a, b) => a.name.common.localeCompare(b.name.common)); 
      countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.cca2; 
        option.textContent = country.name.common; 
    
        countrySelect.appendChild(option);
      });
      console.log('countries loaded',countriesData);
      
      
      countrySelect.addEventListener('change', fetchCities);
    } catch (error) {
      console.error('Error fetching countries:', error);
      document.getElementById('country').innerHTML = '<option value="">Failed to load countries</option>';
    }
  }

  
  async function fetchCities() {
    const country = document.getElementById('country-selection').value;
    const citySelect = document.getElementById('city');
    console.log('selected html element for city is :-',citySelect);
    console.log('country selected:',country);
    
    if (!country) {
      citySelect.innerHTML = '<option value="">Select a country first</option>';
      // citySelect.disabled = true;
      return;
    }
    console.log('country selected from the select option:',country);
    
    const selectedCountry = countriesData.find(c => c.cca2 === country);
    
    console.log('selected country same like city coordinates :-',selectedCountry);

    if (selectedCountry) {
     
      const countryName = selectedCountry.name.common;
      const capital = selectedCountry.capital
      const border_country = selectedCountry.borders;
      const continent = selectedCountry.continents;
      const car_drive_side =selectedCountry.car.side
      const spoken_lang =selectedCountry.languages;
      const flag_src = selectedCountry.flags.png;
      const pop_in_mil = selectedCountry.population;
      const population = pop_in_mil/1000000;
      const latitude = selectedCountry.latlng[0];
      const longitude = selectedCountry.latlng[1];
      const timezones = selectedCountry.timezones;
      console.log('latitude of the country:',latitude);
      console.log('flag of the country',flag_src);
      const  country_code=selectedCountry.idd.root + selectedCountry.idd.suffixes[0];
      
      const country_currency = selectedCountry.currencies;
      let counLang =[];
      let counCurr =[];
      for(const languageCode in spoken_lang){
        console.log('languages of selected country:', spoken_lang[languageCode]);
        counLang +=spoken_lang[languageCode]+' , '

      }
      for (const currencyCode in country_currency) {
        console.log('Currency name of selected country:', country_currency[currencyCode].name);
        console.log('Currency symbol of selected country:', country_currency[currencyCode].symbol);
        counCurr = country_currency[currencyCode].name
        const currencySymbol = country_currency[currencyCode].symbol;
        counCurr += " " + currencySymbol;

      }

      const divelement = document.getElementById('data-country').innerHTML =`    
  <h3 class="fw-bold">Country Data</h3>
            <h6 class="my-3 mt-3">Country Name: <span id="country-name">${countryName}</span></h6>
            <h6 class="my-3">Capital: <span id="country-capital">${capital}</span></h6>
            <h6 class="my-3">Region: <span id="country-region">${continent}</span></h6>
            <h6 class="my-3">Population: <span id="country-population">${population} Million</span></h6>
            <h6 class="my-3">Border Country: <span id="country-area"></span>${border_country}</h6>
            <h6 class="my-3">Languages: <span id="country-languages">${counLang}</span></h6>
            <h6 class="my-3">Currencies: <span id="country-currencies">${counCurr}</span></h6>
            <h6 class="my-3">Timezones: <span id="country-timezones">${timezones}</span></h6>
            <h6 class="my-3">Lat/Lng: <span id="country-latlng">${latitude}/${longitude}</span></h6>
            <h6 class="my-3">Car Driving Side: <span id="country-subregion">${car_drive_side}</span></h6>
            <h6 class="my-3">Country Code: <span id="country-code">${country_code}</span></h6>
            <h6 class="my-3">Country Flag: <img src ="${flag_src}" alt ="country flag"></h6>
             `


  //     console.log('Capital of selected country:', selectedCountry.capital);
      
    } else {
      console.log('Capital not found for the selected country');
    }
    const url_state = 'https://country-state-city-search-rest-api.p.rapidapi.com/states-by-countrycode?countrycode='+country;
    const url = 'https://country-state-city-search-rest-api.p.rapidapi.com/cities-by-countrycode?countrycode='+country;
const options = {
  method: 'GET',
  headers: {
      'x-rapidapi-key': 'b63b4a1979msh378d430d6e244d8p1bc3a9jsn4746ae3f5f99',
      'x-rapidapi-host': 'country-state-city-search-rest-api.p.rapidapi.com'
  }
    };
    try {

          const response = await fetch(url, options);
          const response_state = await fetch(url_state, options);
        const data_state = await response_state.json();
        const data = await response.json();
        cityData= data;
          console.log('result of cities fro API',data);
        console.log('result of states fro API',data_state);
        if (!data || !Array.isArray(data)) {
          throw new Error('No cities found for the selected country');
        }
        
        
      const cities = data.map(city => city.name);
      console.log('cities of selected country:', cities);
      
      citySelect.innerHTML = '<option value="">Select a city</option>';
      cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city; // City name
        option.textContent = city; // City names
        citySelect.appendChild(option);
      });
      citySelect.disabled = false;
       
    } catch (error) {
      console.error('Error fetching cities:', error);
      citySelect.innerHTML = '<option value="">Failed to load cities</option>';
    }
     
    const selectedCity = document.getElementById('city');
    console.log('selected city to show weather for is ',selectedCity);
  selectedCity.addEventListener('change', () => {
      cityName = selectedCity.value;
      console.log('selected city to show weather for after selecting is ',cityName);
      // getCityCoordinates(cityName);
      console.log('city name:',cityName);
  const cityCordinate = cityData.find(c => c.name === cityName);
  console.log('city cordinates:',cityCordinate);
  latitude = cityCordinate.latitude;
  longitude = cityCordinate.longitude;
  console.log('latitude:',latitude);
  console.log('longitude:',longitude);

    });
  searchButton.addEventListener('click', () => {
    getWeatherDetails(cityName, latitude, longitude);
  })
  
  }


  fetchCountries();
// // Create weather card HTML based on weather data
const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) {
        return `<div class="mt-3 d-flex justify-content-between">
                    <div>
                        <h3 class="fw-bold">${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h3>
                        <h6 class="my-3 mt-3">Temperature: ${((weatherItem.main.temp - 273.15).toFixed(2))}°C</h6>
                        <h6 class="my-3">Wind: ${weatherItem.wind.speed} M/S</h6>
                        <h6 class="my-3">Humidity: ${weatherItem.main.humidity}%</h6>
                    </div>
                    <div class="text-center me-lg-5">
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather icon">
                        <h6>${weatherItem.weather[0].description}</h6>
                    </div>
                </div>`;
    } else {
        return `<div class="col mb-3">
                    <div class="card border-0 bg-secondary text-white">
                        <div class="card-body p-3 text-white">
                            <h5 class="card-title fw-semibold">(${weatherItem.dt_txt.split(" ")[0]})</h5>
                            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}.png" alt="weather icon">
                            <h6 class="card-text my-3 mt-3">Temp: ${((weatherItem.main.temp - 273.15).toFixed(2))}°C</h6>
                            <h6 class="card-text my-3">Wind: ${weatherItem.wind.speed} M/S</h6>
                            <h6 class="card-text my-3">Humidity: ${weatherItem.main.humidity}%</h6>
                        </div>
                    </div>
                </div>`;
    }
}

// //Get weather details of passed latitude and longitude
const getWeatherDetails = (cityName, latitude, longitude) => {
  console.log('city name:',cityName);
    console.log('latitude:',latitude);
    console.log('longitude:',longitude);
    if (cityName === "" || latitude === "" || longitude === "") {
        alert("Please select a city and country to get the weather details!");
        return;
    }

  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        console.log('data fetched for weather details',data);
        
        const forecastArray = data.list;
        console.log('foreccast array data that is fetched',forecastArray);
        const uniqueForecastDays = new Set();

        const fiveDaysForecast = forecastArray.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            console.log('forecast date data for dates',forecastDate);
            console.log('forecast date data for unique dates',uniqueForecastDays);
            
            // Filter out duplicate dates and limit to 5 unique days
            if (!uniqueForecastDays.has(forecastDate) && uniqueForecastDays.size < 6) {
                uniqueForecastDays.add(forecastDate);
                return true;
            }
            return false;
        });

        // cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        daysForecastDiv.innerHTML = "";
        console.log('five days forecast data',fiveDaysForecast);
        
        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                daysForecastDiv.insertAdjacentHTML("beforeend", html);
            }
        });        
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
}
