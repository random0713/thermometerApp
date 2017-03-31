//modules dependencies
var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectid = require('mongodb').ObjectID;
var cityWeather = require('../lib/weather');
var http = require('http');
var less = require('less');
var url = 'mongodb://localhost:27017/temperature';


//id temperature in the house (in collection 'temp')
var localTempId = "58da67ef367931640c80cde0";
//current date
var date = new Date();

//set default temperature to Saarbrucken and temp in house (localTemp) when rendering 'index'
router.get('/', ensureAuthenticated, function(request, response) {
	mongo.connect(url, function(error, db) {
		if (error) throw error;
		var city = 'Saarbrucken';
		var cityProfile = new cityWeather(city);
		db.collection('temp').findOne({"_id": objectid(localTempId)}, function(error, doc) {
			if (error) throw error;;
			if (doc) {
			cityProfile.on('end', function(weatherData) {
				//temp in celcius, because default temp of API is fahrenheit. we'd like it here to be celcius
				var weather = ((weatherData.main.temp - 32) * (5/9)).toFixed(2);
				var temp = parseInt(doc.temp);
				var r = 90;
				var maxTemp = 35;
				var minTemp = 0;
				if (temp > maxTemp) {
					temp = 35;
					request.flash('error_msg', 'Die maximale Temperature ist erreicht');
				}
				if (temp < minTemp) {
					temp = 0;
				}
				if (isNaN(temp)) {
					temp = 35;
				}
				var circle = Math.PI* (r*2);
				var tempCircle = ((maxTemp-temp)/maxTemp)*circle;
				var values = {
					WeatherIcon: weatherData.weather[0].icon,
					cityName: weatherData.name,
					temperature:weather,
					humidity: weatherData.main.humidity,
					localTemp: temp,
					date: date.toDateString(),
					tempCircle: tempCircle
					}
				db.close();
				response.render('index', values);
				});
			}
		});
	});
	
});

router.get('/newCity', function(request, response) {
	response.render('newCity');
});



//enables user to set a new city
router.post('/', function(request, response) {
	mongo.connect(url, function(error, db) {
		if (error) throw error;
		var city = request.body.cityName;
		var cityProfile = new cityWeather(city);
		db.collection('temp').findOne({"_id": objectid(localTempId)}, function(error, doc) {
			if (error) throw error;;
			if (doc) {
			cityProfile.on('end', function(weatherData) {
				//temp in celcius
				var weather = ((weatherData.main.temp - 32) * (5/9)).toFixed(2);
				var temp = parseInt(doc.temp);
				var r = 90;
				var maxTemp = 35;
				var minTemp = 0;
				if (temp > maxTemp) {
					temp = 35;
					request.flash('error_msg', 'Die maximale Temperature ist erreicht');
				}
				if (temp < minTemp) {
					temp = 0;
				}
				if (isNaN(temp)) {
					temp = 35;
				}
				var circle = Math.PI* (r*2);
				var tempCircle = ((maxTemp-temp)/maxTemp)*circle;
				
				
				var values = {
					WeatherIcon: weatherData.weather[0].icon,
					cityName: weatherData.name,
					temperature:weather,
					humidity: weatherData.main.humidity,
					localTemp: temp,
					date: date.toDateString(),
					tempCircle: tempCircle
					}
			db.close();
			
				response.render('index', values);
			
				});
			}
		});
	});
});



//Update the temperature of the local

router.post('/update', function(request, response) {
	var item = { temp: request.body.temp};
	
	mongo.connect(url, function(error, db){
		if (error) throw error; 
		//collection in database
		try{
		db.collection('temp').updateOne({"_id": objectid(localTempId)}, {$set: item}, function(error, result)  {
			if (error) throw error;
			console.log('updated');
			db.close();
			response.redirect('/');
		});
		} catch (e) {
			console.log(e);
		}
		
	});
});
	
function ensureAuthenticated(request, response, next) {
	if (request.isAuthenticated()) {
		return next();
	} else {
		response.redirect('/users/login');
	}
}

module.exports = router;

