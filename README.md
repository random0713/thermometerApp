# thermometerApp

This app will give you informations about the current weather temperature in a city of your choice (temperature (°C) and humidity). 
It will also let you change the temperature of the room (local heater simulation) if, and only if you are an administrator. 
The maximum temperature of the room is 35 °C and the lowest is 0°C. Going above those values will just set the thermometer to the lowest 
point (0°C) or to the highest point (35°C).
Also, if you're an administrator, you will also be able to see all the users list and give them the role of an administrator, 
in order to let them have the priviledge too to change the temperature of the room. 

## Features

- sign-up page
- login system
- admin and user panel (with different priviledges)
- weather forecast

## Prerequisities

To run the programm, you wil need:

* Node.js --> download and install
* MongoDB --> download and install (it's our datastore).

Ensure the localhost adress you are using is localhost:27017.
In the mongoDB, you will need to create two (or one if you want to change) database(s). In this project, I'm using 'temperature' and   
'loginapp' as databases (you can use whatever you want).

Just type in the CMD (in mongo):
```
use loginapp; //or your MongoDB name
```

## Tools, prerequisites

* npm --> Node.js package manager. Directly installed after downloading Node.js.
* bower --> Web package manager. (not really used in this project but you can develop it for your own project).

Bower in command line:
```
npm install -g bower
```
(You will also need to install msysgit in order to be able to install modules in the bower.json).

## Additional packages:

* Express (npm module in package.json).
* Mongoose (npm module in package.json).
* Passport (npm module in package.json).
* UI Bootstrap (bower module in bower.json).

## Technological specifications

- Back-end: MongoDB, Mongoose, Node.js, Passport, Express, `body-parser`.
- Front-end: bootstrap and own style.

## Running in production

```
node app.js
```
Then open browser and go to:
http://localhost:3000



