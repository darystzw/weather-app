'use strict'
const search = document.querySelector('.searchBtn');
const weatherTab = document.querySelector('.weather');
const windSpeed = document.querySelector('.wind');
const humidityVal = document.querySelector('.humidity');
const tempValue = document.querySelector('.temp');
const city = document.querySelector('.cityName');
const cityValue = document.querySelector('.city');
const nullCity = document.querySelector('.noValue');
const weatherIcon = document.querySelector('.weatherIcon');
const card = document.querySelector('.card');

const cityInput = document.querySelector('#cityInput');
const suggestions = document.querySelector('#suggestions');

const popover = document.querySelector('.popover');
const locationYes = document.querySelector('.yes');
const locationNo = document.querySelector('.no');

const htpp = new XMLHttpRequest();

const apiUrl = `https://api.openweathermap.org/data/2.5/weather?`;
const apiKey = `34975d3489843481b4a7a97179bcf3df`;
const mapboxToken = 'pk.eyJ1IjoiZGFyeXN0enciLCJhIjoiY21hbnBnN2ZwMDE0ZzJwcjB2OWZzOXludyJ9.KiyIE3zN0g9QNwV9d3Ey7g';
const hide = function(){
    weatherTab.style.display = 'none';
}

const getSuggestions = async ()=>{
    const query = cityInput.value.trim();
    if(query.length < 2){
        suggestions.innerHTML = '';
        suggestions.style.display = 'none';
        return;
    }

    try{
        const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&types=place&autocomplete=true&limit=5`;
        const response = await fetch(mapboxUrl);
        var data = await response.json();

        suggestions.innerHTML = '';
        console.log(data);

        data.features.forEach((feature) =>{
            const li = document.createElement('li');
            li.textContent = feature.place_name;
            li.addEventListener('click', ()=>{
                cityInput.value = feature.text;
                suggestions.innerHTML = '';
                suggestions.style.display = 'none';
                checkweather();
            });
            suggestions.appendChild(li);
        })
        suggestions.style.display = 'block';
    }
    catch(error){
        console.log('error fetching suggestions', error);
        suggestions.innerHTML = '';
        suggestions.style.display = 'none';
    }
}
const checkweather = async function(){
    const cityName = city.value.trim();
    if(!cityName){
        nullCity.style.display = 'block';
        weatherTab.style.display = 'none';
    }
    else{
        try{
            const response = await fetch(apiUrl+ `units=metric&q=${cityName}`  + `&appid=${apiKey}`);
            var data = await response.json();
            
            if(data.cod != 200){
                nullCity.innerHTML = 'Please! Enter valid City name';
                nullCity.style.display = 'block';
                weatherTab.style.display = 'none';
            }
            tempValue.innerHTML = Math.round(data.main.temp)+'°C';
            cityValue.innerHTML = cityName[0].toUpperCase() + cityName.slice(1);
            humidityVal.innerHTML = data.main.humidity+'%';
            windSpeed.innerHTML = data.wind.speed+' km/h';
            weatherIcon.src = `icons/${data.weather[0].main}.png`;
            nullCity.innerHTML = `${data.weather[0].description}`;
            nullCity.style.display = 'block';
            weatherTab.style.display = 'block';
    
        }
        catch (error){
            nullCity.style.display = 'block';
            weatherTab.style.display = 'none';
        }
    }
   
    
}
window.addEventListener('DOMContentLoaded', function(){
    if (popover.style.display === 'none' || popover.style.display === '') {
        popover.style.display = 'block';
      } else {
        popover.style.display = 'none';
      }
});
const findMyCoordinates = async (pos)=>{
    const crd = pos.coords;
    const latitude = crd.latitude;
    const longitude = crd.longitude;

        try{
            const response = await fetch(apiUrl + `lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
            var data = await response.json();

            if (data.cod !== 200) {
                throw new Error("Invalid response");
            }

            let cityName = data.name;
            popover.style.display ='none';

            tempValue.innerHTML = Math.round(data.main.temp)+'°C';
            cityValue.innerHTML = cityName[0].toUpperCase() + cityName.slice(1);
            humidityVal.innerHTML = data.main.humidity+'%';
            windSpeed.innerHTML = data.wind.speed+' km/h';
            weatherIcon.src = `icons/${data.weather[0].main}.png`;
            nullCity.innerHTML = `${data.weather[0].description}`;
            
            card.style.display = 'block';
            weatherTab.style.display = 'block';
            nullCity.style.display = 'block';
            console.log(data);
    
        }
        catch (error){
            card.style.display = 'block';
            nullCity.style.display = 'none';
            weatherTab.style.display = 'none';
        }
    }
        

locationYes.addEventListener('click', ()=>{
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            findMyCoordinates, 
            (error) => {
                console.error("Geolocation error:", error);
                nullCity.innerHTML = "Location access denied or unavailable.";
                nullCity.style.display = 'block';
                popover.style.display = 'none';
                card.style.display = 'block';
            }
        );
    } else {
        nullCity.innerHTML = "Geolocation not supported by your browser.";
        nullCity.style.display = 'block';
        popover.style.display = 'none';
        card.style.display = 'block';
    }    
});
locationNo.addEventListener('click', ()=>{
    card.style.display = 'block';
    popover.style.display ='none';
})
cityInput.addEventListener('input', ()=>{
    getSuggestions();
})
search.addEventListener('click', checkweather);
city.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter') {
        checkweather(); 
    }
});