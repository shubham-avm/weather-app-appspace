var init = function () {
  $cardApi.subscribeModelUpdate(updateModel);
  $cardApi.init();
}

var updateModel = async function () {
  let location = $cardApi.getModelProperty("location").value||"";
  let key = $cardApi.getModelProperty("key").value||""
  console.log(key);

  let background = $cardApi.getModelProperty("background").value||undefined
  console.log(background);
  
  let textColor = $cardApi.getModelProperty("text_color").value||""
  // console.log(textColor);
  let unitType = $cardApi.getModelProperty("units").value||""
  console.log(unitType);

  let weatherData = await getWeather(location,key)
  let forecastData = await getForecast(location,key)
  console.log(weatherData);
  applyBackgroundStyle(background)
  changeCurrentWeather(location,weatherData,unitType)
  changeForecast(forecastData)
  changeTextColor(textColor)
}

// Api Call
const  getWeather = async function(location,key){
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${key}`
  const res = await fetch(url)
  const data = await res.json()
  // console.log(data);
  // console.log(data.name);
  // //console.log(data.weather[0].main);
  // console.log(data.main.temp);
  return data
}

const changeCurrentWeather = function (location,weather,unitType) {
  let iconCode = weather.weather[0].icon
  let iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`
  console.log(iconUrl);
  $('h4.location').html(location)
  // console.log(weather.main.temp);
  $('#current-temperature').html(`${weather.main.temp} °${unitType}`)
  console.log(weather.weather[0].main);
  $('#feels-like').html(weather.main.feels_like)
  $('h5#weather').html(weather.weather[0].main)
  $('img#weather-icon').attr("src",iconUrl)
}

const getForecast = async function (location,key) {
  const foreCastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${key}`
  const res = await fetch(foreCastUrl)
  const data = await res.json()
  return data
}
const changeForecast = function (data) {
  const modifiedCards = data.list.slice(1,6).map((el) =>{
    let cards = `
      <div class="row row1">${el.main.temp}°C </div>
      <div class="row2"><img class="img-fluid" src="${makeIconURL(el.weather[0].icon)}"/></div>
      <div class="row row3">${el.weather[0].main}</div>
    `
    return cards
  })
  appendWeatherCards(modifiedCards)
}

const makeIconURL = (iconId) => `https://openweathermap.org/img/wn/${iconId}@2x.png`

const appendWeatherCards = (cards) => {
  console.log(cards.length);
  let row = $('#forecast-row')
  console.log(row[0].children.length);
  if(row[0].children.length < 5){
    cards.forEach(card => {
      const col = document.createElement('div');
      col.className = "col"
      col.innerHTML = card
      console.log(col);
      row.append(col)
      console.log(row);
    });
  }
}

const changeTextColor = function (textColor) {
  console.log(textColor);
  $("body").css("color",textColor ||"#FFF")
}

const applyBackgroundStyle = function (background) {
  //console.log($(document.body).style);
  $("body").css("background-color",background.bgColor ||"#FFF")
  //$(document.body).style.backgroundColor = background.bgColor||"#FFF"

  if (background.bgImage !== null && background.bgImage !==""){
    $("body").css('background-image', 'url("' + background.bgImage + '")');
  }
	else{
    if($("body").css('background-image'))
    delete background
  }			
}
setInterval(()=>{
  init()
},600000)

