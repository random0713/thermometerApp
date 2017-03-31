var EventEmitter = require("events").EventEmitter;
var http = require("http");
var util = require("util");

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = hour + ':' + min;
  return time;
}

function printWeatherData(city, temp, humidity){

	var message = '\n\nIn ' + city + ', the temperature is ' + temp + ' degrees \nand the humidity is '+  humidity +'%.\n\n';
	console.log(message);
}

function CityData(city, cityId, cityLon, cityLat, country, sunrise, sunset){

	var cityInfo = 'City: ' + city + '\nCity ID: ' + cityId + '\nLongitude: ' + cityLon + '\nLatitude: ' 
	+ cityLat + '\nCountry: ' + country + '\nSunrise: '+  sunrise +'\nSunset: ' + sunset +'\n\n';
	console.log(cityInfo);
}

function City(city){

  EventEmitter.call(this);

  profileEmitter = this;

//Connect to the API

  var request = http.get("http://api.openweathermap.org/data/2.5/weather?q="+ city +"&units=imperial&APPID=bfb96733b03b5837c96c76cfb0556aa0", function(response){
    var body = "";

    if(response.statusCode !==200){
        request.abort();
        //Status Code Error
        profileEmitter.emit("error", new Error("There was an error getting the weather data for " + city + ". (" + http.STATUS_CODES[response.statusCode] + ")"));
    }

  //Read the data

    response.on('data', function (chunk) {
      body += chunk;
      profileEmitter.emit("data", chunk);
    });

    response.on('end', function(){
    	if(response.statusCode === 200){
          try{
              var weatherData = JSON.parse(body);
              /*printWeatherData(weatherData.name, weatherData.main.temp, weatherData.main.humidity);
              CityData(weatherData.name, weatherData.id, weatherData.coord.lon, weatherData.coord.lat, 
              weatherData.sys.country, timeConverter(weatherData.sys.sunrise), timeConverter(weatherData.sys.sunset));*/
              profileEmitter.emit("end", weatherData);
          } catch(error){
              profileEmitter.emit("error", error);
          }
      }
    
  	/*console.dir(weatherData);*/
    }).on("error", function(error){
      profileEmitter.emit("error", error);
    });

  });

}

util.inherits( City, EventEmitter );

module.exports = City;