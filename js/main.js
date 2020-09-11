const api = {
  key: "6a9e528e243891b98f6ae9daaa394068",
  base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
}

function getResults (query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
  .then(weather => {
    return weather.json();
  }).then(displayResults);
}

function displayResults(weather) {
  let city = document.querySelector('.right .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector('.right .date');
  date.innerText = dateBuilder(now);

  let temp = document.querySelector('.right .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}°C`;

  let weather_desc = document.querySelector('.left .weather-status'); 
  weather_desc.innerText =weather.weather[0].description;

  let hilow = document.querySelector('.hi-low');
  hilow.innerHTML = `${Math.round(weather.main.temp_min)}°C | ${Math.round(weather.main.temp_max)}°C`;

  let weather_icon = document.querySelector('.icon');
  weather_icon.innerHTML = `<img src="img/icons/${weather.weather[0].icon}.png"/>`;

  let windspeed = document.querySelector('.bottom .wind');
  windspeed.innerText = `${weather.wind.speed} m/s`;

  let humidity = document.querySelector('.bottom .humidity');
  humidity.innerText = `${weather.main.humidity} %`;

  let pressure = document.querySelector('.bottom .pressure');
  pressure.innerText = `${Math.round(weather.main.pressure)} hPa`;

  let suntime = document.querySelector('.bottom .suntime');
  suntime.innerText = `${timeConverter(weather.sys.sunrise)}| ${timeConverter(weather.sys.sunset)}`;

  //time
  function timeConverter(UNIX_timestamp){
    let a = new Date(UNIX_timestamp * 1000);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    //let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    let time = hour + ':' + min ;
    return time;
  }

  let today = new Date();
  let time = today.getHours()
  + ":" + today.getMinutes() + ":" + today.getSeconds();
  //document.querySelector(".time").innerHTML = time;

  let id = weather.name + "," + time;

  //local storage
  let weather_search = JSON.stringify(weather);

localStorage.setItem(id, weather_search);
let weather_info = JSON.parse(localStorage.getItem(id));

//console.log(weather_info);
  
}

function dateBuilder(d) {
  let months = ["January", "February", "March", "April", "May", "June", "Jully", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}

